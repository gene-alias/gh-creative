/* Static hosting uses document navigation; vinext Link requires a server router. */
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { MiniFooter } from '@/components/mini/site-shell';
import { OriginalHero } from '@/components/hero/original-hero';

const services = [
  {
    name: 'Websites',
    enquiry: 'Web design',
    description: 'Designed for desktop and mobile, and easy to use on both.',
    image: '/assets/field-record/svc-websites.webp',
    details:
      'Custom websites, landing pages, online stores and thoughtful UI / UX. Designed around your brand, built for the people using it.',
  },
  {
    name: 'Visual design',
    enquiry: 'Visual design',
    description: 'Images for ads and social media that make people stop.',
    image: '/assets/field-record/svc-visual.webp',
    details:
      'Brand imagery, product visuals, campaign assets, social content and motion design. One clear visual direction across every touchpoint.',
  },
  {
    name: 'Branding',
    enquiry: 'Branding',
    description: 'A logo, colours and type that work on everything you use.',
    image: '/assets/field-record/svc-branding.webp',
    details:
      'Logo and identity direction, typography, colour and a consistent visual language to bring your brand together.',
  },
  {
    name: 'AI assistants',
    enquiry: 'AI assistants',
    description: 'An assistant on your site that answers the common questions.',
    image: '/assets/field-record/svc-ai.webp',
    details:
      'A customer-facing assistant set up with your business details. It answers the common questions, takes enquiry details and sends them straight to you.',
  },
  {
    name: 'Marketing',
    enquiry: 'Marketing',
    description: 'Social content and ad campaigns that carry your message.',
    image: '/assets/field-record/svc-marketing.webp',
    details:
      'Campaign concepts, ad creatives, email design, copywriting and launch content shaped around your audience.',
  },
  {
    name: 'Audio design',
    enquiry: 'Audio design',
    description: 'Give your ideas a sound of their own.',
    image: '/assets/field-record/svc-audio.webp',
    details:
      'Original music, sound effects, atmospheric sound design and sonic branding, from an audio engineering foundation.',
  },
];

const visualCoverFrames = [
  {
    src: '/assets/work/visual/fashion-eyewear/021.webp',
    width: 1800,
    height: 1005,
  },
  {
    src: '/assets/work/visual/architecture-interiors/056.webp',
    width: 1800,
    height: 1005,
  },
  {
    src: '/assets/work/visual/jewellery-portraits/048.webp',
    width: 1800,
    height: 1013,
  },
  {
    src: '/assets/work/visual/cinematic-character/040.webp',
    width: 1664,
    height: 960,
  },
  {
    src: '/assets/work/visual/fitness-training/069.webp',
    width: 1800,
    height: 1018,
  },
];

const work = [
  {
    title: 'Custom websites. Online stores. Digital experiences.',
    category: 'WEBSITES',
    href: '/work/web-design',
    image: '/assets/work/videos/centum-cover.gif',
    still: '/assets/work/centum-thumbnail.jpg',
    width: 480,
    height: 279,
    alt: 'CENTUM website preview',
    treatment: 'web',
  },
  {
    title: 'Image-making. Art direction. Visual concepts.',
    category: 'VISUAL',
    href: '/work/visual-design',
    image: '/assets/work/visual/fashion-eyewear/021.webp',
    width: 1800,
    height: 1005,
    alt: 'A close portrait with amber-tinted eyewear and a deep teal background.',
    treatment: 'visual',
  },
  {
    title: 'Logo design. Visual identities. Brand systems.',
    category: 'BRANDING',
    href: '/work/branding',
    image: '/assets/work/alias/liquid-metal-cover.gif',
    still: '/assets/work/alias/liquid-metal-poster.jpg',
    width: 640,
    height: 640,
    alt: 'ALIAS liquid-metal chrome logo on black',
    treatment: 'brand',
  },
];

