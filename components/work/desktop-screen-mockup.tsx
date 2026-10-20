import Image from 'next/image';
import './desktop-screen-mockup.css';

const MOCKUP = {
  src: '/assets/work/gh-creative-monitor-mockup.png',
  width: 1152,
  height: 864,
} as const;

export function DesktopScreenMockup({
  caption,
  alt = '',
}: {
  caption?: string;
  alt?: string;
}) {
  return (
    <div className="monitor-mockup" aria-hidden={alt ? undefined : true}>
      <Image
        unoptimized
        src={MOCKUP.src}
        alt={alt}
        width={MOCKUP.width}
        height={MOCKUP.height}
        sizes="(min-width: 1024px) 340px, 90vw"
        draggable={false}
      />
      {caption ? <p className="monitor-mockup__caption">{caption}</p> : null}
    </div>
  );
}
