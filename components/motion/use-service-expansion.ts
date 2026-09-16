'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

type Alignment = { title: HTMLElement; fromTop: number; opening: boolean };

/** One local scroll owner: opens at the top, closes without losing the title. */
export function useServiceExpansion(
  root: RefObject<HTMLElement | null>,
  openServices: string[],
) {
  const pending = useRef<Alignment | null>(null);
  const cancelAlignment = useRef<() => void>(() => {});

  // Capture the clicked heading before React changes the layout. On a switch,
  // this is the new heading, even while the previous panel is still closing.
  const prepareChange = (next: string[]) => {
    cancelAlignment.current();
    const name = next[0] ?? openServices[0];
    const title = Array.from(root.current?.querySelectorAll<HTMLElement>('.service-trigger') ?? [])
      .find((trigger) => trigger.dataset.service === name);
    pending.current = title
      ? { title, fromTop: title.getBoundingClientRect().top, opening: next.length > 0 }
      : null;
  };

  useLayoutEffect(() => {
    const alignment = pending.current;
    pending.current = null;
    if (!alignment) return;
    const { title, fromTop, opening } = alignment;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inset = parseFloat(getComputedStyle(title).scrollMarginTop) || 16;
    const toTop = opening ? inset : fromTop;
    const started = performance.now();
    let frame = 0;
    let cancelled = false;

    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
    };
    cancelAlignment.current = stop;
    // A new interaction takes precedence over any unfinished automatic motion.
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', stop);

    const align = (now: number) => {
      if (cancelled || !title.isConnected) return;
      const progress = reduced ? 1 : Math.min(1, (now - started) / 400);
      const eased = 1 - Math.pow(1 - progress, 3);
      const desiredTop = fromTop + (toTop - fromTop) * eased;
      // Follow changing panel heights rather than scrolling to a stale offset.
      const delta = title.getBoundingClientRect().top - desiredTop;
      if (Math.abs(delta) > 0.5) {
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: 'instant' });
      }
      if (progress < 1) frame = requestAnimationFrame(align);
      else stop();
    };
    // Compensate layout changes before the first paint, including on collapse.
    align(started);
    return stop;
  }, [openServices]);

  return prepareChange;
}
