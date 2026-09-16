'use client';
import { useRef, useState } from 'react';
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
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { PricingSection } from '@/components/project/pricing-section';
import { GHMonogram } from '@/components/brand/gh-monogram';

import { useScrollMotion } from '@/components/motion/use-scroll-motion';
import { useServiceExpansion } from '@/components/motion/use-service-expansion';
import { DepthScene } from '@/components/motion/depth-scene';
import { HeroGlobe } from '@/components/hero/hero-globe';

const services = [
  {
    "name": "Web design",
    "tag": "Web Design & Development",
    "items": [
      {
        "label": "Custom websites",
        "description": "Distinctive websites designed around your brand and business goals."
      },
      {
        "label": "Landing pages",
        "description": "Focused pages for campaigns, product launches and lead generation."
      },
      {
        "label": "E-commerce websites",
        "description": "Online stores that make browsing and buying feel effortless."
      },
      {
        "label": "UI & UX design",
        "description": "Thoughtful layouts and intuitive navigation that guide users through your site."
      },
      {
        "label": "Responsive design",
        "description": "Websites that look and work beautifully across desktop, tablet and mobile."
      },
      {
        "label": "Website redesigns",
        "description": "Refreshing existing sites with stronger visuals, clearer messaging and improved usability."
      },
      {
        "label": "Motion & interaction",
        "description": "Purposeful animations and interactive details that bring your website to life."
      },
      {
        "label": "Ongoing updates & support",
        "description": "Keeping your website fresh, functional and aligned with your business."
      }
    ]
  },
  {
    "name": "Visual",
    "tag": "Visual Design & Content Creation",
    "items": [
      {
        "label": "Brand imagery",
        "description": "Custom visuals that reflect your brand’s identity."
      },
      {
        "label": "Product imagery",
        "description": "Product shots, lifestyle scenes and styled compositions."
      },
      {
        "label": "Campaign visuals",
        "description": "Creative assets for launches, promotions and advertising."
      },
      {
        "label": "Social media content",
        "description": "Static posts, stories, reels and short-form videos."
      },
      {
        "label": "Brand films & video",
        "description": "Promotional videos, brand stories and product showcases."
      },
      {
        "label": "Motion design",
        "description": "Animated graphics, typography and visual effects."
      },
      {
        "label": "Website imagery",
        "description": "Hero images, banners and supporting visuals."
      }
    ]
  },
  {
    "name": "Marketing",
    "tag": "Marketing & Campaign Content",
    "items": [
      {
        "label": "Ad creatives",
        "description": "Static and video ads for paid social and digital campaigns."
      },
      {
        "label": "Social media creatives",
        "description": "Branded posts, carousels, stories and reels."
      },
      {
        "label": "Email marketing content",
        "description": "Email design and copy for newsletters, promotions and automated sequences."
      },
      {
        "label": "Campaign concepts",
        "description": "Creative ideas and messaging that connect your marketing across channels."
      },
      {
        "label": "Launch content",
        "description": "Coordinated assets for product releases, announcements and promotions."
      },
      {
        "label": "Landing page content",
        "description": "Campaign-focused copy and visuals that turn interest into action."
      },
      {
        "label": "Marketing copywriting",
        "description": "Headlines, captions and messaging shaped around your brand’s voice."
      },
      {
        "label": "Promotional materials",
        "description": "Digital brochures, flyers and presentations that showcase your offering."
      }
    ]
  },
  {
    "name": "Audio",
    "tag": "Audio Production & Sound Design",
    "items": [
      {
        "label": "Royalty-free music samples",
        "description": "Original loops, beats and musical elements for creative projects."
      },
      {
        "label": "Sound effects",
        "description": "Custom sounds for videos, animations and digital experiences."
      },
      {
        "label": "Sound design",
        "description": "Atmospheric textures and audio layers that bring visuals to life."
      },
      {
        "label": "Sonic branding",
        "description": "Audio logos and signature sounds that give your brand a recognisable identity."
      }
    ]
  }
];
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const motionPaused = false;
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const [openServices, setOpenServices] = useState<string[]>([]);
  useScrollMotion(root, motionPaused);
  const prepareServiceChange = useServiceExpansion(root, openServices);
  const [contactCardOpen, setContactCardOpen] = useState(false);
  return (
    <main className="mobile-site immersive-site" id="top" ref={root}>
      <DepthScene hero />
      <section className="hero" aria-labelledby="hero-title">
        <HeroGlobe />
        <header className="nav">
          <a href="#top" className="hero-logo" aria-label="GH Creative — back to top">
            <GHMonogram wordmark />
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen} onOpenChangeComplete={async (open) => {
            if (open || !pendingNavigation.current) return;
            const id = pendingNavigation.current;
            // Let accordion height animations finish before measuring destinations.
            const animations = root.current?.querySelector('#services')?.getAnimations({ subtree: true }) ?? [];
            await Promise.allSettled(animations.map((animation) => animation.finished));
            if (pendingNavigation.current !== id) return;
            pendingNavigation.current = null;
            const target = root.current?.querySelector<HTMLElement>('#' + id);
            if (!target) return;
            target.dataset.menuRevealed = '';
            root.current?.querySelector('.pricing-track')?.dispatchEvent(new CustomEvent('pricing:select', { detail: 0 }));
            const handled = root.current && !root.current.dispatchEvent(new CustomEvent('site:navigate', { detail: id, cancelable: true }));
            if (!handled) target.scrollIntoView({ block: 'start', behavior: 'instant' });
            history.replaceState(null, '', '#' + id);
            const heading = target.querySelector<HTMLElement>('h2');
            heading?.setAttribute('tabindex', '-1');
            heading?.focus({ preventScroll: true });
          }}>
            <SheetTrigger className="menu-trigger" aria-label="Open menu">
              <Menu aria-hidden="true" size={22} strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent className="site-menu" finalFocus={() => pendingNavigation.current ? false : undefined}>
              <SheetTitle>GH CREATIVE</SheetTitle>
              <SheetDescription>Brand / Web / Visual / Audio</SheetDescription>
              <nav aria-label="Main navigation">
                {['Work', 'Services', 'Process', 'Pricing', 'Studio', 'Contact'].map((item, i) => (
                  <a
                    key={item}
                    href={'#' + (item === 'Process' ? 'offers' : item.toLowerCase())}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      pendingNavigation.current = item === 'Process' ? 'offers' : item.toLowerCase();
                      setOpenServices([]);
                      setContactCardOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <span>0{i + 1}</span>
                    {item}
                    <ArrowUpRight size={22} />
                  </a>
                ))}
              </nav>
              <div className="site-menu-actions">
                <p className="meta">MELBOURNE / WORLDWIDE</p>
                <ProjectBriefTrigger
                  className="button menu-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  START A PROJECT <ArrowRight size={20} />
                </ProjectBriefTrigger>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="hero-copy">
          <h1 id="hero-title">
            <span className="hero-line">
              <span className="hero-line-reveal">
                <span className="hero-title-glow">SHARE YOUR VISION</span>
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-reveal">
                <span className="hero-title-glow">WITH THE WORLD</span>
              </span>
            </span>
          </h1>
          <div className="hero-support">
            <p className="eyebrow hero-services">
              <span className="hero-services-reveal">
                WEB DESIGN / VISUAL / BRANDING / AUDIO
              </span>
            </p>
            <ProjectBriefTrigger className="button primary">
              <span className="cta-shimmer" aria-hidden="true" />
              START YOUR PROJECT. <ArrowRight size={22} />
            </ProjectBriefTrigger>
          </div>
        </div>
        <div className="hero-footer meta">
          <Dialog open={contactCardOpen} onOpenChange={setContactCardOpen}>
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
              <ProjectBriefTrigger className="contact-card-cta" onClick={() => setContactCardOpen(false)}>
                START A PROJECT <ArrowRight size={18} />
              </ProjectBriefTrigger>
            </DialogContent>
          </Dialog>
          <span>MELBOURNE / WORLDWIDE</span>
        </div>
      </section>
      <div className="work-field">
      <section className="section work" id="work">
        <p className="eyebrow section-index">
          <span>01 / MY WORK</span>
          <span>↗</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">Creativity with</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>intent.</em></span></span>
        </h2>
        <div className="work-stack" aria-label="Selected creative work">
          <figure className="work-panel work-panel--web">
            <Link prefetch={false} className="work-panel-link" href="/work/web-design" aria-label="Explore web design work" />
            <figcaption><span>01 / WEB DESIGN</span><span>↗</span></figcaption>
          </figure>
          <figure className="work-panel work-panel--visual">
            <Link prefetch={false} className="work-panel-link" href="/work/visual-design" aria-label="Explore visual design work" />
            <figcaption><span>02 / VISUAL DESIGN</span><span>↗</span></figcaption>
          </figure>
          <figure className="work-panel work-panel--brand">
            <Link prefetch={false} className="work-panel-link" href="/work/branding" aria-label="Explore branding work" />
            <figcaption><span>03 / BRANDING</span><span>↗</span></figcaption>
          </figure>
        </div>
        <div className="work-sequence-footer">
          <span className="meta">GH CREATIVE / STUDIO EXPLORATIONS</span>
          <div className="project-meter" aria-hidden="true"><span /></div>
        </div>
      </section>
      <div className="signal-ribbon" aria-hidden="true">
        <div className="signal-ribbon__line">GH CREATIVE * GH CREATIVE</div>
        <div className="signal-ribbon__line signal-ribbon__outline">
          SHOW THE WORLD YOUR VISION
        </div>
      </div>
      </div>
      <section
        className="section intro"
        id="services"
        data-service-expanded={openServices.length ? '' : undefined}
      >
        <p className="eyebrow section-index">
          <span>02 / MY SERVICES</span>
          <span>↓</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">Bold Ideas.</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>Considered Execution.</em></span></span>
        </h2>
        <p className="services-subhead">
          <a className="text-link" href="#service-list">
            VIEW MY SERVICES <ArrowDown size={15} />
          </a>
        </p>
        <Accordion
          className="services"
          id="service-list"
          multiple={false}
          value={openServices}
          onValueChange={(values) => {
            prepareServiceChange(values);
            setOpenServices(values);
          }}
        >
          {services.map((s, i) => (
            <AccordionItem key={s.name} value={s.name}>
              <AccordionTrigger className="service-trigger" data-service={s.name}>
                <span className="service-number">0{i + 1} /</span>
                <span data-content-reveal>{s.name}</span>
              </AccordionTrigger>
              <AccordionContent className="service-content">
                <p className="eyebrow">{s.tag}</p>
                <ul>
                  {s.items.map((item) => (
                    <li key={item.label}><strong>{item.label}</strong> — {item.description}</li>
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
        <p className="eyebrow section-index">
          <span>03 / HOW WE WORK</span>
          <span>↗</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">THE</span></span>
          <span className="section-title-line"><span className="section-title-reveal"><em>PROCESS</em></span></span>
        </h2>
        <article className="offer">
          <span className="eyebrow">01 / DISCOVERY & DIRECTION</span>
          <h3>Project brief.</h3>
          <ul className="process-points">
            <li>First contact & discovery meeting</li>
            <li>Project goals & requirements</li>
            <li>Agreed scope, budget & timeline</li>
          </ul>
          <ProjectBriefTrigger className="offer-link">
            PLAN A PROJECT <ArrowUpRight size={20} aria-hidden="true" />
          </ProjectBriefTrigger>
        </article>
        <article className="offer">
          <span className="eyebrow">02 / CREATE, REFINE & DELIVER</span>
          <h3>Project build.</h3>
          <ul className="process-points">
            <li>Design & development</li>
            <li>Regular feedback & refinements</li>
            <li>Final review, testing & delivery</li>
          </ul>
          <ProjectBriefTrigger className="offer-link">
            DISCUSS YOUR PROJECT <ArrowUpRight size={20} aria-hidden="true" />
          </ProjectBriefTrigger>
        </article>
        <article className="offer">
          <span className="eyebrow">03 / SUPPORT & GROWTH</span>
          <h3>Ongoing partnership.</h3>
          <ul className="process-points">
            <li>Support after delivery</li>
            <li>Updates & improvements</li>
            <li>Planning your next steps together</li>
          </ul>
          <ProjectBriefTrigger className="offer-link">
            EXPLORE A PARTNERSHIP <ArrowUpRight size={20} aria-hidden="true" />
          </ProjectBriefTrigger>
        </article>
      </section>
      </div>
      <PricingSection />
      <section className="section studio" id="studio">
        <p className="eyebrow section-index">
          <span>05 / THE PERSON BEHIND THE WORK</span>
          <span>GH</span>
        </p>
        <h2>
          <span className="section-title-line"><span className="section-title-reveal">About me.</span></span>
          <span className="studio-portrait" aria-hidden="true" />
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
          <span>06 / YOUR NEXT CHAPTER</span>
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
        <div className="contact-form">
          <ProjectBriefTrigger className="button primary">
            START A PROJECT <ArrowRight size={19} />
          </ProjectBriefTrigger>
          <p className="form-note">Tell me about your project, one step at a time.</p>
        </div>
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
          <a
            className="footer-instagram"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            INSTAGRAM
          </a>
          <span>MELBOURNE / WORLDWIDE</span>
        </div>
      </footer>
    </main>
  );
}
