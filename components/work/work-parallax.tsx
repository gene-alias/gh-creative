'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function WorkParallax({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = root.current;
    if (!container) return;

    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          container.querySelectorAll<HTMLElement>('[data-parallax-shift]').forEach((element) => {
            const gallery = element.closest<HTMLElement>('.portfolio-gallery');
            if (!gallery) return;
            const shift = Number(element.dataset.parallaxShift) || 0;
            const distance = () => shift * (window.innerWidth < 768 ? 0.45 : 1);
            gsap.fromTo(element, { y: () => distance() / 2 }, {
              y: () => -distance() / 2,
              ease: 'none',
              scrollTrigger: {
                trigger: gallery,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });
        }, container);
        revert = () => context.revert();
        ScrollTrigger.refresh();
      },
    ).catch(() => {
      // The static editorial layout remains complete if motion is unavailable.
    });

    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  return <div className="portfolio-examples" ref={root}>{children}</div>;
}
