import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { MiniFooter } from '@/components/mini/site-shell';
import { OriginalHero } from '@/components/hero/original-hero';
import { WebsitePreview } from '@/components/work/website-preview';

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

const work = [
  {
    title: 'CENTUM. INCREDIBLE KITCHENS. LOVERBOY CLUB. KONSTRUKT. ALIAS.',
    category: 'WEBSITES',
    href: '/work/web-design',
    image: '/assets/work/centum-thumbnail.jpg',
    width: 1440,
    height: 838,
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
    title: 'INCREDIBLE KITCHENS. ALIAS.',
    category: 'BRANDING',
    href: '/work/branding',
    image: '/assets/work/incredible-kitchens/business-cards.webp',
    width: 1600,
    height: 1067,
    alt: 'Incredible Kitchens cream and charcoal business card designs',
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
          {work.map((item, index) =>
            item.treatment === 'web' ? (
              <div
                className="mini-work-card mini-work-card--web"
                key={item.href}
              >
                <WebsitePreview
                  src="/assets/work/videos/centum.mp4"
                  poster={item.image}
                  width={item.width}
                  height={item.height}
                  label="CENTUM website video preview"
                />
                <Link
                  className="mini-work-label"
                  href={item.href}
                  prefetch={false}
                >
                  <span>
                    <small>
                      0{index + 1} / {item.category}
                    </small>
                    <strong>{item.title}</strong>
                  </span>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <Link
                className={`mini-work-card mini-work-card--${item.treatment}`}
                href={item.href}
                key={item.href}
                prefetch={false}
              >
                <div className="mini-work-image">
                  {item.image ? (
                    <Image
                      unoptimized
                      src={item.image}
                      width={item.width}
                      height={item.height}
                      alt={item.alt}
                      sizes="(max-width: 480px) 90vw, 432px"
                    />
                  ) : (
                    <div className="mini-visual-cover" aria-hidden="true">
                      <span>VISUAL.</span>
                      <ArrowRight size={32} />
                      <span>WORK.</span>
                    </div>
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
              </Link>
            ),
          )}
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
