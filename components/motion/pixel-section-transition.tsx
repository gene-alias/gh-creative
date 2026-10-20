'use client';

import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { getOffersScrollDistances, offersRevealStart } from './offers-scroll-timing';
import type { PixelRevealRef } from '@/components/reactbits/pixel-reveal';

const PixelReveal = lazy(() => import('@/components/reactbits/pixel-reveal'));
const desktopQuery = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const subscribeDesktop = (notify: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

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
  const curtain = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [colors] = useState(() => {
    const tokens = getComputedStyle(section);
    const dark = tokens.getPropertyValue('--gh-surface-page').trim();
    return {
      cover: dark,
      pixel: tokens.backgroundColor,
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
        const update = () => {
          reveal.current?.setProgress(state.progress);
          // Remove the fully transparent, section-sized canvas from compositing.
          if (curtain.current) curtain.current.style.visibility = state.progress >= 1 ? 'hidden' : 'visible';
        };
        const tween = gsap.fromTo(state, { progress: 0 }, {
          progress: 1,
          ease: 'none',
          onUpdate: update,
          scrollTrigger: {
            id: 'offers-pixel-reveal',
            trigger: region,
            start: () => offersRevealStart(marginTop()),
            end: () => '+=' + distances().reveal,
            refreshPriority: 20,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
        // Measure the upstream work pin before the reveal and downstream headings.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        // Start at the actual scroll position, including restored/deep-linked visits.
        tween.progress(tween.scrollTrigger?.progress ?? 0);
        update();
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
      ref={curtain}
      className="offers-pixel-curtain"
      data-ready={ready || undefined}
      aria-hidden="true"
    >
      <PixelReveal
        ref={reveal}
        imageSrc=""
        revealContent
        coverColor={colors.cover || '#08080b'}
        transitionColor={colors.pixel || '#08080b'}
        width="100%"
        height="100%"
        gridSize={18}
        edgeHeight={0.18}
        direction="up"
        autoTrigger={false}
        onReady={handleReady}
        onUnavailable={handleUnavailable}
      />
    </div>
  );
}

export function PixelSectionTransition({ disabled }: { disabled: boolean }) {
  const desktop = useSyncExternalStore(subscribeDesktop,
    () => window.matchMedia(desktopQuery).matches, () => false);
  const anchor = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  const [keyboardVisit, setKeyboardVisit] = useState(false);
  useEffect(() => {
    const parent = anchor.current?.parentElement;
    if (
      !parent ||
      disabled || !desktop ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    setSection(parent);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          // Keep the reveal mounted so reverse scrolling uses the same progress.
          observer.disconnect();
        }
      },
      { rootMargin: '1000px 0px' },
    );
    const showFocusedContent = () => setKeyboardVisit(true);
    parent.addEventListener('focusin', showFocusedContent);
    observer.observe(parent);
    return () => {
      observer.disconnect();
      parent.removeEventListener('focusin', showFocusedContent);
    };
  }, [disabled, desktop]);

  return (
    <div ref={anchor} className="offers-pixel-anchor" aria-hidden="true">
      {desktop && !disabled && !keyboardVisit && near && section && (
        <RevealFallback>
          <Suspense fallback={null}>
            <ScrollCurtain section={section} />
          </Suspense>
        </RevealFallback>
      )}
    </div>
  );
}
