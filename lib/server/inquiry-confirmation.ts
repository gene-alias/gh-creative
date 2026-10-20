import type { ProjectBrief } from '../../components/project/brief-model.ts';

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ]!,
  );
}

/** Transactional receipt; replies go directly to Gene, with no tracking assets. */
export function inquiryConfirmation(brief: ProjectBrief) {
  const firstName = brief.name.trim().split(/\s+/)[0];
  const subject = 'We’ve received your inquiry / GH Creative';
  const text = [
    'GH CREATIVE',
    '',
    `Hi ${firstName},`,
    '',
    'Thanks for getting in touch. I’ve received your inquiry and will review your project details.',
    'I’ll get back to you to discuss the next steps. If you have anything to add, just reply to this email.',
    '',
    'YOUR INQUIRY',
    `Services: ${brief.services.join(', ')}`,
    `Budget (AUD): ${brief.budget}`,
    `Timing: ${brief.timing}`,
    '',
    'Thanks,',
    'Gene',
    'GH Creative',
    'gene@alias.com.ai',
    'Melbourne / Worldwide',
  ].join('\n');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:24px 12px;background:#08080b;color:#f2f1ed;font-family:Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">Thanks for getting in touch. Your inquiry is with Gene at GH Creative.</div>
<table role="presentation" style="width:100%;border-collapse:collapse"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:560px;border-collapse:collapse;background:#171518;border:1px solid #493438"><tr><td style="padding:32px">
<p style="margin:0 0 36px;color:#ff5962;font-size:14px;font-weight:bold;letter-spacing:2px">GH CREATIVE</p>
<h1 style="margin:0 0 24px;font-size:30px;line-height:1.15;color:#f2f1ed">YOUR IDEA IS IN.</h1>
<p style="font-size:16px;line-height:1.7">Hi ${escapeHtml(firstName)},</p>
<p style="font-size:16px;line-height:1.7;color:#d2ccd1">Thanks for getting in touch. I’ve received your inquiry and will review your project details.</p>
<p style="font-size:16px;line-height:1.7;color:#d2ccd1">I’ll get back to you to discuss the next steps. If you have anything to add, just reply to this email.</p>
<div style="margin:28px 0;padding:20px;border-top:1px solid #554047;border-bottom:1px solid #554047">
<p style="margin:0 0 12px;font-size:11px;letter-spacing:1px;color:#ff858b">YOUR INQUIRY</p>
<p style="margin:0;font-size:14px;line-height:1.8;color:#d2ccd1"><strong>Services:</strong> ${escapeHtml(brief.services.join(', '))}<br><strong>Budget (AUD):</strong> ${escapeHtml(brief.budget)}<br><strong>Timing:</strong> ${escapeHtml(brief.timing)}</p>
</div>
<p style="font-size:16px;line-height:1.7">Thanks,<br>Gene</p>
<p style="margin:24px 0 0;font-size:12px;line-height:1.8;color:#b9afb7">GH Creative<br><a href="mailto:gene@alias.com.ai" style="color:#ff858b">gene@alias.com.ai</a><br>Melbourne / Worldwide</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}
