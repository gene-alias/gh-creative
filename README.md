# GH Creative

Mobile-first creative studio website with scroll-driven reveals, pinned sections,
interactive service rows and a shared design system.

## Local development

```sh
npm ci
npm run dev -- --port 3005
```

The default development and build commands retain the existing Vinext/Cloudflare
setup. Pause motion and the operating system's reduced-motion setting restore
the static layout.

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

The popup ends with **Review details → Send project brief → Confirmation**.
`POST /api/project-brief` emails the brief to **gene@alias.com.ai** using Resend.
The visitor's email is the Reply-To address. The recipient is fixed on the server;
requests cannot override it. Downloads are optional after a successful send.

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
visitor's answers. The success screen appears only after Resend returns a message
ID (acceptance for delivery, not an inbox delivery receipt). Unchanged retries use
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

The Git history is local until a remote repository is connected. Vercel CLI
deployments do not require a Git remote. Credentials and generated files are
excluded from both Git and deployment uploads.
