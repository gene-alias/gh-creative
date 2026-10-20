import Image from 'next/image';
import Link from 'next/link';
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

const work = [
  {
    title: 'Digital experiences.',
    category: 'WEB DESIGN',
    href: '/work/web-design',
    image: '/assets/work/gh-creative-monitor-mockup.png',
    width: 1152,
    height: 864,
    alt: 'GH Creative website on a desktop monitor',
    treatment: 'web',
  },
  {
    title: 'A different perspective.',
    category: 'VISUAL DESIGN',
    href: '/work/visual-design',
    image: '/assets/hero-portrait.png',
    width: 780,
    height: 1122,
    alt: 'Red refraction portrait study',
    treatment: 'visual',
  },
  {
    title: 'Make your mark.',
    category: 'BRANDING',
    href: '/work/branding',
    image: '/assets/brand-direction.png',
    width: 1086,
    height: 1448,
    alt: 'GH Creative red wordmark and outline identity study',
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
          A few studio explorations. Tap to take a closer look.
        </p>
        <div className="mini-work-list">
          {work.map((item, index) => (
            <Link
              className={`mini-work-card mini-work-card--${item.treatment}`}
              href={item.href}
              key={item.href}
              prefetch={false}
            >
              <div className="mini-work-image">
                <Image
                  unoptimized
                  src={item.image}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  sizes="(max-width: 480px) 90vw, 432px"
                />
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
