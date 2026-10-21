'use client';

/* Carousel slides use ARIA groups rather than form-related elements. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role */

import { Children, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

/** Free dragging keeps swipe momentum before the steady marquee resumes. */
export function WorkMarquee({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const slides = Children.toArray(children);
  const [autoScroll] = useState(() =>
    AutoScroll({
      speed: 0.55,
      startDelay: 350,
      playOnInit: false,
      stopOnInteraction: true,
      stopOnFocusIn: true,
    }),
  );
  const [viewportRef, api] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: 'start',
    },
    [autoScroll],
  );
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const viewport = api.rootNode();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let dragging = false;
    let focused = viewport.contains(document.activeElement);
    const sync = () => {
      if (
        visible &&
        !document.hidden &&
        !motion.matches &&
        !paused &&
        !dragging &&
        !focused
      ) {
        autoScroll.play();
      } else {
        autoScroll.stop();
      }
    };
    const onMotion = () => {
      setReducedMotion(motion.matches);
      sync();
    };
    const onDown = () => {
      dragging = true;
      autoScroll.stop();
    };
    // Let Embla finish its natural swipe inertia; settle resumes the marquee.
    const onUp = () => {
      dragging = false;
    };
    const onFocus = () => {
      focused = true;
      autoScroll.stop();
    };
    const onBlur = (event: FocusEvent) => {
      focused = viewport.contains(event.relatedTarget as Node | null);
      sync();
    };
    const onSelect = () => setSelected(api.selectedScrollSnap());
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(viewport);
    onMotion();
    onSelect();
    api
      .on('pointerDown', onDown)
      .on('pointerUp', onUp)
      .on('settle', sync)
      .on('select', onSelect)
      .on('reInit', sync);
    viewport.addEventListener('focusin', onFocus);
    viewport.addEventListener('focusout', onBlur);
    motion.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', sync);
    return () => {
      autoScroll.stop();
      observer.disconnect();
      api
        .off('pointerDown', onDown)
        .off('pointerUp', onUp)
        .off('settle', sync)
        .off('select', onSelect)
        .off('reInit', sync);
      viewport.removeEventListener('focusin', onFocus);
      viewport.removeEventListener('focusout', onBlur);
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [api, autoScroll, paused]);

  const step = (direction: 'prev' | 'next') => {
    autoScroll.stop();
    if (direction === 'prev') api?.scrollPrev(reducedMotion);
    else api?.scrollNext(reducedMotion);
  };

  return (
    <section
      className="mini-work-marquee"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="mini-marquee-viewport" ref={viewportRef}>
        <div className="mini-marquee-track">
          {slides.map((slide, index) => (
            <div
              className="mini-marquee-slide"
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="mini-marquee-controls">
        <span className="mini-marquee-count" aria-live="off">
          {String(selected + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
          <small>SWIPE OR DRAG</small>
        </span>
        <button
          type="button"
          onClick={() => step('prev')}
          aria-label={`Previous ${label} artwork`}
        >
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled={reducedMotion}
          onClick={() => setPaused((value) => !value)}
          aria-label={
            reducedMotion
              ? `Automatic motion disabled for ${label}`
              : `${paused ? 'Play' : 'Pause'} ${label} marquee`
          }
        >
          {paused || reducedMotion ? (
            <Play size={15} aria-hidden="true" />
          ) : (
            <Pause size={15} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => step('next')}
          aria-label={`Next ${label} artwork`}
        >
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
