# GH Creative / Signal — design system v1.1

A visual system built around the approved scarlet stencil wordmark concept: angular typography, measured repetition, fine rules, square markers and charcoal space.

## Files and previews

- `/design-system`: visual style guide with live component examples, palette, typography, spacing, graphic rules and downloads.
- `/`: mobile website using the same system. The original section order, portrait and enquiry behaviour are retained.
- `design-system/tokens.json`: source of truth. Described, typed token values and references.
- `design-system/tokens.css`: generated CSS variables.
- `design-system/foundations.css`: local fonts, component states, shared controls and graphic treatment.
- `design-system/showcase.css`: layout for the visual guide.
- `components/brand/signal-wordmark.tsx`: accessible live typographic lockup with decorative outline echoes.
- `design-system/validation.json`: generated alias/count and colour-contrast report.
- `public/design-system/`: portable JSON, CSS and this guide.

## Visual principles

1. Give each composition one dominant message. Use generous empty space around it.
2. Let scarlet identify the focal point and primary action. It should not fill every surface.
3. Keep controls square, outer screen frames subtly rounded, cuts purposeful and outlines precise. No pill-shaped controls or ornamental glow.
4. Separate display expression from reading. Body copy, labels and errors remain complete and legible.
5. Prefer a few consistent values to small one-off variations.

## Palette

| Role | Value | Application |
| --- | --- | --- |
| Scarlet | `#FF3F46` | Primary action, display emphasis, registration markers |
| Hover scarlet | `#FF686D` | Hover and focus |
| Pressed scarlet | `#EC3540` | Pressed primary action |
| Charcoal | `#181818` | Main surface |
| Ink | `#08080B` | Hero, contact section, text on scarlet |
| Panel | `#202020` | Grouped content and fields |
| Raised | `#282828` | Secondary hover surfaces |
| Paper | `#F2F1ED` | Primary text |
| Muted | `#A8A8AD` | Secondary text and metadata |
| Rule | `#3B3B3B` | Decorative separators |
| Control boundary | `#808080` | Input and button boundaries |
| Outline echo | `#7A292E` | Decorative outlines only |

Use dark text on scarlet actions. Paper-white button text is not the default. The contrast report checks eight explicit solid-colour pairings against 4.5:1 for text and 3:1 for field boundaries/focus. It is not a full accessibility certification; image overlays need separate checks.

Status colours are secondary: success `#A6D6BE`, warning `#E9C477`, error `#FFA5AE`. Always include a text label and, where useful, an icon. Scarlet brand emphasis is not a substitute for an error message.

## Typography

| Role | Family | Weight | Default size / line height |
| --- | --- | --- | --- |
| Screen display | Anton | 400 | Fluid 56–82px / 0.96 |
| Brand display | Chakra Petch | 700 | 48px / 0.98 |
| Screen section | Anton | 400 | Fluid 40–57px / 1 |
| Title | Chakra Petch | 600 | 24px / 1.2 |
| Lead | System sans | 400 | 18px / 1.7 |
| Body | Helvetica Neue, Arial, sans-serif | 400 | 16px / 1.7 |
| Controls | IBM Plex Mono | 500 | 14px / 1.5 |
| Metadata | IBM Plex Mono | 400 | 12px / 1.5 |

The custom stencil logo is artwork. Anton is the screen headline face; Chakra Petch is the brand companion and is not an exact logo reproduction. The previous dotted and serif type treatments are superseded in the live site. Original reference images remain intact.

Use uppercase for short display headlines and metadata. Use sentence case for longer headings and paragraphs. Do not break words to force visual symmetry. Keep important text at 14px or larger; reserve 12px for secondary metadata. Sizes are in rem; avoid fixed-height text containers so enlarged text can reflow.

Anton 400 and Chakra Petch 600/700 are bundled locally with their OFL licences. IBM Plex Mono was already local at 400/500. This version makes no runtime font-network requests.

## Spacing and geometry

4px base spacing, with steps of 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 and 96px.

- Mobile gutter: 24px; 20px below 360px.
- Section spacing: 80px; 64px below 360px.
- Normal content gap: 24px. Control-internal gap: 12px.
- Standard field and button minimum height: 56px.
- Minimum tap area: 44px.
- Controls and content cards: 0px radius. Outer screen panels: 12px. Optional inset imagery: 2px.
- Rules: 1px. Focus ring: 2px, with a 4px offset where possible.
- Mobile design-review width: maximum 480px. This is not a completed desktop website layout.

