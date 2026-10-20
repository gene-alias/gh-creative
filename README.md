# GH Creative

Mobile creative mini-site with an animated Earth, expandable services, work
galleries and a conversational inquiry form. A shared design system retains the GH identity.

## Local development

```sh
npm ci
GH_STATIC_EXPORT=1 npm run dev -- --port 4317
```

The default development and build commands retain the existing Vinext/Cloudflare
setup. The animated globe respects the operating system’s reduced-motion setting.

## Vercel previews

```sh
npm run build:vercel
vercel deploy --target preview --scope genes-projects-31163c3c
```

The Vercel build exports the current routes to static HTML and RSC files in
`dist/client`, alongside scripts, fonts and artwork. `vercel.json` configures
the build and clean page URLs. The export flag applies only to that build;
the local development server continues using its original configuration.

## Project brief delivery (Resend)

The original one-question-at-a-time popup ends with **Review details → Send project brief → Confirmation**.
`POST /api/project-brief` emails the brief to **gene@alias.com.ai** using Resend.
The visitor’s email is the Reply-To address for Gene’s notification. After Resend
accepts that notification, the server sends a separate branded confirmation to
the validated visitor email. Replies to the confirmation go to gene@alias.com.ai.
Both messages use the verified PROJECT_BRIEF_FROM sender. Request payloads cannot
override Gene’s address, the confirmation recipient or the confirmation copy. Downloads are optional after a successful send.

Configure these **server-only** environment variables in Vercel (Preview and
Production) and in `.env.local` for development:

```dotenv
RESEND_API_KEY=your_resend_api_key
PROJECT_BRIEF_FROM="GH Creative <projects@your-verified-domain.com>"
```

Use a sender address on a domain verified in your Resend account. The example
address above is a placeholder. Do not prefix these variables with `NEXT_PUBLIC_`
or `VITE_`, and do not commit the key. After setting them, restart local development
or redeploy the site for the new settings to take effect.

The Vercel `/api` function runs alongside the static export. Local `npm run dev`
uses the same handler through Vite middleware. The Cloudflare production build
would require its own route adapter; current production email hosting targets Vercel.

Delivery is not live until the Resend settings are configured and deployed.
Missing configuration, provider errors, and timeouts show an error and retain the
visitor's answers. The inquiry success screen appears only after Resend returns a notification
message ID (acceptance for delivery, not an inbox delivery receipt). The receipt
uses a separate idempotency key. If only the receipt fails, the inquiry remains
successful and the page offers **Try confirmation again**. That retry reuses both
message keys to avoid resending Gene’s notification within the provider’s retention
window. No confirmation is sent when Gene’s notification fails. Unchanged retries use
the same idempotency key to avoid duplicate sends within Resend's retention window.
Server-side validation, body-size limits, same-origin checks, and a honeypot are
included. No project content or credentials are written to application logs.

Check the handler without sending mail:

```sh
node --test lib/server/project-brief.test.mjs components/project/brief-model.test.mjs
```

Before publishing, configure Resend and send one brief with test details to Gene's
inbox. Confirm the message arrives and Reply targets the visitor's address.

References: [Resend sending API](https://resend.com/docs/api-reference/emails/send-email),
[idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys),
[Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js).

Source repository: https://github.com/gene-alias/gh-creative. Vercel CLI
deployments do not require a Git remote. Credentials and generated files are
excluded from both Git and deployment uploads.

## Mobile mini-site

The homepage and work galleries share a 480px maximum width on every screen,
with native scrolling, expandable services and persistent bottom navigation.
The full studio hero is retained: GH wordmark, hamburger menu, animated Earth,
original two-line headline, outlined project action and contact footer. The Earth
uses column-based measurements, pauses offscreen and respects reduced motion.
Body copy uses locally hosted Inter Light (300); existing display headings,
wordmark and technical labels are retained.

The original conversational form is restored: introductions, contact details,
optional business details, services, project idea, budget, timing and a final
review. Each step validates before advancing; answers persist while browsing
this visit. Review items can be edited individually. Service-specific inquiry
buttons preselect the service. After sending, clients can download their brief.

The branded confirmation template is in lib/server/inquiry-confirmation.ts.
Preview it with fixture details before sending real mail. It includes a greeting,
a receipt message, selected services, budget and timing; replies go to Gene.
No live receipt can be sent until the Resend sender domain is verified and both
server environment variables are configured for the intended deployment.


## Selected work and inquiry receipt design

Selected Work now has three categories: Websites (CENTUM, Incredible Kitchens,
Loverboy Club), Visual (before/after artwork), and Branding (Incredible Kitchens,
ALIAS). Website cards currently use imagery from the local projects; they are
captioned as imagery rather than finished website screenshots. The visual gallery
is intentionally empty until Gene supplies the artwork pairs. Add those pairs in
`app/work/visual-design/page.tsx`; the gallery includes a keyboard-accessible
before/after range control.

Section 03 uses Gene's supplied `GH STATIC.png`, copied without changes to
`public/assets/gene-studio.png`. Portfolio assets were copied from these local
projects: `centum-website`, `incredible-kitchens/incredible-kitchens-web`,
`loverboy-club-website`, and `ALIAS CREATIVE`, under Gene's Cursor directory.

The confirmation email was redesigned in Paper, with desktop and mobile layouts:
https://app.paper.design/file/01M5D2HNFGD2X2JCWSX4P58S0Z/p-1-0

Its logo and scarlet receipt artwork were exported from those layouts and are
bundled as inline CID attachments in `lib/server/receipt-art.ts`. The greeting,
project recap, reply link and signature remain live HTML text. Body styles prefer
Inter Light and fall back to the recipient's Arial/Helvetica when Inter is not
available. No image host is required. To update artwork, export the Paper nodes,
replace the PNGs in `public/assets/email`, and regenerate the corresponding
base64 strings in the server module.
