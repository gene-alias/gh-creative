# GH Creative mobile prototype

Current visual system: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

The original Figma hero established the portrait, composition and page direction. Its full reference is preserved at ../figma-mobile-hero.png and public/assets/mobile-hero-reference.png. The exported portrait at public/assets/hero-portrait.png already includes the frame crop.

The approved angular stencil wordmark concept now guides the live typography, colour, spacing, controls and graphic details. Shared JSON tokens generate CSS used by both the mobile website and /design-system visual guide. The custom logo remains a concept asset; live headings use Chakra Petch as its companion typeface.

The page includes the original hero artwork, a self-initiated studio design feature, expandable services, three engagement options, studio introduction and enquiry visuals. No external clients, testimonials or results have been invented. The preview form downloads a brief and does not send information.

The mobile site is capped at 480px on large screens for design review. Run npm run dev to preview, npm run tokens:build to update the tokens, and npm run build for the production build.

Screen treatment v1.1 incorporates the supplied Nueva Tech Instagram reference: condensed headlines, thin red panel frames, a red menu and a red Process section with black text. See DESIGN-SYSTEM.md for attribution and usage.


## Mobile mini-site revision

The main site and portfolio routes keep a 480px maximum width at all viewport
sizes. Native scroll replaces the pinned desktop composition. The original
rotating Earth and its scroll animation remain; measurements use the containing
column rather than the device width. Services expand with native disclosure rows,
work cards open the existing galleries, and bottom navigation keeps inquiries in
reach. Body copy is locally hosted Inter Light (300). Anton headings, Chakra
service titles and the existing GH artwork remain. Inquiry delivery still uses
the server endpoint and gene@alias.com.ai; the flow is now details, review, send,
with budget and timing optional. The historical prototype notes above describe
previous iterations.


## Hero and inquiry revision

Restore the full studio hero’s original visual language in the mobile column,
including its rotating Earth, headline, navigation, outlined CTA and contact
card. Retain Inter Light for body text. Restore the original conversational
question flow and progress indicators. Add a branded transactional confirmation
email after the inquiry notification is accepted, with honest handling and a
retry when only the client receipt fails.
