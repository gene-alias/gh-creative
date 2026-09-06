'use client';

import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getOffersScrollDistances } from './offers-scroll-timing';
import type { PixelRevealRef } from '@/components/reactbits/pixel-reveal';

const PixelReveal = lazy(() => import('@/components/reactbits/pixel-reveal'));

class RevealFallback extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function ScrollCurtain({ section }: { section: HTMLElement }) {
  const reveal = useRef<PixelRevealRef>(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [colors] = useState(() => {
    const tokens = getComputedStyle(section);
    return {
      cover: tokens.getPropertyValue('--gh-surface-page').trim(),
      pixel: tokens.getPropertyValue('--gh-accent').trim(),
    };
  });
  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);

  useEffect(() => {
    if (!ready || unavailable) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        // Measure a stable ancestor, never the element that switches to fixed position.
        const region = section.parentElement;
        if (!region?.classList.contains('offers-scroll-region')) return;
        const marginTop = () => parseFloat(getComputedStyle(section).marginTop) || 0;
        const distances = () => getOffersScrollDistances(window.innerHeight, section.offsetHeight);
        const state = { progress: 0 };
        const tween = gsap.fromTo(state, { progress: 0 }, {
          progress: 1,
          ease: 'none',
          onUpdate: () => reveal.current?.setProgress(state.progress),
          scrollTrigger: {
            id: 'offers-pixel-reveal',
            trigger: region,
            start: () => `top+=${marginTop()} 25%`,
            end: () => '+=' + distances().reveal,
            refreshPriority: 20,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const pin = ScrollTrigger.create({
          id: 'offers-top-pin',
          trigger: region,
          start: () => `top+=${marginTop()} top`,
          end: () => '+=' + distances().pin,
          refreshPriority: 10,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
        cleanup = () => {
          pin.kill();
          tween.scrollTrigger?.kill();
          tween.kill();
        };
        // Refresh the work pin first, then these two triggers, then downstream headings.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        // Start at the actual scroll position, including restored/deep-linked visits.
        tween.progress(tween.scrollTrigger?.progress ?? 0);
        reveal.current?.setProgress(state.progress);
      })
      .catch(() => {
        cleanup?.();
        handleUnavailable();
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ready, unavailable, section, handleUnavailable]);

  if (unavailable) return null;
  return (
    <div
      className="offers-pixel-curtain"
      data-ready={ready || undefined}
      aria-hidden="true"
    >
      <PixelReveal
        ref={reveal}
        imageSrc=""
        revealContent
        coverColor={colors.cover || '#08080b'}
        transitionColor={colors.pixel || '#ff3f46'}
        width="100%"
        height="100%"
        gridSize={18}
        edgeHeight={0.18}
        direction="down"
        autoTrigger={false}
        onReady={handleReady}
        onUnavailable={handleUnavailable}
      />
    </div>
  );
}

export function PixelSectionTransition({ disabled }: { disabled: boolean }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  const [keyboardVisit, setKeyboardVisit] = useState(false);
  useEffect(() => {
    const parent = anchor.current?.parentElement;
    if (
      !parent ||
      disabled ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    setSection(parent);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          // Keep the pin spacer mounted after leaving, preventing scroll jumps.
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' },
    );
    const showFocusedContent = () => setKeyboardVisit(true);
    parent.addEventListener('focusin', showFocusedContent);
    observer.observe(parent);
    return () => {
      observer.disconnect();
      parent.removeEventListener('focusin', showFocusedContent);
    };
  }, [disabled]);

  return (
    <div ref={anchor} className="offers-pixel-anchor" aria-hidden="true">
      {!disabled && !keyboardVisit && near && section && (
        <RevealFallback>
          <Suspense fallback={null}>
            <ScrollCurtain section={section} />
          </Suspense>
        </RevealFallback>
      )}
    </div>
  );
}
