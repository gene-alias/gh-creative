'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { GHMonogram } from '@/components/brand/gh-monogram';
import { StaggeredText } from '@/components/ui/staggered-text';
import { DepthScene } from '@/components/motion/depth-scene';
import { HeroGlobe } from './hero-globe';

/** The original studio hero, contained in the mobile mini-site. */
export function OriginalHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const contactOpener = useRef<HTMLElement | null>(null);
  return (
    <section className="hero mini-original-hero" aria-labelledby="hero-title">
      <DepthScene hero />
      <HeroGlobe />
      <header className="nav">
        <a href="#top" className="hero-logo" aria-label="GH Creative home">
          <GHMonogram wordmark />
        </a>
        <Sheet
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onOpenChangeComplete={(open) => {
            if (open || !pendingNavigation.current) return;
            const id = pendingNavigation.current;
            pendingNavigation.current = null;
            const target = document.getElementById(id);
            target?.scrollIntoView({ block: 'start', behavior: 'instant' });
            history.replaceState(null, '', `#${id}`);
            const heading = target?.querySelector<HTMLElement>('h2');
            heading?.setAttribute('tabindex', '-1');
            heading?.focus({ preventScroll: true });
          }}
        >
          <SheetTrigger className="menu-trigger" aria-label="Open menu">
            <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
          </SheetTrigger>
          <SheetContent
            className="site-menu"
            finalFocus={() => (pendingNavigation.current ? false : undefined)}
          >
            <SheetTitle>GH CREATIVE</SheetTitle>
            <SheetDescription>Brand / Web / Visual / Audio</SheetDescription>
            <nav aria-label="Main navigation">
              {[
                ['Work', 'work'],
                ['Services', 'services'],
                ['Studio', 'studio'],
                ['Contact', 'contact'],
              ].map(([label, id], index) => (
                <a
                  href={`#${id}`}
                  key={id}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    pendingNavigation.current = id;
                    setMenuOpen(false);
                  }}
                >
                  <span>0{index + 1}</span>
                  {label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </a>
              ))}
            </nav>
            <div className="site-menu-actions">
              <p className="meta">MELBOURNE / WORLDWIDE</p>
              <ProjectBriefTrigger
                className="button menu-cta"
                onClick={() => setMenuOpen(false)}
              >
                START A PROJECT <ArrowRight size={20} aria-hidden="true" />
              </ProjectBriefTrigger>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="hero-copy">
        <p className="eyebrow hero-services">
          <span className="hero-services-reveal">
            WEB DESIGN / VISUAL / BRANDING / AUDIO
          </span>
        </p>
        <h1 id="hero-title">
          <span className="hero-line">
            <span className="hero-line-reveal">
              <StaggeredText
                as="span"
                className="hero-title-glow"
                text="SHARE YOUR "
                desktopOnly
                segmentBy="chars"
                delay={35}
                duration={0.85}
                direction="bottom"
                blur={false}
              />
              <StaggeredText
                as="span"
                className="hero-title-glow hero-title-outline"
                text="VISION"
                desktopOnly
                segmentBy="chars"
                delay={35}
                duration={0.85}
                direction="bottom"
                blur={false}
              />
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line-reveal">
              <StaggeredText
                as="span"
                className="hero-title-glow"
                text="WITH THE WORLD"
                desktopOnly
                segmentBy="chars"
                delay={35}
                duration={0.85}
                direction="bottom"
                blur={false}
              />
            </span>
          </span>
        </h1>
        <div className="hero-support">
          <p className="hero-subheading">
            Digital experiences for brands that deserve attention.
          </p>
          <ProjectBriefTrigger className="button primary">
            <span className="cta-shimmer" aria-hidden="true" />
            START YOUR PROJECT. <ArrowRight size={22} aria-hidden="true" />
          </ProjectBriefTrigger>
          <a className="button hero-work-link" href="#work">
            VIEW MY WORK <ArrowDown size={22} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-footer meta">
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogTrigger
            className="contact-card-trigger"
            onClick={(event) => {
              contactOpener.current = event.currentTarget;
            }}
          >
            CONTACT ↗
          </DialogTrigger>
          <DialogContent
            className="contact-card"
            finalFocus={() => contactOpener.current ?? undefined}
          >
            <div className="contact-card-body">
              <p className="eyebrow">INDEPENDENT CREATIVE STUDIO</p>
              <DialogTitle className="contact-card-wordmark">
                <span className="sr-only">GH CREATIVE</span>
                <GHMonogram wordmark />
              </DialogTitle>
              <DialogDescription>
                Brand, web, visual and audio design for ideas that deserve
                attention.
              </DialogDescription>
            </div>
            <div className="contact-card-meta meta">
              <span>GENE / CREATIVE PARTNER</span>
              <a href="tel:+61405179803">+61 405 179 803</a>
              <a href="mailto:hello@ghcreative.com">hello@ghcreative.com</a>
            </div>
            <ProjectBriefTrigger
              className="contact-card-cta"
              onClick={() => setContactOpen(false)}
            >
              START A PROJECT <ArrowRight size={18} aria-hidden="true" />
            </ProjectBriefTrigger>
          </DialogContent>
        </Dialog>
        <span>MELBOURNE / WORLDWIDE</span>
      </div>
    </section>
  );
}
