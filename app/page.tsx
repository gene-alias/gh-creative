'use client';
import { lazy, Suspense, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ArrowDown, Menu } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { SignalWordmark } from '@/components/brand/signal-wordmark';
import { GHMonogram } from '@/components/brand/gh-monogram';

import { useScrollMotion } from '@/components/motion/use-scroll-motion';
import { PixelSectionTransition } from '@/components/motion/pixel-section-transition';

const BlinkingSquares = lazy(() => import('@/components/reactbits/blinking-squares'));

const services = [
  {
    name: 'Web design',
    tag: 'YOUR DIGITAL HOME',
    description:
      'Distinctive websites with a clear purpose. From the first wireframe to the final mobile detail.',
    items: [
      'Website strategy & structure',
      'UX / UI & responsive design',
      'Website builds & landing pages',
    ],
  },
  {
    name: 'Visual design',
    tag: 'A RECOGNISABLE IDENTITY',
    description:
      'A visual language that feels like you, wherever your brand shows up.',
    items: [
      'Brand identity & art direction',
      'Typography & design systems',
      'Digital & print design',
    ],
  },
  {
    name: 'Audio design',
    tag: 'SOUND WITH INTENTION',
    description:
      'Sound that brings another dimension to your brand, content and campaigns.',
    items: [
      'Sonic identity',
      'Sound design & audio editing',
      'Podcast & campaign audio',
    ],
  },
  {
    name: 'Marketing',
    tag: 'READY TO GO LIVE',
    description:
      'Connected creative for your next launch. One idea, carried across every touchpoint.',
    items: [
      'Campaign concepts & creative',
      'Social & email assets',
      'Launch packages & ongoing support',
    ],
  },
];
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const motionPaused = false;
  const reducedMotion = useScrollMotion(root, motionPaused);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  function saveBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `GH CREATIVE — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nProject:\n${data.get('project')}\n\nThis brief has been saved locally. It has not been sent.`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gh-creative-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return (
    <main className="mobile-site" id="top" ref={root}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art">
          <div className="hero-refraction">
            <img
              src="/assets/hero-portrait.png"
              alt="A silhouette distorted through red refracted glass"
              fetchPriority="high"
              width="780"
              height="1122"
            />
            <div className="refraction-shimmer" aria-hidden="true" />
          </div>
        </div>
        <header className="nav">
          <a
            href="#top"
            className="hero-logo"
            aria-label="GH Creative — back to top"
          >
            <GHMonogram />
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="menu-trigger">
              MENU <Menu aria-hidden="true" size={17} strokeWidth={1.3} />
            </SheetTrigger>
            <SheetContent className="site-menu">
              <SheetTitle>GH CREATIVE</SheetTitle>
              <SheetDescription>Brand / Web / Visual / Audio</SheetDescription>
              <nav aria-label="Main navigation">
                {['Work', 'Services', 'Studio', 'Contact'].map((item, i) => (
                  <a
                    key={item}
                    href={'#' + item.toLowerCase()}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>0{i + 1}</span>
                    {item}
                    <ArrowUpRight size={22} />
                  </a>
                ))}
              </nav>
              <a
                href="#contact"
                className="button menu-cta"
                onClick={() => setMenuOpen(false)}
              >
                START A PROJECT <ArrowRight size={20} />
              </a>
              <p className="meta">MELBOURNE / WORLDWIDE</p>
            </SheetContent>
          </Sheet>
        </header>
        <span className="studio-index meta">
          <span className="crosshair" aria-hidden="true" />
          STUDIO / 001
        </span>
        <div className="hero-copy">
          <p className="eyebrow hero-services">
            <span className="hero-services-reveal">
              BRAND / WEB / VISUAL / AUDIO
            </span>
          </p>
          <h1 id="hero-title">
            <span className="hero-line">
              <span className="hero-line-reveal"><span className="hero-title-glow">BRING YOUR</span></span>
            </span>
            <span className="hero-line">
              <span className="hero-line-reveal"><span className="hero-title-glow">VISION TO LIFE</span></span>
            </span>
          </h1>
          <div className="hero-support">
            <p className="hero-description">
              <span className="hero-description-reveal">
                Creatives for ideas that deserve attention.
              </span>
            </p>
            <a className="button primary" href="#contact">
              <span className="cta-shimmer" aria-hidden="true" />
              START A PROJECT <ArrowRight size={22} />
            </a>
            <div className="hero-secondary-actions">
              <a className="text-link" href="#work">
                VIEW THE WORK <ArrowDown size={15} />
              </a>
              <span className="hero-instagram" role="img" aria-label="Instagram">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="hero-footer meta">
          <Dialog>
            <DialogTrigger className="contact-card-trigger">
              CONTACT ↗
            </DialogTrigger>
            <DialogContent className="contact-card">
              <div className="contact-card-header">
                <GHMonogram />
                <span className="meta">GH / 001</span>
              </div>
              <div className="contact-card-body">
                <p className="eyebrow">INDEPENDENT CREATIVE STUDIO</p>
                <DialogTitle>GH CREATIVE</DialogTitle>
                <DialogDescription>
                  Brand, web, visual and audio design for ideas that deserve
                  attention.
                </DialogDescription>
              </div>
              <div className="contact-card-meta meta">
                <span>GENE / CREATIVE PARTNER</span>
                <span>MELBOURNE / WORLDWIDE</span>
              </div>
              <DialogClose
                render={
                  <a
                    className="contact-card-cta"
                    href="#contact"
                    aria-label="Start a project"
                  />
                }
              >
                START A PROJECT <ArrowRight size={18} />
              </DialogClose>
            </DialogContent>
          </Dialog>
          <span>MELBOURNE / WORLDWIDE</span>
        </div>
      </section>
      <div className="signal-ribbon" aria-hidden="true">
        <div className="signal-ribbon__line">FORM / FREQUENCY / FEELING /</div>
        <div className="signal-ribbon__line signal-ribbon__outline">
          MAKE THE SIGNAL CLEAR /
        </div>
      </div>
      <section className="section work" id="work">
        <div className="work-pattern-background" aria-hidden="true">
          <Suspense fallback={null}>
            <BlinkingSquares
              width="100%" height="100%"
              direction="right" gridSize={52}
              squareColor="#E4272C" backgroundColor="#08080B"
              falloff={1.25} fadeStart={0.2} fadeEnd={1}
              squareSize={0.57} minBrightness={0.55}
              twinkleSpeed={1} twinkleStrength={0.6}
              intensity={1} opacity={0.65} dpr={1.5}
              paused={motionPaused || reducedMotion}
            />
          </Suspense>
        </div>
        <p className="eyebrow section-index">
          <span>01 / IN THE STUDIO</span>
          <span>↗</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">Identity with</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>a point of view.</em></span></span>
        </h2>
        <div className="work-stack" aria-label="Selected creative work">
          <figure className="work-panel work-panel--web">
            <Link className="work-panel-link" href="/work/web-design" aria-label="Explore web design work" />
            <Image
              unoptimized
              src="/assets/mobile-hero-reference.png"
              alt="GH Creative website concept with a red portrait and bold typography"
              width="390"
              height="844"
              loading="lazy"
            />
            <figcaption><span>01 / WEB DESIGN</span><span>↗</span></figcaption>
          </figure>
          <figure className="work-panel work-panel--visual">
            <Link className="work-panel-link" href="/work/visual-design" aria-label="Explore visual design work" />
            <Image
              unoptimized
              src="/assets/hero-portrait.png"
              alt="Red refracted portrait exploring distortion and contrast"
              width="780"
              height="1122"
              loading="lazy"
            />
            <figcaption><span>02 / VISUAL DESIGN</span><span>↗</span></figcaption>
          </figure>
          <figure className="work-panel work-panel--brand">
            <Link className="work-panel-link" href="/work/branding" aria-label="Explore branding work" />
            <Image
              unoptimized
              src="/assets/brand-direction.png"
              alt="GH Creative brand identity with a red wordmark and outline echoes"
              width="1086"
              height="1448"
              loading="lazy"
            />
            <figcaption><span>03 / BRANDING</span><span>↗</span></figcaption>
          </figure>
        </div>
        <div className="work-sequence-footer">
          <span className="meta">GH CREATIVE / STUDIO EXPLORATIONS</span>
          <div className="project-meter" aria-hidden="true"><span /></div>
        </div>
      </section>
      <section className="section intro" id="services">
        <div className="services-background" aria-hidden="true" />
        <p className="eyebrow section-index">
          <span>02 / CAPABILITIES</span>
          <span>↓</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">Different disciplines.</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>One clear direction.</em></span></span>
        </h2>
        <p className="body-copy">
          Websites, identities, campaigns and sound. Considered together, made
          to work together.
        </p>
        <Accordion className="services" defaultValue={[]}>
          {services.map((s, i) => (
            <AccordionItem key={s.name} value={s.name}>
              <AccordionTrigger className="service-trigger">
                <span className="service-number">0{i + 1}</span>
                <span data-content-reveal>{s.name}</span>
              </AccordionTrigger>
              <AccordionContent className="service-content">
                <p className="eyebrow">{s.tag}</p>
                <p>{s.description}</p>
                <ul>
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="#contact">
                  LET’S TALK {s.name.toUpperCase()} <ArrowUpRight size={16} />
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <div className="offers-scroll-region">
      <section className="section offers" id="offers">
        <PixelSectionTransition disabled={motionPaused || reducedMotion} />
        <p className="eyebrow section-index">
          <span>03 / WAYS TO WORK TOGETHER</span>
          <span>↗</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">Start where</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>you need me.</em></span></span>
        </h2>
        <a className="offer" href="#contact">
          <span className="eyebrow">01 / A FOCUSED PROJECT</span>
          <h3>Make your next move.</h3>
          <p>
            A website, identity or campaign. A clear scope, built around what
            you need.
          </p>
          <span className="offer-link">
            PLAN A PROJECT <ArrowUpRight size={20} />
          </span>
        </a>
        <a className="offer" href="#contact">
          <span className="eyebrow">02 / A COMPLETE LAUNCH</span>
          <h3>Bring it all together.</h3>
          <p>
            Brand, website and launch creative, considered as one connected
            experience.
          </p>
          <span className="offer-link">
            PLAN A LAUNCH <ArrowUpRight size={20} />
          </span>
        </a>
        <a className="offer" href="#contact">
          <span className="eyebrow">03 / AN ONGOING PARTNERSHIP</span>
          <h3>Keep things moving.</h3>
          <p>
            Regular creative support for the ideas, updates and campaigns that
            come next.
          </p>
          <span className="offer-link">
            EXPLORE A PARTNERSHIP <ArrowUpRight size={20} />
          </span>
        </a>
      </section>
      </div>
      <section className="section studio" id="studio">
        <p className="eyebrow section-index">
          <span>04 / THE PERSON BEHIND THE WORK</span>
          <span>GH</span>
        </p>
        <SignalWordmark className="studio-mark" />
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">One creative partner.</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>From idea to output.</em></span></span>
        </h2>
        <p className="body-copy">
          I’m Gene. I bring web, visual design, audio and marketing together to
          give your ideas a clear, consistent presence.
        </p>
        <p className="body-copy studio-follow">
          Direct collaboration, thoughtful decisions and attention to the
          details that make the work yours.
        </p>
        <div className="studio-location meta">
          <span className="status-dot" /> <span data-content-reveal>MELBOURNE / WORKING WORLDWIDE</span>
        </div>
      </section>
      <section className="section contact" id="contact">
        <p className="eyebrow section-index">
          <span>05 / YOUR NEXT CHAPTER</span>
          <span>↗</span>
        </p>
        <h2 className="dot-heading">
          <span className="section-title-line"><span className="section-title-reveal">LET’S MAKE</span></span>
          <span className="section-title-line"><span className="section-title-reveal">SOMETHING</span></span>
          <span className="section-title-line"><span className="section-title-reveal">MATTER.</span></span>
        </h2>
        <p className="body-copy">
          Have a project in mind? Start with the idea. We can work out the rest.
        </p>
        <form onSubmit={saveBrief} className="contact-form">
          <label>
            <span data-content-reveal>Your name</span>
            <input
              name="name"
              autoComplete="name"
              placeholder="Name"
              required
              maxLength={120}
            />
          </label>
          <label>
            <span data-content-reveal>Email address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              maxLength={254}
            />
          </label>
          <label>
            <span data-content-reveal>What are you thinking?</span>
            <textarea
              name="project"
              rows={4}
              placeholder="A new website, a brand launch, something different…"
              required
              maxLength={5000}
            />
          </label>
          <button className="button primary" type="submit">
            <span data-content-reveal>SAVE MY PROJECT BRIEF</span> <Download size={19} />
          </button>
          <p className="form-note" role="status">
            {saved
              ? 'Your brief is downloaded. Nothing has been sent.'
              : 'Preview: save a brief to your device. Enquiry delivery will be connected next.'}
          </p>
        </form>
      </section>
      <footer className="footer">
        <a className="wordmark" href="#top">
          GH CREATIVE
        </a>
        <a className="back-top" href="#top" aria-label="Back to top">
          ↑
        </a>
        <p className="meta">INDEPENDENT BY DESIGN.</p>
        <div className="footer-bottom meta">
          <span>© {new Date().getFullYear()} GH CREATIVE</span>
          <span>MELBOURNE / WORLDWIDE</span>
        </div>
      </footer>
    </main>
  );
}
