/* Static hosting uses document navigation; vinext Link requires a server router. */
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { MiniFooter } from '@/components/mini/site-shell';
import { OriginalHero } from '@/components/hero/original-hero';

const services = [
  {
    name: 'Web design',
    description: 'A digital home with a point of view.',
    details:
      'Custom websites, landing pages, online stores and thoughtful UI / UX. Designed around your brand, built for the people using it.',
  },
  {
    name: 'Visual design',
    description: 'Images that make people stop.',
    details:
      'Brand imagery, product visuals, campaign assets, social content and motion design. One clear visual direction across every touchpoint.',
  },
  {
    name: 'Branding',
    description: 'An identity that feels like you.',
    details:
      'Logo and identity direction, typography, colour and a consistent visual language to bring your brand together.',
  },
  {
    name: 'Marketing',
    description: 'Creative that carries your message.',
    details:
      'Campaign concepts, ad creatives, email design, copywriting and launch content shaped around your audience.',
  },
  {
    name: 'Audio design',
    description: 'Give your ideas a sound of their own.',
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
      <section
        className="mini-section"
        id="services"
        aria-labelledby="mini-services-title"
      >
        <p className="mini-index">
          <span>01 / WHAT I DO</span>
          <ArrowDown size={15} aria-hidden="true" />
        </p>
        <h2 id="mini-services-title">
          BOLD IDEAS.
          <br />
          <span>THOUGHTFULLY MADE.</span>
        </h2>
        <p className="mini-intro">
          One creative partner. The right mix of skills for your next move.
        </p>
        <div className="mini-services">
          {services.map((service, index) => (
            <details
              className="mini-service"
              name="services"
              key={service.name}
            >
              <summary>
                <span className="mini-service-number">0{index + 1}</span>
                <span>
                  <strong>{service.name}</strong>
                  <small>{service.description}</small>
                </span>
                <Plus size={19} aria-hidden="true" />
              </summary>
              <div className="mini-service-body">
                <p>{service.details}</p>
                <ProjectBriefTrigger
                  className="mini-text-button"
                  data-service={service.name}
                >
                  ENQUIRE ABOUT {service.name.toUpperCase()}{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </ProjectBriefTrigger>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section
        className="mini-section"
        id="work"
        aria-labelledby="mini-work-title"
      >
        <p className="mini-index">
          <span>02 / SELECTED WORK</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </p>
        <h2 id="mini-work-title">
          CREATIVITY
          <br />
          WITH <span>INTENT.</span>
        </h2>
        <p className="mini-intro">
          Websites, visual art and brand identities. Tap to explore.
        </p>
        <div className="mini-work-list">
          {work.map((item, index) => (
            <a
              className={`mini-work-card mini-work-card--${item.treatment}`}
              href={item.href}
              key={item.href}
            >
              <div className="mini-work-image">
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
              <div className="mini-work-label">
                <span>
                  <small>
                    0{index + 1} / {item.category}
                  </small>
                  <strong>{item.title}</strong>
                </span>
                <ArrowUpRight size={23} aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section
        className="mini-section mini-about"
        id="studio"
        aria-labelledby="mini-about-title"
      >
        <p className="mini-index">
          <span>03 / YOUR CREATIVE PARTNER</span>
          <span>GH</span>
        </p>
        <h2 id="mini-about-title">
          HI, I’M <span>GENE.</span>
        </h2>
        <Image
          className="mini-studio-image"
          src="/assets/gene-studio.png"
          alt="Gene at GH Creative — digital experiences, web design, branding, visual, motion and audio"
          width={1281}
          height={1575}
          unoptimized
          sizes="(max-width: 480px) 90vw, 432px"
        />
        <p>
          I bring web, visual design, branding and audio together to give your
          ideas a clear, consistent presence.
        </p>
        <p>
          You work directly with me, from the first conversation to the final
          details.
        </p>
        <div className="mini-process">
          <span>01 / LET’S TALK</span>
          <ArrowRight size={13} aria-hidden="true" />
          <span>02 / CREATE</span>
          <ArrowRight size={13} aria-hidden="true" />
          <span>03 / DELIVER</span>
        </div>
        <details className="mini-faq">
          <summary>
            What does a project cost?
            <Plus size={17} aria-hidden="true" />
          </summary>
          <p>
            Every project is different. We’ll agree on the scope, budget and
            timeline before the work begins. Share your idea and I’ll put
            together a tailored quote.
          </p>
        </details>
      </section>
      <section
        className="mini-section mini-contact"
        id="contact"
        aria-labelledby="mini-contact-title"
      >
        <p className="mini-index">
          <span>04 / WHAT’S NEXT?</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </p>
        <h2 id="mini-contact-title">
          GOT AN IDEA?
          <br />
          <span>LET’S MAKE IT.</span>
        </h2>
        <p>
          You don’t need a finished brief.
          <br />
          Just a starting point.
        </p>
        <ProjectBriefTrigger className="mini-button mini-button-dark">
          SEND AN INQUIRY <ArrowUpRight size={20} aria-hidden="true" />
        </ProjectBriefTrigger>
        <p>
          Your confirmation comes from hello@gh-creative.app.
          <br />
          Hit reply to continue the conversation with Gene.
        </p>
        <div className="mini-direct-contact">
          <a href="mailto:gene@alias.com.ai">
            Email Gene <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="tel:+61405179803">
            Prefer a call? <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
      <MiniFooter />
    </main>
  );
}
