import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deliverProjectBrief,
  BRIEF_RECIPIENT,
  MAX_BRIEF_BYTES,
} from './project-brief.ts';

const config = {
  apiKey: 'test-key-never-sent',
  from: 'GH Creative <projects@example.com>',
};
const valid = () => ({
  submissionId: '00000000-0000-4000-8000-000000000001',
  contactFax: '',
  brief: {
    name: 'Alex Example',
    email: 'alex@example.com',
    phone: '+61 400 000 000',
    company: 'Example Studio',
    website: 'example.com',
    services: ['Web design', 'Marketing'],
    project: 'A new website for our studio.\nLaunch the new portfolio.',
    budget: 'Let’s work it out',
    timing: 'I’m flexible',
  },
});
function request(payload = valid(), headers = {}) {
  return new Request('https://gh.example/api/project-brief', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://gh.example',
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}
const neverSend = async () => {
  assert.fail('Invalid requests must not send email');
};

test('sends the complete inquiry to Gene, then a separate client receipt with reply-to and distinct retry keys', async () => {
  const messages = [];
  const response = await deliverProjectBrief(
    request({
      ...valid(),
      to: 'untrusted@example.com',
      confirmationTo: 'untrusted@example.com',
    }),
    config,
    async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      messages.push({ ...options, message: JSON.parse(options.body) });
      return Response.json({ id: `email-${messages.length}` });
    },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    sent: true,
    confirmationSent: true,
  });
  assert.equal(messages.length, 2);
  const [inquiry, confirmation] = messages;
  assert.deepEqual(inquiry.message.to, [BRIEF_RECIPIENT]);
  assert.equal(BRIEF_RECIPIENT, 'gene@alias.com.ai');
  assert.equal(inquiry.message.reply_to, valid().brief.email);
  for (const value of Object.values(valid().brief).flat())
    assert.ok(inquiry.message.text.includes(value));
  assert.deepEqual(confirmation.message.to, [valid().brief.email]);
  assert.equal(confirmation.message.reply_to, BRIEF_RECIPIENT);
  assert.ok(confirmation.message.text.includes('Hi Alex,'));
  assert.ok(confirmation.message.html.includes('YOUR IDEA IS IN.'));
  assert.ok(!confirmation.message.text.includes('untrusted@example.com'));
  for (const message of messages) {
    assert.equal(message.message.from, config.from);
    assert.equal(message.headers.Authorization, `Bearer ${config.apiKey}`);
  }
  assert.equal(
    inquiry.headers['Idempotency-Key'],
    `project-brief/${valid().submissionId}`,
  );
  assert.equal(
    confirmation.headers['Idempotency-Key'],
    `project-brief-confirmation/${valid().submissionId}`,
  );
});

test('missing credentials fail honestly rather than showing a sent confirmation', async () => {
  const response = await deliverProjectBrief(request(), {}, neverSend);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).sent, undefined);
});

test('provider failure, timeout and malformed success never report sent', async () => {
  for (const send of [
    async () =>
      Response.json({ message: 'private provider details' }, { status: 403 }),
    async () => {
      throw new Error('private network details');
    },
    async () => Response.json({}),
  ]) {
    const response = await deliverProjectBrief(request(), config, send);
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.ok(!body.includes('private'));
    assert.ok(!body.includes('"sent":true'));
  }
});

test('rejects invalid fields, unsupported choices and simple bot submissions', async () => {
  for (const payload of [
    {
      ...valid(),
      brief: { ...valid().brief, email: 'bad\r\nBcc: spam@example.com' },
    },
    { ...valid(), brief: { ...valid().brief, services: ['Injected service'] } },
    { ...valid(), brief: { ...valid().brief, project: 'short' } },
    { ...valid(), brief: { ...valid().brief, name: 'a'.repeat(121) } },
    { ...valid(), brief: null },
    { ...valid(), contactFax: 'bot-fill' },
    { ...valid(), submissionId: '../invalid' },
  ]) {
    assert.equal(
      (await deliverProjectBrief(request(payload), config, neverSend)).status,
      422,
    );
  }
});

test('rejects cross-origin, malformed and oversized requests before delivery', async () => {
  assert.equal(
    (
      await deliverProjectBrief(
        request(valid(), { Origin: 'https://elsewhere.example' }),
        config,
        neverSend,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await deliverProjectBrief(
        request(valid(), { 'Content-Type': 'text/plain' }),
        config,
        neverSend,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await deliverProjectBrief(
        new Request('https://gh.example/api/project-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{',
        }),
        config,
        neverSend,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await deliverProjectBrief(
        request({ extra: 'x'.repeat(MAX_BRIEF_BYTES) }),
        config,
        neverSend,
      )
    ).status,
    413,
  );
});

test('unchanged retries reuse each message key without mixing notification and confirmation', async () => {
  const keys = [];
  const send = async (_, options) => {
    keys.push(options.headers['Idempotency-Key']);
    return Response.json({ id: 'same-email' });
  };
  await deliverProjectBrief(request(), config, send);
  await deliverProjectBrief(request(), config, send);
  assert.equal(keys.length, 4);
  assert.equal(keys[0], keys[2]);
  assert.equal(keys[1], keys[3]);
  assert.notEqual(keys[0], keys[1]);
});

test('confirmation failures preserve the accepted inquiry instead of reporting a failed submission', async () => {
  for (const failure of [
    async () => Response.json({ error: 'private' }, { status: 403 }),
    async () => {
      throw new Error('private timeout');
    },
    async () => Response.json({}),
    async () => new Response('invalid json'),
  ]) {
    let calls = 0;
    const response = await deliverProjectBrief(
      request(),
      config,
      async (...args) => {
        calls++;
        return calls === 1
          ? Response.json({ id: 'inquiry-accepted' })
          : failure(...args);
      },
    );
    assert.equal(calls, 2);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      sent: true,
      confirmationSent: false,
    });
  }
});

test('a failed Gene notification never triggers a client confirmation', async () => {
  let calls = 0;
  const response = await deliverProjectBrief(request(), config, async () => {
    calls++;
    return Response.json({ error: 'unavailable' }, { status: 503 });
  });
  assert.equal(calls, 1);
  assert.equal(response.status, 502);
});

test('the receipt escapes the visitor name instead of allowing HTML injection', async () => {
  const messages = [];
  await deliverProjectBrief(
    request({ ...valid(), brief: { ...valid().brief, name: '<img/src=x>' } }),
    config,
    async (_, options) => {
      messages.push(JSON.parse(options.body));
      return Response.json({ id: 'accepted' });
    },
  );
  assert.ok(messages[1].html.includes('&lt;img/src=x&gt;'));
  assert.ok(!messages[1].html.includes('<img/src=x>'));
});

test('GET requests cannot trigger delivery', async () => {
  const response = await deliverProjectBrief(
    new Request('https://gh.example/api/project-brief'),
    config,
    neverSend,
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
});
