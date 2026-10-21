'use client';
import { PixelSectionTransition } from '@/components/motion/pixel-section-transition';
import { DesktopWorkGallery } from '@/components/work/desktop-work-gallery';
import { WorkCover } from '@/components/work/work-cover';
import { galleryExamples } from '@/lib/work-covers';
import { StaggeredText } from '@/components/ui/staggered-text';
import { useRef, useState } from 'react';
/* Static export uses document navigation for work routes. */
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ArrowDown, Menu } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  ColourWipeAccordion as Accordion,
  ColourWipeAccordionItem as AccordionItem,
  ColourWipeAccordionTrigger as AccordionTrigger,
  ColourWipeAccordionContent as AccordionContent,
} from '@/components/ui/colour-wipe-accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { InlineProjectBrief } from '@/components/project/inline-project-brief';
import { PricingSection } from '@/components/project/pricing-section';
import { GHMonogram } from '@/components/brand/gh-monogram';

import { useScrollMotion } from '@/components/motion/use-scroll-motion';
import { useServiceExpansion } from '@/components/motion/use-service-expansion';
import { DepthScene } from '@/components/motion/depth-scene';
import { HeroGlobe } from '@/components/hero/hero-globe';

const services = [
  {
    name: 'Web design',
    tag: 'Web Design & Development',
    workHref: '/work/web-design',
    items: [
      {
        label: 'Custom websites',
        description:
          'Distinctive websites designed around your brand and business goals.',
      },
      {
        label: 'Landing pages',
        description:
          'Focused pages for campaigns, product launches and lead generation.',
      },
      {
        label: 'E-commerce websites',
        description:
          'Online stores that make browsing and buying feel effortless.',
      },
      {
        label: 'UI & UX design',
        description:
          'Thoughtful layouts and intuitive navigation that guide users through your site.',
      },
      {
        label: 'Responsive design',
        description:
          'Websites that look and work beautifully across desktop, tablet and mobile.',
      },
      {
        label: 'Website redesigns',
        description:
          'Refreshing existing sites with stronger visuals, clearer messaging and improved usability.',
      },
      {
        label: 'Motion & interaction',
        description:
          'Purposeful animations and interactive details that bring your website to life.',
      },
      {
        label: 'Ongoing updates & support',
        description:
          'Keeping your website fresh, functional and aligned with your business.',
      },
    ],
  },
  {
    name: 'Visual',
    tag: 'Visual Design & Content Creation',
    workHref: '/work/visual-design',
    items: [
      {
        label: 'Brand imagery',
        description: 'Custom visuals that reflect your brand’s identity.',
      },
      {
        label: 'Product imagery',
        description: 'Product shots, lifestyle scenes and styled compositions.',
      },
      {
        label: 'Campaign visuals',
        description:
          'Creative assets for launches, promotions and advertising.',
      },
      {
        label: 'Social media content',
        description: 'Static posts, stories, reels and short-form videos.',
      },
      {
        label: 'Brand films & video',
        description: 'Promotional videos, brand stories and product showcases.',
      },
      {
        label: 'Motion design',
        description: 'Animated graphics, typography and visual effects.',
      },
      {
        label: 'Website imagery',
        description: 'Hero images, banners and supporting visuals.',
      },
    ],
  },
  {
    name: 'Branding',
    tag: 'Brand Identity & Applications',
    workHref: '/work/branding',
    items: [
      {
        label: 'Logos & identity',
        description:
          'Logo systems, symbols and motion identities with a clear point of view.',
      },
      {
        label: 'Print & stationery',
        description:
          'Business cards, letterheads and stationery that work as one identity.',
      },
      {
        label: 'Business documents',
        description:
          'Branded templates for invoices, proposals and everyday communication.',
      },
      {
        label: 'Advertising & campaigns',
        description:
          'A consistent visual direction across product, lifestyle and launch creative.',
      },
      {
        label: 'Social & sharing assets',
        description:
          'Profile covers, banners and sharing graphics for your channels.',
      },
      {
        label: 'Email design',
        description:
          'Signatures, welcome emails and transactional messages designed around your brand.',
      },
    ],
  },
  {
    name: 'Marketing',
    tag: 'Marketing & Campaign Content',
    workHref: '/work/marketing',
    items: [
      {
        label: 'Ad creatives',
        description:
          'Static and video ads for paid social and digital campaigns.',
      },
      {
        label: 'Social media creatives',
        description: 'Branded posts, carousels, stories and reels.',
      },
      {
        label: 'Email marketing content',
        description:
          'Email design and copy for newsletters, promotions and automated sequences.',
      },
      {
        label: 'Campaign concepts',
        description:
          'Creative ideas and messaging that connect your marketing across channels.',
      },
      {
        label: 'Launch content',
        description:
          'Coordinated assets for product releases, announcements and promotions.',
      },
      {
        label: 'Landing page content',
        description:
          'Campaign-focused copy and visuals that turn interest into action.',
      },
      {
        label: 'Marketing copywriting',
        description:
          'Headlines, captions and messaging shaped around your brand’s voice.',
      },
      {
        label: 'Promotional materials',
        description:
          'Digital brochures, flyers and presentations that showcase your offering.',
      },
    ],
  },
  {
    name: 'Audio',
    tag: 'Audio Production & Sound Design',
    workHref: '/work/audio',
    items: [
      {
        label: 'Royalty-free music samples',
        description:
          'Original loops, beats and musical elements for creative projects.',
      },
      {
        label: 'Sound effects',
        description:
          'Custom sounds for videos, animations and digital experiences.',
      },
      {
        label: 'Sound design',
        description:
          'Atmospheric textures and audio layers that bring visuals to life.',
      },
      {
        label: 'Sonic branding',
        description:
          'Audio logos and signature sounds that give your brand a recognisable identity.',
      },
    ],
  },
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
  const contactCardOpener = useRef<HTMLButtonElement | null>(null);
  return (
    <main className="mobile-site immersive-site" id="top" ref={root}>
      <DepthScene hero />
      <section className="hero" aria-labelledby="hero-title">
        <HeroGlobe />
        <header className="nav">
          <a
            href="#top"
            className="hero-logo"
            aria-label="GH Creative / back to top"
          >
            <GHMonogram wordmark />
          </a>
          <Sheet
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onOpenChangeComplete={async (open) => {
              if (open || !pendingNavigation.current) return;
              const id = pendingNavigation.current;
              // Let accordion height animations finish before measuring destinations.
              const animations =
                root.current
                  ?.querySelector('#services')
                  ?.getAnimations({ subtree: true }) ?? [];
              await Promise.allSettled(
                animations.map((animation) => animation.finished),
              );
              if (pendingNavigation.current !== id) return;
              pendingNavigation.current = null;
              const target = root.current?.querySelector<HTMLElement>('#' + id);
              if (!target) return;
              target.dataset.menuRevealed = '';
              root.current
                ?.querySelector('.pricing-track')
                ?.dispatchEvent(
                  new CustomEvent('pricing:select', { detail: 0 }),
                );
              const handled =
                root.current &&
                !root.current.dispatchEvent(
                  new CustomEvent('site:navigate', {
                    detail: id,
                    cancelable: true,
                  }),
                );
              if (!handled)
                target.scrollIntoView({ block: 'start', behavior: 'instant' });
              history.replaceState(null, '', '#' + id);
              const heading = target.querySelector<HTMLElement>('h2');
              heading?.setAttribute('tabindex', '-1');
              heading?.focus({ preventScroll: true });
            }}
          >
            <SheetTrigger className="menu-trigger" aria-label="Open menu">
              <Menu aria-hidden="true" size={22} strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent
              className="site-menu"
              finalFocus={() => (pendingNavigation.current ? false : undefined)}
            >
              <SheetTitle>GH CREATIVE</SheetTitle>
              <SheetDescription>Brand / Web / Visual / Audio</SheetDescription>
              <nav aria-label="Main navigation">
                {[
                  'Work',
                  'Services',
                  'Process',
                  'Pricing',
                  'Studio',
                  'Contact',
                ].map((item, i) => (
                  <a
                    key={item}
                    href={
                      '#' + (item === 'Process' ? 'offers' : item.toLowerCase())
                    }
                    onClick={(event) => {
                      if (
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      pendingNavigation.current =
                        item === 'Process' ? 'offers' : item.toLowerCase();
                      setOpenServices([]);
                      setContactCardOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <span>0{i + 1}</span>
                    {item === 'Pricing' ? 'Work Together' : item}
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
                  externallyAnimated
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
                  externallyAnimated
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
                  externallyAnimated
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
              START YOUR PROJECT. <ArrowRight size={22} />
            </ProjectBriefTrigger>
            <a className="button hero-work-link" href="#work">
              VIEW MY WORK <ArrowDown size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-footer meta">
          <Dialog open={contactCardOpen} onOpenChange={setContactCardOpen}>
            <DialogTrigger
              className="contact-card-trigger"
              onClick={(event) => {
                contactCardOpener.current = event.currentTarget;
              }}
            >
              CONTACT ↗
            </DialogTrigger>
            <DialogContent
              className="contact-card"
              finalFocus={() => contactCardOpener.current ?? undefined}
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
                <a href="mailto:gene@alias.com.ai">gene@alias.com.ai</a>
              </div>
              <ProjectBriefTrigger
                className="contact-card-cta"
                onClick={() => setContactCardOpen(false)}
              >
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
            <span className="section-title-line">
              <span className="section-title-reveal">
                <StaggeredText
                  as="span"
                  text="Creativity with"
                  desktopOnly
                  viewportReveal
                  segmentBy="chars"
                  delay={28}
                  duration={0.8}
                  direction="bottom"
                  blur={false}
                />
              </span>
            </span>
            <span className="section-title-line">
              <span className="section-title-reveal">
                <em>
                  <StaggeredText
                    as="span"
                    text="intent."
                    desktopOnly
                    viewportReveal
                    segmentBy="chars"
                    delay={28}
                    duration={0.8}
                    direction="bottom"
                    blur={false}
                  />
                </em>
              </span>
            </span>
          </h2>
          <DesktopWorkGallery />
          <div className="work-stack" aria-label="Selected creative work">
            {galleryExamples.map((item, index) => (
              <figure
                className={`work-panel work-panel--${item.treatment}`}
                key={item.image}
              >
                <WorkCover item={item} rotate={false} />
                <a className="work-panel-link" href={item.href}>
                  <span>
                    <strong>
                      0{index + 1} / {item.category}
                    </strong>
                    <small>{item.description}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </figure>
            ))}
          </div>
          <div className="work-sequence-footer">
            <span className="meta">GH CREATIVE / SELECTED WORK</span>
            <div className="project-meter" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>
        <div className="signal-ribbon" aria-hidden="true">
          <div className="signal-ribbon__line">
            {[0, 1].map((copy) => (
              <span className="signal-ribbon__copy" key={copy}>
                GH CREATIVE * GH CREATIVE * GH CREATIVE * GH CREATIVE *{' '}
              </span>
            ))}
          </div>
          <div className="signal-ribbon__line signal-ribbon__outline">
            {[0, 1].map((copy) => (
              <span className="signal-ribbon__copy" key={copy}>
                SHOW THE WORLD YOUR VISION * SHOW THE WORLD YOUR VISION *{' '}
              </span>
            ))}
          </div>
        </div>
      </div>
      <section
        className="section intro"
        id="services"
        data-service-expanded={openServices.length ? '' : undefined}
      >
        <div className="services-globe" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="none">
            <use href="/assets/planet-wireframe.svg#mesh" />
          </svg>
        </div>
        <p className="eyebrow section-index">
          <span>02 / MY SERVICES</span>
          <span>↓</span>
        </p>
        <h2>
          <span className="section-title-line">
            <span className="section-title-reveal">
              <StaggeredText
                as="span"
                text="Bold Ideas."
                desktopOnly
                viewportReveal
                segmentBy="chars"
                delay={28}
                duration={0.8}
                direction="bottom"
                blur={false}
              />
            </span>
          </span>
          <span className="section-title-line">
            <span className="section-title-reveal">
              <em>
                <StaggeredText
                  as="span"
                  text="Considered Execution."
                  desktopOnly
                  viewportReveal
                  segmentBy="chars"
                  delay={28}
                  duration={0.8}
                  direction="bottom"
                  blur={false}
                />
              </em>
            </span>
          </span>
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
              <AccordionTrigger
                className="service-trigger"
                data-service={s.name}
              >
                <span className="service-number">0{i + 1} /</span>
                <span data-content-reveal>{s.name}</span>
              </AccordionTrigger>
              <AccordionContent className="service-content">
                <p className="eyebrow">{s.tag}</p>
                <ul>
                  {s.items.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong>: {item.description}
                    </li>
                  ))}
                </ul>
                <a href="#contact">
                  LET’S TALK {s.name.toUpperCase()} <ArrowUpRight size={16} />
                </a>
                <a className="service-work-link" href={s.workHref}>
                  SEE MY WORK <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <div className="offers-scroll-region">
        <section className="section offers" id="offers">
          <PixelSectionTransition disabled={motionPaused} />
          <p className="eyebrow section-index">
            <span>03 / HOW WE WORK</span>
            <span>↗</span>
          </p>
          <h2>
            <span className="section-title-line">
              <span className="section-title-reveal">
                <StaggeredText
                  as="span"
                  text="THE"
                  desktopOnly
                  viewportReveal
                  segmentBy="chars"
                  delay={28}
                  duration={0.8}
                  direction="bottom"
                  blur={false}
                />
              </span>
            </span>
            <span className="section-title-line">
              <span className="section-title-reveal">
                <em>
                  <StaggeredText
                    as="span"
                    text="PROCESS"
                    desktopOnly
                    viewportReveal
                    segmentBy="chars"
                    delay={28}
                    duration={0.8}
                    direction="bottom"
                    blur={false}
                  />
                </em>
              </span>
            </span>
          </h2>
          <ol className="process-list">
            <li className="offer">
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
            </li>
            <li className="offer">
              <span className="eyebrow">02 / CREATE, REFINE & DELIVER</span>
              <h3>Project build.</h3>
              <ul className="process-points">
                <li>Design & development</li>
                <li>Regular feedback & refinements</li>
                <li>Final review, testing & delivery</li>
              </ul>
              <ProjectBriefTrigger className="offer-link">
                DISCUSS YOUR PROJECT{' '}
                <ArrowUpRight size={20} aria-hidden="true" />
              </ProjectBriefTrigger>
            </li>
            <li className="offer">
              <span className="eyebrow">03 / SUPPORT & GROWTH</span>
              <h3>Ongoing partnership.</h3>
              <ul className="process-points">
                <li>Support after delivery</li>
                <li>Updates & improvements</li>
                <li>Planning your next steps together</li>
              </ul>
              <ProjectBriefTrigger className="offer-link">
                EXPLORE A PARTNERSHIP{' '}
                <ArrowUpRight size={20} aria-hidden="true" />
              </ProjectBriefTrigger>
            </li>
          </ol>
        </section>
      </div>
      <PricingSection />
      <section className="section studio" id="studio">
        <p className="eyebrow section-index">
          <span>05 / THE PERSON BEHIND THE WORK</span>
          <span>GH</span>
        </p>
        <h2>
          <span className="section-title-line">
            <span className="section-title-reveal">
              <StaggeredText
                as="span"
                text="About"
                desktopOnly
                viewportReveal
                segmentBy="chars"
                delay={28}
                duration={0.8}
                direction="bottom"
                blur={false}
              />{' '}
              <StaggeredText
                as="span"
                className="studio-title-outline"
                text="me."
                desktopOnly
                viewportReveal
                segmentBy="chars"
                delay={28}
                startDelay={168}
                duration={0.8}
                direction="bottom"
                blur={false}
              />
            </span>
          </span>
          <span className="studio-portrait" aria-hidden="true" />
        </h2>
        <p className="body-copy">
          <span className="studio-copy-block">
            I’m Gene. My creative foundation is in audio engineering, where I
            qualified and developed an ear for detail.
          </span>{' '}
          <span className="studio-copy-block">
            Working across creative software and multimedia has since taken that
            curiosity beyond sound.
          </span>
        </p>
        <p className="body-copy studio-follow">
          <span className="studio-copy-block">
            Today, I help people turn their ideas into digital experiences with
            a personality of their own.
          </span>{' '}
          <span className="studio-copy-block">
            I want to understand what makes your brand yours, then bring it to
            life through design, visuals and audio so you can share it with the
            world.
          </span>
        </p>
        <div className="studio-location meta">
          <span className="status-dot" />{' '}
          <span data-content-reveal>MELBOURNE / WORKING WORLDWIDE</span>
        </div>
        <button
          type="button"
          className="button primary studio-contact"
          aria-haspopup="dialog"
          onClick={(event) => {
            contactCardOpener.current = event.currentTarget;
            setContactCardOpen(true);
          }}
        >
          CONTACT <ArrowUpRight size={20} aria-hidden="true" />
        </button>
        <Image
          className="studio-desktop-portrait"
          src="/assets/gene-studio.png"
          alt="Gene at GH Creative — web, visual, branding and audio design"
          width={1281}
          height={1575}
          unoptimized
        />
      </section>
      <div className="contact-finale">
        <section className="section contact" id="contact">
          <p className="eyebrow section-index">
            <span>06 / YOUR NEXT CHAPTER</span>
            <span>↗</span>
          </p>
          <div className="contact-finale__copy">
            <h2 className="dot-heading">
              <span className="section-title-line">
                <span className="section-title-reveal">
                  <StaggeredText
                    as="span"
                    text="LET’S MAKE"
                    desktopOnly
                    viewportReveal
                    segmentBy="chars"
                    delay={28}
                    duration={0.8}
                    direction="bottom"
                    blur={false}
                  />
                </span>
              </span>
              <span className="section-title-line">
                <span className="section-title-reveal">
                  <StaggeredText
                    as="span"
                    text="SOMETHING"
                    desktopOnly
                    viewportReveal
                    segmentBy="chars"
                    delay={28}
                    duration={0.8}
                    direction="bottom"
                    blur={false}
                  />
                </span>
              </span>
              <span className="section-title-line">
                <span className="section-title-reveal">
                  <StaggeredText
                    as="span"
                    className="contact-title-outline"
                    text="MATTER."
                    desktopOnly
                    viewportReveal
                    segmentBy="chars"
                    delay={28}
                    duration={0.8}
                    direction="bottom"
                    blur={false}
                  />
                </span>
              </span>
            </h2>
            <p className="body-copy">
              Have a project in mind? Start with the idea. We can work out the
              rest.
            </p>
            <p className="body-copy">
              Whether you’re building something new or rethinking what’s already
              there, I can help bring your brand, website, visuals and audio
              together.
            </p>
            <p className="body-copy">
              Tell me where you’re at and what you’d like to achieve. You don’t
              need a finished brief, just a starting point.
            </p>
            <div className="contact-form">
              <ProjectBriefTrigger className="button primary">
                START A PROJECT <ArrowRight size={19} />
              </ProjectBriefTrigger>
              <p className="form-note">
                Your confirmation comes from hello@gh-creative.app. Reply to
                that email to continue the conversation with Gene.
              </p>
            </div>
          </div>
          <div className="contact-finale__form">
            <InlineProjectBrief />
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
          <ProjectBriefTrigger className="footer-contact">
            CONTACT <ArrowUpRight size={18} aria-hidden="true" />
          </ProjectBriefTrigger>
          <div className="footer-bottom meta">
            <span>© {new Date().getFullYear()} GH CREATIVE</span>
            <a
              className="footer-instagram"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              INSTAGRAM
            </a>
            <span>MELBOURNE / WORLDWIDE</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
