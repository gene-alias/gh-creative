'use client';
import { useState } from 'react';
import Image from 'next/image';

export type VisualArtPair = {
  title: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  width: number;
  height: number;
};
export function VisualArtGallery({ pairs }: { pairs: VisualArtPair[] }) {
  if (!pairs.length)
    return (
      <div className="mini-work-pending">
        <p>Selected artwork will appear here.</p>
      </div>
    );
  return (
    <div>
      {pairs.map((pair) => (
        <BeforeAfter key={pair.title} pair={pair} />
      ))}
    </div>
  );
}
function BeforeAfter({ pair }: { pair: VisualArtPair }) {
  const [reveal, setReveal] = useState(50);
  return (
    <article className="mini-example">
      <h2>{pair.title}</h2>
      <div
        className="mini-comparison"
        style={{ aspectRatio: `${pair.width}/${pair.height}` }}
      >
        <Image
          unoptimized
          src={pair.before}
          alt={pair.beforeAlt}
          width={pair.width}
          height={pair.height}
          sizes="(max-width:480px) 90vw,432px"
        />
        <div
          className="mini-comparison-after"
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Image
            unoptimized
            src={pair.after}
            alt={pair.afterAlt}
            width={pair.width}
            height={pair.height}
            sizes="(max-width:480px) 90vw,432px"
          />
        </div>
        <div
          className="mini-comparison-line"
          style={{ left: `${reveal}%` }}
          aria-hidden="true"
        />
      </div>
      <label className="mini-comparison-control">
        Before / After
        <input
          type="range"
          min={0}
          max={100}
          value={reveal}
          aria-label={`Reveal after image for ${pair.title}`}
          onChange={(event) => setReveal(Number(event.target.value))}
        />
        <span>Drag to compare</span>
      </label>
    </article>
  );
}