## Components and states

### Primary action

`.button.primary`: scarlet fill, ink label, square edges and a restrained trailing icon. Hover lightens the fill; press uses the pressed-scarlet token and a 1px translation. Focus is clearly outlined. Disabled controls are natively disabled, use a reduced opacity and do not respond to hover/press.

### Secondary action

`.button.secondary`: transparent fill, paper text and visible neutral border. Hover moves to a raised charcoal surface and scarlet border. Use primary for the main decision and secondary for adjacent navigation.

### Text link

`.text-link`: readable 14px mono with a minimum 44px target. Hover changes colour. Labels should explain the destination.

### Input / textarea

Shared styling under `.contact-form` and `.ds-fields`. Always include visible labels. Default border uses the control-boundary colour, not the faint decorative rule. Keyboard focus uses a visible accent ring. Error uses `aria-invalid` plus a connected message; never colour alone. Disabled fields remain natively disabled.

### Service disclosure

Existing accessible accordion primitives supply open/closed state, keyboard interaction and semantics. Use a number, title and square icon container. Accent the open item; leave all details readable. Do not create nested scrolling areas.

### Card / project frame

Flat panel, fine rule, 24px padding, zero radius. Avoid artificial shadows or gradients. Label work accurately; no invented clients or performance claims.

### Navigation

Existing sheet/dialog behaviour supplies the mobile menu. Square icon controls, short labels and 44px minimum targets. Escape/close behaviour and focus handling come from the underlying primitive.

## Graphic treatments and logo use

The approved poster lives at `public/assets/brand-direction.png`. It is a raster concept board, not a transparent production logo. Do not shrink the whole poster into the website header, favicon or watermark. Prepare standalone clean vector or transparent exports before those applications.

The live `SignalWordmark` uses the companion display font to demonstrate the graphic system. It is not passed off as the exact custom logo. Its two outline echoes are hidden from assistive technology; its accessible name reads GH Creative once.

- One solid wordmark plus at most two outline echoes in a hero or poster composition.
- No repeated outline effects behind body copy, forms or navigation.
- Keep logo clear space at least the height of its G crossbar.
- Use small square registration markers and fine vertical rules sparingly.
- Avoid stretching, glows, drop shadows, chrome and extra decorative cuts.
- Watermark starting opacity: 18%, adjusted to the actual image. Use the compact production monogram when the full wordmark would become illegible.
- Do not apply the old cube concepts within this direction.

## Motion

140ms for hover/press feedback; 220ms for disclosure/menu transitions. Easing: `cubic-bezier(0.2, 0, 0, 1)`. No bounce, flashing or continuous background movement. Reduced-motion preference removes transitions and smooth scrolling.

## Token maintenance

The three layers are:

```text
primitive.color.scarlet = #FF3F46
semantic.accent = {primitive.color.scarlet}
component.button-background = {semantic.accent}
```

Generated CSS:

```css
--gh-ref-color-scarlet: #FF3F46;
--gh-accent: var(--gh-ref-color-scarlet);
--gh-button-background: var(--gh-accent);
```

Edit the source JSON, then run `npm run tokens:build`. Never edit the generated CSS or public token copies. The generator resolves aliases, rejects missing/circular references and CSS-name collisions, and checks the declared contrast pairs. `npm run build` regenerates tokens before building the site.

Use semantic or component aliases in component styles. Primitives are for defining scales and roles. The JSON uses `$type`, `$value` and `$description` fields with brace references; import tooling may need an adapter for its particular token format. No one-click Figma import is assumed.

## Current scope

A dark mobile design system and review guide, with live typography, controls and graphic rules. No public deployment or production logo replacement is part of this pass. The enquiry form continues to save a local brief and does not send messages.

## v1.1 — Nueva Tech reference applied to screens

Reference: https://www.instagram.com/p/CmV-C3TIsB0/?img_index=10 . Posted by morrre.dsgn on 19 December 2022; the caption credits @the_whispering_sea and @paix.dsgn. Slide 10 shows the broader identity. The mobile screens in slides 6–7 informed this adaptation.

Applied design ideas: tall condensed headlines; fine muted-red outer frames; small crosshairs and index labels; strong red project-caption bands and navigation; a red Process section with black text; large condensed menu links; and broad CTA strips. Existing GH Creative imagery, wording, logo direction and page order remain. No artwork from the Instagram post has been copied into the site.

