import { inquiryConfirmation } from './inquiry-confirmation.ts';
import {
  budgetOptions,
  formatBrief,
  serviceOptions,
  timingOptions,
  validateBriefStep,
  type ProjectBrief,
} from '../../components/project/brief-model.ts';

export const BRIEF_RECIPIENT = 'gene@alias.com.ai';
export const MAX_BRIEF_BYTES = 40_000;
export type BriefDeliveryConfig = { apiKey?: string; from?: string };

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function parseBrief(value: unknown): ProjectBrief | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const limits = {
    name: 120,
    email: 254,
    phone: 40,
    company: 160,
    website: 500,
    project: 5000,
    budget: 80,
    timing: 80,
  };
  const strings: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof input[key] !== 'string' || input[key].length > limit)
      return null;
    strings[key] = input[key].trim();
  }
  if (
    !Array.isArray(input.services) ||
    input.services.length > serviceOptions.length ||
    input.services.some(
      (item) => typeof item !== 'string' || !serviceOptions.includes(item),
    )
  )
    return null;
  const brief = {
    ...strings,
    services: [...new Set(input.services)],
  } as ProjectBrief;
  if (
    !budgetOptions.includes(brief.budget) ||
    !timingOptions.includes(brief.timing)
  )
    return null;
  if (
    Array.from({ length: 7 }, (_, step) => validateBriefStep(step, brief)).some(
      Boolean,
    )
  )
    return null;
  return brief;
}

export async function deliverProjectBrief(
  request: Request,
  config: BriefDeliveryConfig,
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json(403, {
      error: 'Please send your brief from the GH Creative website.',
    });
  }
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  ) {
    return json(415, { error: 'Please send a valid project brief.' });
  }
  if (Number(request.headers.get('content-length') || 0) > MAX_BRIEF_BYTES) {
    return json(413, {
      error: 'Your brief is too long. Please shorten it and try again.',
    });
  }
  let payload: Record<string, unknown>;
  try {
    // Bound streamed bodies too; content-length is not always supplied.
    const reader = request.body?.getReader();
    if (!reader)
      return json(400, { error: 'Please complete your project brief.' });
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BRIEF_BYTES) {
        await reader.cancel();
        return json(413, {
          error: 'Your brief is too long. Please shorten it and try again.',
        });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      throw new Error('Invalid body');
    payload = parsed as Record<string, unknown>;
  } catch {
    return json(400, {
      error: 'Please complete your project brief and try again.',
    });
  }
  // A field hidden from visitors catches simple automated form submissions.
  if (payload.contactFax !== '')
    return json(422, { error: 'Unable to send this enquiry.' });
  const brief = parseBrief(payload.brief);
  if (
    !brief ||
    typeof payload.submissionId !== 'string' ||
    !/^[a-zA-Z0-9-]{20,80}$/.test(payload.submissionId)
  ) {
    return json(422, {
      error: 'Please check your details and complete all required questions.',
    });
  }
  if (!config.apiKey || !config.from) {
    return json(503, {
      error:
        'Enquiry delivery is temporarily unavailable. Your answers are still here. Please try again later.',
    });
  }
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        // Retrying an unchanged brief reuses this key, avoiding duplicate emails.
        'Idempotency-Key': `project-brief/${payload.submissionId}`,
      },
      body: JSON.stringify({
        from: config.from,
        to: [BRIEF_RECIPIENT],
        reply_to: brief.email,
        subject: `New project brief / ${brief.name.replace(/[\r\n]/g, ' ')}`,
        text: formatBrief(brief),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      return json(502, {
        error:
          'We couldn’t send your brief. Your answers are saved here. Please try again.',
      });
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== 'object' ||
      !('id' in result) ||
      typeof result.id !== 'string' ||
      !result.id
    ) {
      return json(502, {
        error: 'We couldn’t confirm your brief was sent. Please try again.',
      });
    }
    // The inquiry has been accepted. A receipt failure must not report that
    // Gene's notification failed, or encourage a new, duplicate submission.
    let confirmationSent = false;
    try {
      const confirmation = await send('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `project-brief-confirmation/${payload.submissionId}`,
        },
        body: JSON.stringify({
          from: config.from,
          to: [brief.email],
          reply_to: BRIEF_RECIPIENT,
          ...inquiryConfirmation(brief),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (confirmation.ok) {
        const receipt: unknown = await confirmation.json();
        confirmationSent = !!(
          receipt &&
          typeof receipt === 'object' &&
          'id' in receipt &&
          typeof receipt.id === 'string' &&
          receipt.id
        );
      }
    } catch {
      // Keep the accepted inquiry successful if the receipt provider times out.
    }
    return json(200, { sent: true, confirmationSent });
  } catch {
    return json(502, {
      error:
        'We couldn’t confirm your brief was sent. Check your connection and try again.',
    });
  }
}
