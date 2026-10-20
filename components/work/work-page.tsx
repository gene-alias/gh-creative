import Image from 'next/image';
import Link from 'next/link';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { WorkParallax } from './work-parallax';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

type WorkMedia = ({
  type: 'image';
  src: string;
  width: number;
  height: number;
  alt: string;
} | {
  type: 'audio';
  src: string;
  label: string;
}) & { caption?: string };

export type WorkExample = {
  title: string;
  label: string;
  summary: string;
  media: WorkMedia[];
  brief?: string;
  approach?: string;
  outcome?: string;
};

type WorkPageProps = {
  title: string;
  number: string;
  description: string;
  examples: WorkExample[];
  pendingMessage?: string;
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
        <WorkParallax>
          <p className="eyebrow portfolio-examples__heading">CASE STUDIES / WORK EXAMPLES</p>
          {props.examples.length ? props.examples.map((example, index) => (
            <article className="portfolio-example" key={example.title}>
              <p className="meta portfolio-example__index">0{index + 1} / {example.label}</p>
              <h2>{example.title}</h2>
              <div className="portfolio-gallery">
                <div className="portfolio-gallery__copy" data-parallax-shift="88">
                  <p className="portfolio-example__summary">{example.summary}</p>
                  {example.brief ? <p><strong>Brief:</strong> {example.brief}</p> : null}
                  {example.approach ? <p><strong>Approach:</strong> {example.approach}</p> : null}
                  {example.outcome ? <p><strong>Outcome:</strong> {example.outcome}</p> : null}
                </div>
                {example.media.map((media, mediaIndex) => (
                  <figure
                    className={`portfolio-gallery__frame portfolio-gallery__frame--${mediaIndex % 3}`}
                    data-parallax-shift={[160, 250, 110][mediaIndex % 3]}
                    key={media.src}
                  >
                    {media.type === 'image' ? (
                      <Image
                        unoptimized
                        src={media.src}
                        alt={media.alt}
                        width={media.width}
                        height={media.height}
                        sizes="(min-width: 1024px) 65vw, 90vw"
                      />
                    ) : (
                      <div className="portfolio-audio">
                        <p>{media.label}</p>
                        {/* Audio examples may be non-speech music or sound design. */}
                        {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
                        <audio controls preload="none" src={media.src} aria-label={media.label} />
                      </div>
                    )}
                    {media.caption ? <figcaption>{media.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </article>
          )) : (
            <div className="portfolio-feature portfolio-feature--pending">
              <span className="eyebrow">SELECTED WORK / COMING SOON</span>
              <p>{props.pendingMessage ?? 'Examples for this category are being prepared.'}</p>
            </div>
          )}
        </WorkParallax>
        <ProjectBriefTrigger className="button primary">
          START A PROJECT <ArrowUpRight size={20} />
        </ProjectBriefTrigger>
      </section>
      <nav className="portfolio-links" aria-label="Explore work disciplines">
        <Link href="/work/web-design">WEB DESIGN <ArrowUpRight size={16} /></Link>
        <Link href="/work/visual-design">VISUAL DESIGN <ArrowUpRight size={16} /></Link>
        <Link href="/work/marketing">MARKETING <ArrowUpRight size={16} /></Link>
        <Link href="/work/audio">AUDIO <ArrowUpRight size={16} /></Link>
        <Link href="/work/branding">BRANDING <ArrowUpRight size={16} /></Link>
      </nav>
    </main>
  );
}
