import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

type WorkPageProps = {
  title: string;
  number: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  caption: string;
};

export function WorkPage(props: WorkPageProps) {
  return (
    <main className="mobile-site portfolio-page">
      <header className="portfolio-nav">
        <Link className="wordmark" href="/">GH CREATIVE</Link>
        <Link className="text-link" href="/#work"><ArrowLeft size={16} /> ALL WORK</Link>
      </header>
      <section className="section portfolio-intro">
        <p className="eyebrow section-index">
          <span>{props.number} / SELECTED WORK</span><span>↗</span>
        </p>
        <h1>{props.title}</h1>
        <p className="body-copy">{props.description}</p>
        <figure className="portfolio-feature">
          <Image
            unoptimized
            src={props.image}
            alt={props.imageAlt}
            width={props.imageWidth}
            height={props.imageHeight}
          />
          <figcaption>
            <span className="meta">GH CREATIVE / STUDIO EXPLORATION</span>
            <p>{props.caption}</p>
          </figcaption>
        </figure>
        <Link className="button primary" href="/#contact">
          START A PROJECT <ArrowUpRight size={20} />
        </Link>
      </section>
      <nav className="portfolio-links" aria-label="Explore work disciplines">
        <Link href="/work/web-design">WEB DESIGN <ArrowUpRight size={16} /></Link>
        <Link href="/work/visual-design">VISUAL DESIGN <ArrowUpRight size={16} /></Link>
        <Link href="/work/branding">BRANDING <ArrowUpRight size={16} /></Link>
      </nav>
    </main>
  );
}
