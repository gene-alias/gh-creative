'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Artwork = {
  id: string;
  category: string;
  title: string;
  alt: string;
  thumbnail: string;
  src: string;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
};
type Category = { id: string; label: string; count: number };

export function VisualArtGallery({
  artworks,
  categories,
  allWorkOrder,
}: {
  artworks: Artwork[];
  categories: Category[];
  allWorkOrder: string[];
}) {
  const gallery = useRef<HTMLElement>(null);
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(18);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Only the All Work view follows the curated mix; category views retain their order.
  const allWork = useMemo(() => {
    const rank = new Map(allWorkOrder.map((id, index) => [id, index]));
    return [...artworks].sort(
      (a, b) =>
        (rank.get(a.id) ?? allWorkOrder.length) -
        (rank.get(b.id) ?? allWorkOrder.length),
    );
  }, [artworks, allWorkOrder]);
  const filtered =
    category === 'all'
      ? allWork
      : artworks.filter((item) => item.category === category);
  const activeIndex = filtered.findIndex((item) => item.id === activeId);
  const active = filtered[activeIndex];
  const activeCategory = categories.find(
    (item) => item.id === active?.category,
  );
  const shown = filtered.slice(0, limit);

  function changeCategory(id: string) {
    setCategory(id);
    setLimit(18);
    gallery.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function move(direction: number) {
    if (filtered.length)
      setActiveId(
        filtered[(activeIndex + direction + filtered.length) % filtered.length]
          .id,
      );
  }

  return (
    <Dialog
      open={!!active}
      onOpenChange={(open) => {
        if (!open) setActiveId(null);
      }}
    >
      <section
        ref={gallery}
        className="mini-visual-gallery"
        aria-label="Visual work gallery"
      >
        <div className="mini-gallery-toolbar">
          <p className="mini-index">
            <span>{artworks.length} WORKS</span>
            <span>{categories.length} COLLECTIONS</span>
          </p>
          <fieldset className="mini-gallery-filters">
            <legend className="sr-only">Filter visual work by category</legend>
            <button
              type="button"
              aria-pressed={category === 'all'}
              onClick={() => changeCategory('all')}
            >
              All work <span>{artworks.length}</span>
            </button>
            {categories.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => changeCategory(item.id)}
              >
                {item.label} <span>{item.count}</span>
              </button>
            ))}
          </fieldset>
        </div>
        <output className="mini-gallery-result" aria-live="polite">
          {category === 'all'
            ? 'All work'
            : categories.find((item) => item.id === category)?.label}{' '}
          / {filtered.length} images
        </output>
        <div
          className="mini-gallery-grid"
          data-curated={category === 'all' ? 'true' : undefined}
        >
          {shown.map((item, index) => (
            <DialogTrigger
              key={item.id}
              render={
                <button
                  type="button"
                  className="mini-gallery-tile"
                  aria-label={`Open ${item.title}`}
                />
              }
              onClick={() => setActiveId(item.id)}
              aria-label={`Open ${item.title}`}
            >
              <Image
                unoptimized
                src={item.thumbnail}
                alt={item.alt}
                width={item.thumbnailWidth}
                height={item.thumbnailHeight}
                loading={index < 2 ? 'eager' : 'lazy'}
                sizes="(max-width: 480px) 44vw, 208px"
              />
              <span>
                {item.title} <ArrowUpRight size={12} aria-hidden="true" />
              </span>
            </DialogTrigger>
          ))}
        </div>
        {shown.length < filtered.length ? (
          <button
            type="button"
            className="mini-button mini-gallery-more"
            onClick={() => setLimit((value) => value + 18)}
          >
            VIEW MORE WORK <ArrowDown size={17} aria-hidden="true" />
          </button>
        ) : null}
        <p className="mini-gallery-count">
          Showing {shown.length} of {filtered.length} images
        </p>
      </section>
      <DialogContent
        className="visual-lightbox"
        showCloseButton={false}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }
        }}
      >
        {active ? (
          <>
            <div className="visual-lightbox-header">
              <div>
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription>{activeCategory?.label}</DialogDescription>
              </div>
              <DialogClose
                className="visual-lightbox-control"
                aria-label="Close image"
              >
                <X size={22} aria-hidden="true" />
              </DialogClose>
            </div>
            <div className="visual-lightbox-stage">
              <Image
                unoptimized
                key={active.id}
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="90vw"
              />
            </div>
            <div className="visual-lightbox-footer">
              <a href={active.src} target="_blank" rel="noreferrer">
                FULL IMAGE <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <div>
                <button
                  className="visual-lightbox-control"
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous image"
                >
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <span aria-live="polite">
                  {activeIndex + 1} / {filtered.length}
                </span>
                <button
                  className="visual-lightbox-control"
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next image"
                >
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
