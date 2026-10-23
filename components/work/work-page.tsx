/* Static hosting uses document navigation; vinext Link requires a server router. */
/* oxlint-disable next/no-html-link-for-pages */
import Image from 'next/image';
import { ProjectBriefTrigger } from '@/components/project/project-brief';
import { MiniHeader, MiniFooter } from '@/components/mini/site-shell';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { WebsitePreview } from './website-preview';
import { WorkMarquee } from './work-marquee';

type WorkMedia = (
  | {
      type: 'image';
      src: string;
      width: number;
      height: number;
      alt: string;
      presentation?: 'cover';
      enlarge?: boolean;
    }
  | {
      type: 'video';
      src: string;
      poster: string;
      width: number;
      height: number;
      label: string;
    }
  | {
      type: 'audio';
      src: string;
      label: string;
    }
) & { caption?: string };

export type WorkExample = {
  id?: string;
  title: string;
  label: string;
  summary: string;
  media: WorkMedia[];
  sections?: { title: string; description: string; media: WorkMedia[] }[];
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
  mediaLayout?: 'stack' | 'marquee';
};

export function WorkPage(props: WorkPageProps) {
  return (
    <main className="mini-site mini-work-page" id="top">
      <MiniHeader />
      <a className="mini-work-back" href="/#work">
        <ArrowLeft size={16} aria-hidden="true" /> BACK TO SELECTED WORK
      </a>
      <section className="mini-work-intro">
        <p className="mini-index">
          <span>{`// ${props.number} · SELECTED WORK`}</span>
          <span>↗</span>
        </p>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </section>
      <div>
        {props.examples.length ? (
          props.examples.map((example, index) => (
            <article
              className="mini-example"
              id={example.id}
              key={example.title}
            >
              <p className="mini-index">
                {`// 0${index + 1} · ${example.label}`}
              </p>
              <h2>{example.title}</h2>
              <div className="mini-example-gallery">
                <div className="mini-example-copy">
                  <p>{example.summary}</p>
                  {example.brief ? (
                    <p>
                      <strong>Brief:</strong> {example.brief}
                    </p>
                  ) : null}
                  {example.approach ? (
                    <p>
                      <strong>Approach:</strong> {example.approach}
                    </p>
                  ) : null}
                  {example.outcome ? (
                    <p>
                      <strong>Outcome:</strong> {example.outcome}
                    </p>
                  ) : null}
                </div>
                {props.mediaLayout === 'marquee' ? (
                  <WorkMarquee label={example.title}>
                    {example.media.map((media) => (
                      <WorkFigure key={media.src} media={media} />
                    ))}
                  </WorkMarquee>
                ) : example.media.map((media) => (
                  <WorkFigure key={media.src} media={media} />
                ))}
                {example.sections?.map((section) => (
                  <section className="mini-case-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                    {section.media.map((media) => (
                      <WorkFigure key={media.src} media={media} />
                    ))}
                  </section>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="mini-work-pending">
            <span className="eyebrow">SELECTED WORK / COMING SOON</span>
            <p>
              {props.pendingMessage ??
                'Examples for this category are being prepared.'}
            </p>
          </div>
        )}
      </div>
      <div className="mini-work-inquiry">
        <ProjectBriefTrigger className="mini-button mini-button-primary">
          START A PROJECT <ArrowUpRight size={20} />
        </ProjectBriefTrigger>
      </div>
      <nav className="mini-work-links" aria-label="Explore work disciplines">
        <a href="/work/web-design">
          WEBSITES <ArrowUpRight size={16} />
        </a>
        <a href="/work/visual-design">
          VISUAL <ArrowUpRight size={16} />
        </a>
        <a href="/work/branding">
          BRANDING <ArrowUpRight size={16} />
        </a>
      </nav>
      <MiniFooter />
    </main>
  );
}

function WorkFigure({ media }: { media: WorkMedia }) {
  const picture =
    media.type === 'image' ? (
      <Image
        unoptimized
        className={
          media.presentation === 'cover'
            ? 'mini-example-image--cover'
            : undefined
        }
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes="(max-width: 480px) 90vw, 432px"
      />
    ) : null;
  return (
    <figure>
      {media.type === 'image' ? (
        media.enlarge ? (
          <a
            className="mini-artwork-link"
            href={media.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Enlarge: ${media.alt} (opens in a new tab)`}
          >
            {picture}
          </a>
        ) : (
          picture
        )
      ) : media.type === 'video' ? (
        <WebsitePreview
          src={media.src}
          poster={media.poster}
          width={media.width}
          height={media.height}
          label={media.label}
        />
      ) : (
        <div className="mini-audio">
          <p>{media.label}</p>
          {/* Audio examples may be non-speech music or sound design. */}
          {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            preload="none"
            src={media.src}
            aria-label={media.label}
          />
        </div>
      )}
      {media.caption ? <figcaption>{media.caption}</figcaption> : null}
    </figure>
  );
}
