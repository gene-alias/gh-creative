'use client';

import { useEffect } from 'react';
import { animate, inView, stagger } from 'motion';

/* Elements that rise into place the first time they scroll into view. Items that enter in the
   same frame are staggered together, so a row of cards reads top to bottom. */
const REVEAL_SELECTORS = [
  '.fr-head > *',
  '.fr-service',
  '.fr-work-card',
  '.fr-about > *',
  '.fr-process > :not(.fr-steps)',
  '.fr-steps > li',
  '.fr-hud > :not(.fr-corner)',
  '.mini-work-intro > *',
  '.mini-example > :is(.mini-index, h2)',
  '.mini-example-copy',
  '.mini-example figure',
  '.mini-case-section',
  '.mini-work-pending',
].join(', ');

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function FieldRecordMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const site = document.querySelector<HTMLElement>('.mini-site');
    if (!site) return;

    const items = Array.from(site.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const revealed = new WeakSet<Element>();
    let batch: HTMLElement[] = [];
    let frame = 0;

    const flush = () => {
      frame = 0;
      const entering = batch;
      batch = [];
      animate(
        entering,
        { opacity: [0, 1], y: [18, 0] },
        { duration: 0.5, ease: EASE_OUT, delay: stagger(0.07) },
      );
    };

    for (const item of items) {
      item.style.opacity = '0';
    }

    const stops = items.map((item) =>
      inView(
        item,
        (element) => {
          if (revealed.has(element)) return;
          revealed.add(element);
          batch.push(element as HTMLElement);
          if (!frame) frame = requestAnimationFrame(flush);
        },
        { margin: '0px 0px -8% 0px' },
      ),
    );

    /* The contact frame locks on: its red corner arms draw out from each corner. */
    const corners = Array.from(site.querySelectorAll<HTMLElement>('.fr-corner'));
    const hud = site.querySelector('.fr-hud');
    let stopHud: VoidFunction | undefined;
    if (hud && corners.length) {
      for (const corner of corners) corner.style.transform = 'scale(0.4)';
      stopHud = inView(
        hud,
        () => {
          animate(
            corners,
            { scale: [0.4, 1], opacity: [0, 1] },
            { type: 'spring', bounce: 0, visualDuration: 0.45, delay: 0.15 },
          );
          stopHud?.();
        },
        { amount: 0.4 },
      );
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      for (const stop of stops) stop();
      stopHud?.();
    };
  }, []);

  return null;
}