Anton is the locally bundled screen-display font with its OFL licence. Chakra Petch remains the brand-wordmark companion and IBM Plex Mono remains the label face. Body copy stays a neutral sans serif. Outer frames may have a 12px radius while buttons, inputs and image captions remain square.

`design-system/screens.css` is loaded after globals from the root layout. It consumes the new condensed-font, spotlight-surface and screen-frame tokens. The palette keeps the approved GH scarlet; full-red areas use ink text and dark focus treatment. These choices take priority over v1 rules that described all surfaces as square.


## Scroll choreography

The mobile site uses GSAP ScrollTrigger with native scrolling. Motion loads after hydration; all copy and controls render without JavaScript animation. The hero portrait travels 100px and scales to 118%, while headline lines shift subtly. Decorative type bands counter-scroll by 16%.

The “In the studio” panel pins when its top reaches the viewport top. Three landscape work panels build a vertical stack: web slides from the left, visual design from the right, branding from the left. Entries are sequential, with a short pause between them and a final hold. One directly scrubbed timeline controls all panels and the progress rule over 240% of the viewport height (at least 1050px of scrolling), then releases the panel. Upward scrolling reverses the sequence. The panel fits a viewport with a 640px minimum; shorter screens can reach the remainder after release. Paused/reduced motion shows all three images in normal document flow. Existing GH studio assets are placeholders; replace the image sources in app/page.tsx with portfolio work.

Heading entrances travel 28px over 700ms. Brand outline echoes move in opposite directions. Body text, links and forms stay still. Shared scroll settings live in the token source: `scroll-scrub` (seconds), `scroll-hero-travel` (pixels), `scroll-reveal-travel` (pixels), and `scroll-reveal-duration` (seconds).

The hero footer exposes Pause motion / Enable motion. OS reduced-motion preferences take priority, remove the panel pin and its extra scroll spacing and restore static artwork. Cleanup reverts transforms and disconnects observers on navigation or preference changes. Font, image and accordion-size changes refresh scroll measurements.

Implementation reference: [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).


### Hero entrance sequence

On initial load at the top of the page, the image fades in, followed by logo/menu, small labels, the two title lines, supporting copy, actions and footer labels. The stagger completes in under two seconds. Entrance transforms belong to child elements; scroll parallax belongs to their parent, so the two effects compose without competing. Scrolling or focusing a control immediately completes the entrance. Deep links, reduced-motion preferences and re-enabling paused motion skip the entrance.


### Dramatic hero title parallax

The two title lines now travel independently across the first 320–560px of scrolling. The first rises 190px and drifts left 180px; the second rises 145px and drifts left 100px, with a restrained scale change anchored to the right. Scroll catch-up is 300ms. Inner spans own the page-load reveal, while outer spans own the stronger scroll motion, preserving both effects. Reduced-motion and pause controls still revert the complete sequence.


### Refraction shimmer

A warm, split light band sweeps across the portrait over 3 seconds, with a 37-second rest (one sweep every 40 seconds while the hero is visible). Colour-dodge blending catches the image’s brighter red ridges while leaving its black areas dark. The image and shimmer share a parallax wrapper; the light remains beneath the fade and text. The loop pauses outside the hero and disappears with reduced motion or Pause motion. This is a composited lighting effect on the existing artwork.


### Hero glass action

The hero primary CTA uses one #E4272C tint with a translucent blurred surface, a fine reflective rim and a restrained upper highlight. White text and an undivided arrow sit on the same surface; the earlier contrasting side strips are removed. Corners use the 12px screen-radius token. Browsers without backdrop-filter receive an opaque scarlet fallback. Hover and press preserve the red hue, and focus retains the existing visible outline.


The hero primary CTA shares the image shimmer’s animation: a 90-degree light band, a 3-second sweep and a 37-second rest. Both targets belong to one GSAP tween, so they start, pause and resume together. The button highlight stays behind its label and arrow and is disabled by reduced-motion or Pause motion.


## Capabilities → offers: Pixel Reveal

React Bits Pro Pixel Reveal creates the transition into “Ways to work together.” Its licensed TSX and CSS were supplied by the owner. The official CLI install was attempted, but REACTBITS_LICENSE_KEY was absent; the supplied fallback was then installed with the shadcn CLI using a local registry manifest. Both official React Bits Pro registries are configured with an environment-variable reference, never a literal key.

