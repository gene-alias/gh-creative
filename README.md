# GH Creative

Full GH Creative website with the original desktop composition, animated Earth,
services, process, engagement options and conversational inquiry form. The uploaded
portfolio includes five website walkthroughs, 70 visual works and 36 branding assets
across six category marquees. The separate mini site remains on `codex/mobile-mini-site`.

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
Loverboy Club, KONSTRUKT, ALIAS), Visual (a curated gallery of finished work), and Branding (Incredible Kitchens,
ALIAS). Website previews play Gene’s supplied screen recordings as silent, looping videos. Still frames serve as loading posters.
The homepage category covers use the CENTUM preview and Incredible Kitchens business card artwork. The Visual gallery follows Gene’s revised six local categories and contains 70 images: Product & campaigns (9), Fashion & eyewear (16), Jewellery & portraits (15), Cinematic & character work (14), Architecture & interiors (7), and Fitness & training (9). The empty untitled folder is ignored, and the removed image is not included. The gallery contains individual artworks, with no before-and-after comparisons.

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

Thumbnail source recordings (from Gene’s Desktop) and selected timestamps:
- CENTUM.mov: 00:03
- Incredible Kitchens.mov: 00:01
- Loverboy CLub.mov: 00:02.5
- ALIAS Creative.mov: 00:03
- KONSTRUKT demo.mov: 00:01

Frames retain the full recording aspect ratio and are exported as 1440px-wide
JPEGs in `public/assets/work/*-thumbnail.jpg`. Original recordings remain local.


## Incredible Kitchens branding case study

The supplied branding artwork is shown in six groups: Logo & visual identity,
Print & stationery, Business documents, Advertising & campaign assets, Social
brand assets, and Email signatures. Captions describe the supplied work, including
mockups and sample invoice fields; no campaign performance or production claims
are added. All twelve supplied images are included, with the two individual
story ads alongside the campaign contact sheet. Each image opens a larger version
in a new tab for inspection.

Sources: Gene’s Desktop/BRANDING folder, plus Story 1.png under
INCREDIBLE KITCHENS/Ads Creatives and
01-your-home-made-incredible-1080x1920.png under INCREDIBLE KITCHENS/9.16 Ads.
WebP copies retain full image proportions and are stored in
public/assets/work/incredible-kitchens. The originals are unchanged. The artwork
is compressed for mobile browsing, with the ad contact sheet retained at its full
2560px width for legibility.


## Website video previews

The five website examples and homepage Websites
card use the supplied recordings. Mobile MP4 copies are in public/assets/work/videos:
H.264, 1280px wide, 24fps, yuv420p and fast-start metadata. The complete recordings
are retained; audio is removed for silent portfolio playback. Files total about
14.3 MB, with no single preview larger than 4.6 MB.

The shared WebsitePreview component starts playback when at least 25% of a video
is visible and pauses it offscreen or in a hidden browser tab. Native controls
allow pause, seek, fullscreen and manual playback when autoplay is unavailable.
A visitor’s manual pause is preserved when scrolling away and back. Reduced-motion
preferences disable automatic playback while retaining manual controls.
Videos use preload="none" so offscreen demos do not download before playback;
poster images remain visible while loading. The homepage video controls are
outside the category navigation link so playback does not trigger navigation.


## Visual work gallery

`lib/visual-work.json` contains the current category order, counts, descriptive
image titles, alt text and asset dimensions. It reflects Gene’s revised source
folders under Desktop/Visual Design, rather than the earlier sorting index.
Source filenames and paths are not published in the gallery metadata.

The gallery uses two columns with complete image proportions, horizontal category
filters, and batches of 18 thumbnails. Category changes reset the batch size.
The viewer opens the selected full image, with previous/next controls, arrow-key
navigation, Escape to close, a trapped keyboard focus and return focus to the
opening tile. Full image links support native browser zoom in a separate tab.

Public WebP copies are under public/assets/work/visual: thumbnails fit within
600×900, and viewer images fit within 1800×2200. Originals are unchanged. Below-fold
thumbnails load lazily, and larger assets load only when selected. The homepage
Visual cover uses the selected Eyewear / teal I artwork.


## ALIAS branding and website work

The ALIAS website recording is listed under Websites. Branding now uses Gene’s
supplied ALIAS Brand Kit: app icon, liquid-metal logo loop, business card front
and reverse, sample invoice, dark/light email signatures, sharing preview and
dark/light Facebook covers. Written descriptions explain each application.

Static WebP copies in public/assets/work/alias preserve their proportions. The
supplied six-second GIF is delivered as a silent H.264 MP4 with its original
square proportions, a loading poster, native controls and the shared visible-only
playback behaviour. The original source assets remain unchanged. Invoice captions
identify the example content and placeholders as a template.


## Full website portfolio integration

The full-site branch restores the original homepage layout while reusing the
approved mini-site portfolio content. `lib/work-covers.ts` owns the three category
descriptions and rotating Visual selection; `WorkCover` displays the same content
in the desktop gallery and mobile work stack. Static-hosted work routes use native
anchors. Branding keeps all six category marquees and the selected opening assets.
Visual All Work keeps its jewellery-first curation, filters, lightbox and load-more
flow, with three columns on wide screens and two on mobile. Website details use lazy-loaded GIF previews with reduced-motion posters for
all five walkthroughs and the corrected kitchen design, manufacture and installation
copy. `design-system/full-content.css` adapts detail pages to the full width without
changing the mini-site deployment.

The existing Resend notification and branded visitor confirmation are retained.
Neither Vercel project had production email environment variables at the integration
check on 21 October 2026; mail delivery still requires configuration.