export default function Home() {
  return (
    <main className="mini-site" id="top">
      <a className="mini-skip" href="#services">
        Skip to services
      </a>
      <OriginalHero />
      <section className="fr-section" id="services" aria-labelledby="fr-services-title">
        <header className="fr-head">
          <p className="fr-eyebrow">{'// 01 · WHAT I DO'}</p>
          <h2 id="fr-services-title">What I can help with.</h2>
          <p className="fr-intro">
            One creative partner. The right mix of skills for your next move.
          </p>
        </header>
        <div className="fr-services">
          {services.map((service) => (
            <details className="fr-service" name="services" key={service.name}>
              <summary>
                <Image
                  className="fr-service-thumb"
                  src={service.image}
                  width={640}
                  height={407}
                  alt=""
                  unoptimized
                />
                <span className="fr-service-text">
                  <strong>{service.name}</strong>
                  <small>{service.description}</small>
                </span>
                <Plus className="fr-service-plus" size={18} aria-hidden="true" />
              </summary>
              <div className="fr-service-body">
                <p>{service.details}</p>
                <ProjectBriefTrigger
                  className="fr-button fr-button--primary"
                  data-service={service.enquiry}
                >
                  <span>ENQUIRE ABOUT {service.name.toUpperCase()}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </ProjectBriefTrigger>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="fr-section" id="work" aria-labelledby="fr-work-title">
        <header className="fr-head">
          <p className="fr-eyebrow">{'// 02 · SELECTED WORK'}</p>
          <h2 id="fr-work-title">Recent work.</h2>
          <p className="fr-intro">
            Websites, visual art and brand identities. Tap to explore.
          </p>
        </header>
        <div className="fr-work-list">
          {work.map((item, index) => (
            <a
              className={`fr-work-card mini-work-card--${item.treatment}`}
              href={item.href}
              key={item.href}
            >
              <div className="mini-work-image fr-work-image">
                {item.treatment === 'visual' ? (
                  visualCoverFrames.map((frame, frameIndex) => (
                    <Image
                      className="mini-work-cover-frame"
                      style={{ animationDelay: `${frameIndex * 2 - 10.2}s` }}
                      key={frame.src}
                      unoptimized
                      src={frame.src}
                      width={frame.width}
                      height={frame.height}
                      alt={frameIndex === 0 ? item.alt : ''}
                      sizes="(max-width: 480px) 90vw, 432px"
                    />
                  ))
                ) : (
                  <picture>
                    {item.still ? (
                      <source
                        media="(prefers-reduced-motion: reduce)"
                        srcSet={item.still}
                      />
                    ) : null}
                    <Image
                      unoptimized
                      src={item.image}
                      width={item.width}
                      height={item.height}
                      alt={item.alt}
                      sizes="(max-width: 480px) 90vw, 432px"
                    />
                  </picture>
                )}
              </div>
              <div className="fr-work-label">
                <span>
                  <small>
                    0{index + 1} · {item.category}
                  </small>
                  <strong>{item.title}</strong>
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="fr-section fr-about" id="studio" aria-labelledby="fr-about-title">
        <Image
          className="fr-about-image"
          src="/assets/gene-studio.png"
          alt="Gene at GH Creative — digital experiences, web design, branding, visual, motion and audio"
          width={1281}
          height={1575}
          unoptimized
          sizes="(max-width: 480px) 90vw, 432px"
        />
        <p className="fr-eyebrow">{'// 03 · YOUR CREATIVE PARTNER'}</p>
        <h2 id="fr-about-title">Hi, I’m Gene.</h2>
        <p className="fr-body">
          I bring web, visual design, branding and audio together to give your
          ideas a clear, consistent presence.
        </p>
        <p className="fr-body">
          You work directly with me, from the first conversation to the final
          details.
        </p>
      </section>
      <section className="fr-section fr-process" id="process" aria-labelledby="fr-process-title">
        <p className="fr-eyebrow">{'// 04 · PROCESS'}</p>
        <h2 id="fr-process-title">How a project runs.</h2>
        <ol className="fr-steps">
          <li>
            <span className="fr-step-number fr-step-number--current">01</span>
            <span>
              <strong>Let’s talk.</strong>
              <small>You don’t need a finished brief, just a starting point.</small>
            </span>
          </li>
          <li>
            <span className="fr-step-number">02</span>
            <span>
              <strong>Create.</strong>
              <small>You see it take shape before anything goes live.</small>
            </span>
          </li>
          <li>
            <span className="fr-step-number">03</span>
            <span>
              <strong>Deliver.</strong>
              <small>Checked on phone, tablet and laptop. Then it’s yours.</small>
            </span>
          </li>
        </ol>
        <details className="fr-faq">
          <summary>
            What does a project cost?
            <Plus size={18} aria-hidden="true" />
          </summary>
          <p>
            Every project is different. We’ll agree on the scope, budget and
            timeline before the work begins. Share your idea and I’ll put
            together a tailored quote.
          </p>
        </details>
      </section>
      <section className="fr-contact" id="contact" aria-labelledby="fr-contact-title">
        <div className="fr-hud">
          <span className="fr-corner fr-corner--tl" aria-hidden="true" />
          <span className="fr-corner fr-corner--tr" aria-hidden="true" />
          <span className="fr-corner fr-corner--bl" aria-hidden="true" />
          <span className="fr-corner fr-corner--br" aria-hidden="true" />
          <p className="fr-eyebrow">{'// 05 · WHAT’S NEXT'}</p>
          <h2 id="fr-contact-title">Got an idea? Let’s make it.</h2>
          <p className="fr-body">
            Send me a message and tell me what you’re working on.
          </p>
          <div className="fr-button-stack">
            <ProjectBriefTrigger className="fr-button fr-button--primary">
              <span>SEND AN ENQUIRY</span>
              <ArrowRight size={16} aria-hidden="true" />
            </ProjectBriefTrigger>
            <a className="fr-button" href="mailto:gene@alias.com.ai">
              <span>EMAIL GENE</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a className="fr-button" href="tel:+61405179803">
              <span>PREFER A CALL?</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="fr-note">
            Your confirmation comes from hello@gh-creative.app. Hit reply to
            continue the conversation with Gene.
          </p>
        </div>
      </section>
      <MiniFooter />
    </main>
  );
}