The adapted component supports revealing native HTML beneath a dark curtain, plus an imperative setProgress method. A downward 18px red pixel sweep uncovers the live red Process panel. ScrollTrigger controls reversible progress after a black hold, starting when the section top reaches 25% viewport height and progressing over roughly 72% of one screen. At the viewport top, the section pins until the reveal reaches its final frame, with at least 240px of pinned scroll. Direct scrubbing keeps the reveal and release in sync. The pin spacer stays mounted after the section leaves view to preserve downstream positions. Text and links remain native HTML.

Rendering is lazy-loaded near the section, capped at 1.5 device pixel ratio, and uses an on-demand WebGL render loop. Pausing motion or enabling reduced motion removes the curtain. Keyboard focus reveals the offers immediately. Missing WebGL, a context loss or an import failure leaves the native offers visible.

Source: components/reactbits/pixel-reveal.tsx and pixel-reveal.css. Integration: components/motion/pixel-section-transition.tsx. The added packages are @react-three/fiber, three and @types/three. The component retains its image-reveal API; revealContent and coverColor enable this site’s section transition.

The shared shimmer begins at the left edge as soon as the page motion initializes, without waiting for a scroll event. Its 3-second sweep and 37-second rest preserve the 40-second cycle.


### Work background: blinking squares

A local implementation of the supplied BlinkingSquares API replaces the halftone wave behind the pinned work section. Scarlet (#E4272C) squares over charcoal (#08080B) are dense on the right and fade toward the left. Settings: gridSize 52, squareSize 0.57, falloff 1.25, fadeStart 0.2, fadeEnd 1, minBrightness 0.55, twinkleSpeed 1, twinkleStrength 0.6, opacity 0.65, dpr 1.5. Supports all four directions, static and frozen states, and the supplied palette controls. Motion pauses off screen, in hidden tabs, with the page toggle, or with reduced motion. WebGL failures leave the plain background. The work links and scroll sequence remain above the decorative layer.


### Section heading scroll motion

All five homepage section headings use one scroll-position controller per title. Each line rises from 105% below its own clipping mask when that line enters the viewport, becoming fully visible by 72% viewport height. Movement follows scrolling directly, without a timed entrance or catch-up tween. The controller subtracts the section's actual pinned scroll distance, keeping the heading visible throughout the content reveal. After release, each line exits upward and fades over 180px starting when its mask reaches the viewport top. Line masks keep the original layout space so text cannot drift over adjacent copy. Reverse scrolling restores the same states, and measurements refresh after font, layout and pixel-reveal initialization changes.

Work keeps its existing three-panel pin and offers keeps its quarter-screen pixel approach and reveal pin. Capabilities, studio and contact pin at the viewport top for 45% of the viewport height (minimum 240px), fading their content in sequentially with a short fully-revealed hold before release. Tall sections continue scrolling naturally after this reveal; no content is cropped to the viewport. Keyboard focus completes the relevant content reveal. The hero keeps its existing entrance and parallax. Pause and reduced motion remove all pins and restore static, readable content.


### Work-section parallax

During the pinned showcase, each image drifts vertically inside its independently sliding panel: web ±5%, visual ±7% in the opposite direction, branding ±6%. The two full-bleed images are scaled to 118% to keep their edges covered, while the website mockup uses 108%. The blinking-square background drifts from −28px to +28px at 112% scale. All layers share the existing scroll timeline and reverse on upward scroll; pause and reduced-motion cleanup restore the static layout.


### Scroll timing audit and CTA glow

The offers reveal and pin measure a stable outer region. Pins refresh in document order, followed by heading measurements, so headings include all upstream spacing. Both offers triggers derive their durations from the same calculation instead of reading a cached end from another trigger. A quarter-screen approach plus the pinned distance equals the full reveal distance. The hero CTA keeps its transparent fill and adds a soft red glow with a fluorescent light dip; its flicker animates only the filter so entrance opacity remains under GSAP control.


### Work-section exit

The work section retains its pinned three-panel sequence. After the pin releases, a separate scrubbed exit continues through the next 80% of viewport height (minimum 280px, capped at panel height). The three work panels rise by 80/135/190px; the background's inner layer continues vertically at the same distance-per-scroll-pixel as the pinned sequence, with no exit zoom. The shared heading system handles the title only after it reaches the viewport top. The exit adds no extra pin or page spacing, refreshes immediately after the work pin, and reverses on upward scroll.
