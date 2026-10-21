import Image from 'next/image';
import { visualCoverFrames, type WorkCoverItem } from '@/lib/work-covers';

export function WorkCover({
  item,
  caption = false,
}: {
  item: WorkCoverItem;
  caption?: boolean;
}) {
  return (
    <div className={`work-cover work-cover--${item.treatment}`}>
      {item.treatment === 'visual' ? (
        visualCoverFrames.map((frame, index) => (
          <Image
            className="work-cover__frame"
            style={{ animationDelay: `${index * 2 - 10.2}s` }}
            key={frame.src}
            unoptimized
            src={frame.src}
            width={frame.width}
            height={frame.height}
            alt={index === 0 ? item.alt : ''}
            sizes="(min-width: 1024px) 560px, 90vw"
            draggable={false}
          />
        ))
      ) : (
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={item.still}
          />
          <Image
            unoptimized
            src={item.image}
            width={item.width}
            height={item.height}
            alt={item.alt}
            sizes="(min-width: 1024px) 560px, 90vw"
            draggable={false}
          />
        </picture>
      )}
      {caption ? (
        <div className="work-cover__caption" aria-hidden="true">
          <strong>{item.category}</strong>
          <span>{item.description}</span>
        </div>
      ) : null}
    </div>
  );
}
