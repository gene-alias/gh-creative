import type { ProjectBrief } from '../../components/project/brief-model.ts';
import { receiptArt } from './receipt-art.ts';
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ]!,
  );
}
/** Paper-designed receipt. Brand artwork is inline CID; the message stays live text. */
export function inquiryConfirmation(brief: ProjectBrief) {
  const firstName = brief.name.trim().split(/\s+/)[0];
  const subject = 'We’ve received your inquiry / GH Creative';
  const text = [
    'GH CREATIVE',
    'INQUIRY RECEIVED / YOUR IDEA IS IN.',
    '',
    `Hi ${firstName},`,
    '',
    'Thanks for sharing your idea with me. Your inquiry has landed, and I’m looking forward to learning more.',
    'I’ll review your project details and get back to you to talk through the next steps.',
    '',
    'A QUICK RECAP',
    `Services: ${brief.services.join(', ')}`,
    `Budget (AUD): ${brief.budget}`,
    `Timing: ${brief.timing}`,
    '',
    'Have anything to add? Reply to this email. Your message comes straight to me.',
    '',
    'Talk soon,',
    'Gene.',
    'Your creative partner / GH Creative',
    'gene@alias.com.ai',
    'Melbourne / Worldwide',
  ].join('\n');
  const rows = [
    ['Services', brief.services.join(', ')],
    ['Budget · AUD', brief.budget],
    ['Timing', brief.timing],
  ]
    .map(
      ([label, value]) =>
        `<tr><td width="104" valign="top" style="width:104px;padding:11px 20px 11px 0;border-bottom:1px solid #e4e4e4;font-size:14px;line-height:24px;color:#707070">${label}</td><td valign="top" style="padding:11px 0;border-bottom:1px solid #e4e4e4;font-size:16px;line-height:24px;font-weight:400;color:#080808;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${subject}</title><style>
  body,table,td,p,a{font-family:Inter,Arial,Helvetica,sans-serif}table{border-collapse:collapse}img{border:0}a{text-decoration:none}.mobile-art{display:none;max-height:0;overflow:hidden;mso-hide:all}
  @media only screen and (max-width:480px){.outer{padding:0!important}.email-gutter{padding-left:24px!important;padding-right:24px!important}.wordmark{width:190px!important}.desktop-art{display:none!important;max-height:0!important;overflow:hidden!important}.mobile-art{display:block!important;max-height:none!important;overflow:visible!important}.footer-meta{display:block!important;width:100%!important;padding-top:6px!important;text-align:left!important}.body-copy{font-size:16px!important;line-height:26px!important}}
  </style></head><body style="margin:0;background:#eeeeee;color:#080808"><div style="display:none;max-height:0;overflow:hidden">Your idea is in. Thanks for getting in touch with GH Creative.</div>
  <table role="presentation" width="100%"><tr><td class="outer" align="center" style="padding:24px 0"><table role="presentation" width="600" style="width:100%;max-width:600px;background:#ffffff">
  <tr><td class="email-gutter" style="padding:34px 40px;background:#080808"><table role="presentation" width="100%"><tr><td valign="middle"><img class="wordmark" src="cid:gh-receipt-wordmark" width="224" alt="GH Creative" style="display:block;width:224px;max-width:100%;height:auto"></td><td valign="middle" align="right" style="font-family:'Courier New',monospace;font-size:10px;line-height:16px;letter-spacing:.04em;color:#c5c5c5">INDEPENDENT<br>BY DESIGN.</td></tr></table></td></tr>
  <tr><td style="background:#ff3f46"><div class="desktop-art"><img src="cid:gh-receipt-hero" width="600" alt="INQUIRY RECEIVED. YOUR IDEA IS IN." style="display:block;width:100%;height:auto;color:#080808;font-size:32px;font-weight:bold"></div><div class="mobile-art"><img src="cid:gh-receipt-hero-mobile" width="390" alt="INQUIRY RECEIVED. YOUR IDEA IS IN." style="display:block;width:100%;height:auto;color:#080808;font-size:32px;font-weight:bold"></div></td></tr>
  <tr><td class="email-gutter" style="padding:36px 40px 32px"><p style="margin:0 0 20px;font-size:24px;line-height:32px;font-weight:400;letter-spacing:-.02em">Hi ${escapeHtml(firstName)},</p><p class="body-copy" style="margin:0 0 20px;font-size:17px;line-height:27px;font-weight:300;color:#3c3c3c;letter-spacing:-.01em">Thanks for sharing your idea with me. Your inquiry has landed, and I’m looking forward to learning more.</p><p class="body-copy" style="margin:0;font-size:17px;line-height:27px;font-weight:300;color:#3c3c3c;letter-spacing:-.01em">I’ll review your project details and get back to you to talk through the next steps.</p></td></tr>
  <tr><td class="email-gutter" style="padding:0 40px 30px"><table role="presentation" width="100%"><tr><td colspan="2" style="padding:24px 0 16px;border-top:1px solid #e4e4e4;font-family:'Courier New',monospace;font-size:11px;line-height:18px;letter-spacing:.08em;color:#707070">A QUICK RECAP</td></tr>${rows}</table></td></tr>
  <tr><td class="email-gutter" style="padding:0 40px 32px"><table role="presentation" width="100%"><tr><td style="background:#080808"><a href="mailto:gene@alias.com.ai?subject=Re%3A%20Your%20GH%20Creative%20inquiry" style="display:block;padding:20px;font-family:'Courier New',monospace;font-size:12px;line-height:18px;letter-spacing:.025em;color:#ffffff">ADD TO YOUR INQUIRY <span style="float:right;color:#ff3f46;font-size:20px">&#8599;</span></a></td></tr></table><p style="margin:14px 0 0;font-size:13px;line-height:21px;font-weight:300;color:#707070">Or just hit reply. Your message comes straight to me.</p></td></tr>
  <tr><td class="email-gutter" style="padding:0 40px 36px"><p style="margin:0 0 6px;font-size:16px;line-height:25px;font-weight:300;color:#3c3c3c">Talk soon,</p><p style="margin:0 0 11px;font-size:28px;line-height:35px;font-weight:400;letter-spacing:-.04em">Gene.</p><p style="margin:0;padding-left:12px;border-left:3px solid #ff3f46;font-size:14px;line-height:24px;font-weight:300;color:#3c3c3c">Your creative partner · GH Creative</p></td></tr>
  <tr><td class="email-gutter" style="padding:25px 40px;border-top:3px solid #ff3f46;background:#080808"><p style="margin:0 0 12px;font-size:14px;line-height:22px;font-weight:300"><a href="mailto:gene@alias.com.ai" style="color:#ffffff">gene@alias.com.ai</a></p><table role="presentation" width="100%"><tr><td class="footer-meta" style="font-family:'Courier New',monospace;font-size:10px;line-height:16px;letter-spacing:.035em;color:#bcbcbc">MELBOURNE / WORLDWIDE</td><td class="footer-meta" align="right" style="font-family:'Courier New',monospace;font-size:10px;line-height:16px;letter-spacing:.035em;color:#bcbcbc">WEB · VISUAL · BRAND · AUDIO</td></tr></table></td></tr>
  </table></td></tr></table></body></html>`;
  return { subject, text, html, attachments: receiptArt };
}
