/* Static hosting uses document navigation; vinext Link requires a server router. */
/* oxlint-disable next/no-html-link-for-pages */
'use client';
import { ArrowRight, ArrowDown, Check, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { SignalWordmark } from '@/components/brand/signal-wordmark';
import tokens from '@/design-system/tokens.json';
import validation from '@/design-system/validation.json';
const palette = [
  ['scarlet', 'Scarlet', 'Primary action'],
  ['canvas', 'Charcoal', 'Main canvas'],
  ['surface', 'Panel', 'Grouped content'],
  ['paper', 'Paper', 'Primary text'],
  ['muted', 'Muted', 'Secondary text'],
] as const;
export default function DesignSystem() {
  return (
    <main className="system-page" id="system-top">
      <header className="ds-topbar">
        <a href="/" className="wordmark">
          GH CREATIVE
        </a>
        <span className="meta">DESIGN SYSTEM / V1.1</span>
        <a className="text-link" href="/">
          MOBILE SITE <ArrowRight size={18} />
        </a>
      </header>
      <section className="ds-hero">
        <div>
          <p className="eyebrow">
            <span className="registration-mark" /> SIGNAL / 01
          </p>
          <h1>
            PRECISION.
            <br />
            <span>PRESENCE.</span>
          </h1>
          <p>
            A visual language built from angular type, scarlet accents, quiet
            space and deliberate repetition.
          </p>
          <a className="text-link" href="#components">
            EXPLORE THE SYSTEM <ArrowDown size={18} />
          </a>
        </div>
        <div className="ds-signature">
          <SignalWordmark />
          <p className="meta">LIVE TYPOGRAPHIC TREATMENT</p>
        </div>
      </section>
      <nav className="ds-nav" aria-label="Design system sections">
        {[
          'Foundations',
          'Typography',
          'Spacing',
          'Components',
          'Graphics',
          'Tokens',
        ].map((s) => (
          <a key={s} href={'#' + s.toLowerCase()}>
            {s}
          </a>
        ))}
      </nav>
      <section className="ds-section" id="foundations">
        <header>
          <h2>01 / Colour</h2>
          <span className="meta">SCARLET ON CHARCOAL</span>
        </header>
        <div className="ds-swatches">
          {palette.map(([key, name, role]) => (
            <div className="ds-swatch" key={key}>
              <div
                className="ds-swatch-color"
                style={{ background: tokens.primitive.color[key].$value }}
              />
              <h3>{name}</h3>
              <code>{tokens.primitive.color[key].$value}</code>
              <p className="ds-small">{role}</p>
            </div>
          ))}
        </div>
        <p>
          Use dark surfaces for most of the composition. Reserve scarlet for the
          focal point, a primary action and small registration marks. Thin
          outline echoes are decorative; they never carry essential information.
        </p>
        <div className="ds-table-wrap">
          <table className="ds-table">
            <caption className="sr-only">
              Verified solid-colour contrast pairs
            </caption>
            <thead>
              <tr>
                <th scope="col">Colour pair</th>
                <th scope="col">Contrast</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              {validation.checks.map((c) => (
                <tr key={c.label}>
                  <th scope="row">{c.label}</th>
                  <td>{c.ratio}</td>
                  <td>{c.minimum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ds-small">
          These checks cover solid colour pairs. Text over images needs its own
          contrast check.
        </p>
      </section>
      <section className="ds-section" id="screens">
        <header>
          <h2>Screen composition / v1.1</h2>
          <span className="meta">CONDENSED TYPE / RED FRAMES</span>
        </header>
        <div className="ds-grid">
          <div className="ds-screen-sample">
            <p className="meta">
              <span className="crosshair" aria-hidden="true" /> GH / CREATIVE
              SERVICES
            </p>
            <div className="ds-screen-title">
              MAKE THE
              <br />
              SIGNAL CLEAR.
            </div>
            <p>
              Confident display type, fine red boundaries and readable
              supporting copy.
            </p>
            <a className="button primary" href="/">
              VIEW THE MOBILE SITE <ArrowRight size={20} />
            </a>
          </div>
          <div>
            <h3>Borrow the composition.</h3>
            <p>
              The supplied Nueva Tech reference informs the tall display
              headlines, screen-like frames, technical crosshairs and full-red
              navigation. GH Creative keeps its own wordmark, imagery and
              content.
            </p>
            <p>
              Anton is the screen display face. Chakra Petch remains the brand
              companion. Outer screen panels have a 12px radius; controls stay
              square. Solid-red panels always use dark text and dark focus
              outlines.
            </p>
            <a
              className="text-link"
              href="https://www.instagram.com/p/CmV-C3TIsB0/?img_index=10"
              target="_blank"
              rel="noreferrer"
            >
              VIEW THE REFERENCE ↗
            </a>
          </div>
        </div>
      </section>
      <section className="ds-section" id="scroll-motion">
        <header>
          <h2>Scroll choreography</h2>
          <span className="meta">MOVE WITH INTENTION</span>
        </header>
        <div className="ds-grid">
          <div className="ds-panel">
            <h3>01 / Depth</h3>
            <p>
              The portrait travels up to 100px behind the headline. Oversized
              type bands move in opposing directions as they cross the viewport.
            </p>
          </div>
          <div className="ds-panel">
            <h3>02 / Showcase</h3>
            <p>
              The project holds within a 145svh track while the artwork rotates
              from −9° to 2° and scales from 78% to 104%. Short screens use a
              flowing layout.
            </p>
          </div>
          <div className="ds-panel">
            <h3>03 / Rhythm</h3>
            <p>
              Headings rise 28px into place over 700ms. Outline wordmark layers
              drift in opposite directions. Body copy, forms and calls to action
              stay steady.
            </p>
          </div>
          <div className="ds-panel">
            <h3>04 / Control</h3>
            <p>
              Native scrolling, a visible pause control, and automatic
              reduced-motion support. The full page remains readable before
              motion loads.
            </p>
            <a className="text-link" href="/">
              EXPLORE THE SCROLL SEQUENCE ↗
            </a>
          </div>
        </div>
      </section>
      <section className="ds-section" id="pixel-transition">
        <header>
          <h2>Pixel section transition</h2>
          <span className="meta">CAPABILITIES → OFFERS</span>
        </header>
        <div className="ds-panel">
          <h3>Reveal the next chapter.</h3>
          <p>
            A pixel wipe from the bottom dissolves the dark cover into the dark
            How We Work panel. The reveal follows your scroll and reverses on the
            way back. The text and links stay selectable and usable.
          </p>
          <p className="ds-small">
            React Bits Pro Pixel Reveal · 18px cells · 250ms scroll catch-up ·
            automatic reduced-motion fallback.
          </p>
          <a className="text-link" href="/#services">
            VIEW THE SECTION TRANSITION ↗
          </a>
        </div>
      </section>
      <section className="ds-section" id="typography">
        <header>
          <h2>02 / Typography</h2>
          <span className="meta">FOUR DISTINCT ROLES</span>
        </header>
        <div className="ds-type">
          <div className="meta">
            DISPLAY
            <br />
            CHAKRA PETCH / 600 to 700
          </div>
          <div className="ds-type-display">
            MAKE THE
            <br />
            SIGNAL CLEAR.
          </div>
        </div>
        <div className="ds-type">
          <div className="meta">
            BODY
            <br />
            SYSTEM SANS / 400
          </div>
          <div className="ds-type-body">
            Creative systems for ideas that deserve attention. Clear language.
            Readable paragraphs. Space to breathe.
          </div>
        </div>
        <div className="ds-type">
          <div className="meta">
            LABELS
            <br />
            IBM PLEX MONO / 400 to 500
          </div>
          <div className="ds-type-mono">
            BRAND / WEB / VISUAL / AUDIO
            <br />
            <br />
            MELBOURNE / WORLDWIDE
          </div>
        </div>
        <p>
          The custom stencil logo is artwork. Anton handles screen headlines;
          Chakra Petch is the brand companion, not an exact reproduction of the
          logo. Use uppercase for short display lines and metadata, sentence
          case for reading.
        </p>
        <p className="meta">
          12 METADATA / 14 LABEL / 16 BODY / 18 LEAD / 24 TITLE / 32 SECTION /
          48 DISPLAY / 80 POSTER
        </p>
      </section>
      <section className="ds-section" id="spacing">
        <header>
          <h2>03 / Space & shape</h2>
          <span className="meta">4PX BASE GRID</span>
        </header>
        <div className="ds-grid">
          <div className="ds-panel">
            <div className="ds-scale">
              {[1, 2, 3, 4, 6, 8, 12, 16, 20].map((n) => (
                <div className="ds-space" key={n}>
                  <code>{n * 4}</code>
                  <div style={{ height: `var(--gh-ref-space-${n})` }} />
                  <code>{n}</code>
                </div>
              ))}
            </div>
            <p className="ds-small">Top: pixels. Bottom: spacing token step.</p>
          </div>
          <div className="ds-panel">
            <div className="ds-stat">0 / 1 / 56</div>
            <p>
              Square corners. One-pixel rules. Fifty-six-pixel standard
              controls.
            </p>
            <p className="ds-small">
              24px mobile gutters · 80px section spacing · 44px minimum touch
              target. Narrow phones use 20px gutters and 64px section spacing.
            </p>
          </div>
        </div>
      </section>
      <section className="ds-section" id="components">
        <header>
          <h2>04 / Components</h2>
          <span className="meta">SHARED WITH THE MOBILE SITE</span>
        </header>
        <div className="ds-grid">
          <div className="ds-panel">
            <h3>Actions</h3>
            <ProjectBriefTrigger className="button primary">
              START A PROJECT <ArrowRight />
            </ProjectBriefTrigger>
            <Button
              nativeButton={false}
              render={<a href="/#work" />}
              className="button secondary"
            >
              VIEW THE WORK <ArrowRight />
            </Button>
            <Button disabled className="button primary">
              UNAVAILABLE <ArrowRight />
            </Button>
            <p className="ds-small">
              Try hover, press and keyboard focus on the live actions above.
            </p>
            <div className="button primary ds-forced-hover" aria-hidden="true">
              HOVER COLOUR <ArrowRight />
            </div>
            <div
              className="button primary ds-forced-pressed"
              aria-hidden="true"
            >
              PRESSED COLOUR <ArrowRight />
            </div>
          </div>
          <div className="ds-panel">
            <h3>Fields</h3>
            <div className="ds-fields">
              <label htmlFor="ds-name">
                Your name
                <input id="ds-name" placeholder="Name" autoComplete="off" />
              </label>
              <label htmlFor="ds-email">
                Email / error state
                <input
                  id="ds-email"
                  type="email"
                  defaultValue="hello@"
                  aria-invalid="true"
                  aria-describedby="ds-email-error"
                  autoComplete="off"
                />
              </label>
              <span className="field-error" id="ds-email-error">
                × Enter a complete email address.
              </span>
              <label htmlFor="ds-disabled">
                Unavailable field
                <input id="ds-disabled" disabled placeholder="Not available" />
              </label>
            </div>
            <p className="ds-small">
              State specimens only. No information is saved or sent.
            </p>
          </div>
          <div className="ds-panel">
            <h3>Disclosure</h3>
            <Accordion className="services" defaultValue={['web']}>
              <AccordionItem value="web">
                <AccordionTrigger className="service-trigger">
                  <span className="service-number">01</span>
                  <span>Web design</span>
                </AccordionTrigger>
                <AccordionContent className="service-content">
                  <p>
                    Start with a clear structure. Build a distinctive digital
                    presence.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="visual">
                <AccordionTrigger className="service-trigger">
                  <span className="service-number">02</span>
                  <span>Visual design</span>
                </AccordionTrigger>
                <AccordionContent className="service-content">
                  <p>One visual language across every touchpoint.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="ds-panel">
            <h3>Feedback</h3>
            <div className="ds-status-row">
              <span className="ds-tag ds-good">
                <Check size={14} /> Saved
              </span>
              <span className="ds-tag ds-warn">
                <AlertTriangle size={14} /> Review
              </span>
              <span className="ds-tag ds-error">
                <X size={14} /> Error
              </span>
            </div>
            <p>
              Always pair status colour with a label and icon. Brand scarlet
              signals emphasis; it does not automatically mean an error.
            </p>
            <p className="ds-small">
              UI feedback: 140ms; disclosures: 220ms. Scroll artwork follows
              with a 450ms catch-up, headings reveal over 700ms. Reduced motion
              or the page’s pause control restores the static layout.
            </p>
          </div>
        </div>
      </section>
      <section className="ds-section" id="graphics">
        <header>
          <h2>05 / Graphic language</h2>
          <span className="meta">ONE FOCAL POINT</span>
        </header>
        <div className="ds-grid">
          <div className="ds-panel">
            <img
              className="ds-poster"
              src="/assets/brand-direction.png"
              alt="Approved GH Creative stencil wordmark concept with scarlet type, outline echoes and registration details"
              width="1086"
              height="1448"
              loading="lazy"
            />
          </div>
          <div>
            <h3>Use with restraint.</h3>
            <ol className="ds-rules">
              <li>
                One solid wordmark, with at most two outline echoes around it.
                Echoes stay decorative and hidden from screen readers.
              </li>
              <li>
                Use square markers, short technical labels and fine vertical
                rules to frame a composition.
              </li>
              <li>
                Keep logo clear space at least the height of its G crossbar on
                every side.
              </li>
              <li>
                Keep complete words readable. Never apply stencil cuts to body
                copy or control labels.
              </li>
              <li>
                Use flat colour and square controls. Avoid rounded pills,
                chrome, glow and ornamental shadows.
              </li>
              <li>
                For a watermark, begin around 18% opacity and adjust to the
                image. Use a standalone clean logo export.
              </li>
            </ol>
            <p>
              The approved poster is a concept asset, not a transparent logo or
              editable vector. It should not be shrunk into a navigation logo.
              The mobile site uses companion typography until a production
              wordmark is prepared.
            </p>
          </div>
        </div>
      </section>
      <section className="ds-section" id="tokens">
        <header>
          <h2>06 / Reusable tokens</h2>
          <span className="meta">
            {validation.tokenCount} TOKENS / THREE LAYERS
          </span>
        </header>
        <p>
          Primitive values define the palette and scale. Semantic roles say
          where to use them. Component tokens connect those roles to the
          interface.
        </p>
        <pre className="ds-code">
          <code>{`--gh-ref-color-scarlet: #FF3F46;\n--gh-accent: var(--gh-ref-color-scarlet);\n--gh-button-background: var(--gh-accent);`}</code>
        </pre>
        <div className="ds-downloads">
          <a
            className="button primary"
            href="/design-system/tokens.json"
            download
          >
            DOWNLOAD JSON <ArrowDown size={20} />
          </a>
          <a
            className="button secondary"
            href="/design-system/tokens.css"
            download
          >
            DOWNLOAD CSS <ArrowDown size={20} />
          </a>
          <a
            className="button secondary"
            href="/design-system/guide.md"
            download
          >
            USAGE GUIDE <ArrowDown size={20} />
          </a>
        </div>
        <p className="ds-small">
          Change the source JSON and regenerate. The site, this guide and the
          downloadable stylesheet share the same values.
        </p>
      </section>
      <footer className="ds-topbar">
        <span className="meta">GH CREATIVE / DESIGN SYSTEM V1.1</span>
        <a href="#system-top" className="text-link">
          BACK TO TOP ↑
        </a>
      </footer>
    </main>
  );
}
