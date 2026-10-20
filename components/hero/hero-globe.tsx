'use client';

import {
  Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import Image from 'next/image';
import { GLOBE_CONTROLS, type GlobeControls, type GlobeRuntime } from './globe-controls';
import './hero-globe.css';

const GlobeScene = lazy(() => import('./globe-scene'));

class GlobeBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroGlobe({ controls: overrides }: { controls?: Partial<GlobeControls> }) {
  const controls = useMemo(() => ({ ...GLOBE_CONTROLS, ...overrides }), [overrides]);
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [fallbackReady, setFallbackReady] = useState(false);
  const [layout, setLayout] = useState({ centerX: 200, centerY: 260, diameter: 280, copyTop: 440 });
  const runtime = useRef<GlobeRuntime>({
    scrollProgress: 0, active: false, reducedMotion: true,
    layout: { centerX: 200, centerY: 260, diameter: 280 }, invalidate: () => {},
  });
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false); }, []);

  useEffect(() => {
    const element = host.current;
    const hero = element?.closest<HTMLElement>('.hero');
    const title = hero?.querySelector<HTMLElement>('h1');
    const nav = hero?.querySelector<HTMLElement>('.nav');
    if (!element || !hero || !title || !nav) return;
    let disposed = false;
    const state = runtime.current;
    setMounted(true);
    // Layout offsets ignore the existing title's scroll transforms.
    const layoutTop = (node: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = node;
      while (current && current !== hero) { top += current.offsetTop; current = current.offsetParent as HTMLElement | null; }
      return top;
    };
    const measure = () => {
      const copyTop = layoutTop(title);
      const top = layoutTop(nav) + nav.offsetHeight + 8;
      const available = Math.max(0, copyTop - top - 20);
      const diameter = Math.max(0, Math.min(hero.clientWidth * 0.79, available * 0.86, 350));
      // Keep the globe optically centered in the gap between the header and
      // hero title, regardless of the title's responsive height.
      const centerY = top + available * 0.5;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const next = desktop
        ? { centerX: hero.clientWidth * 0.70, centerY: hero.clientHeight * 0.47,
          diameter: Math.min(hero.clientWidth * 0.40, hero.clientHeight * 0.65, 650), copyTop }
        : { centerX: hero.clientWidth / 2, centerY, diameter, copyTop };
      runtime.current.layout = next;
      runtime.current.invalidate();
      setLayout((previous) => Object.keys(next).every((key) => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(hero); resize.observe(title); resize.observe(nav);
    const copy = hero.querySelector('.hero-copy');
    if (copy) resize.observe(copy);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });

    let intersecting = false;
    const visibility = () => {
      runtime.current.active = intersecting && document.visibilityState === 'visible';
      runtime.current.invalidate();
    };
    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      }
      intersecting = visibleTargets.size > 0;
      visibility();
    });
    // Keep rendering while either the hero or its drifting globe is visible.
    // The hero also provides a stable wake-up target during initial measurement.
    observer.observe(hero);
    observer.observe(element.querySelector('.hero-globe-visibility') ?? element);
    document.addEventListener('visibilitychange', visibility);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      runtime.current.reducedMotion = preference.matches;
      runtime.current.invalidate();
    };
    syncPreference();
    preference.addEventListener('change', syncPreference);

    let cleanupScroll = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      // One absolute scroll owner. No accumulated explosion, delayed tween, or extra pin.
      const trigger = ScrollTrigger.create({
        id: 'hero-globe-expansion', trigger: hero,
        start: 'top top', end: () => '+=' + hero.offsetHeight * 0.9,
        refreshPriority: -6, invalidateOnRefresh: true,
        onUpdate: (self) => {
          element.style.setProperty('--globe-parallax-y', `${self.progress * hero.offsetHeight * 0.9 * 0.2}px`);
          runtime.current.scrollProgress = self.progress;
          runtime.current.invalidate();
        },
        onRefresh: (self) => {
          element.style.setProperty('--globe-parallax-y', `${self.progress * hero.offsetHeight * 0.9 * 0.2}px`);
          runtime.current.scrollProgress = self.progress;
          runtime.current.invalidate();
        },
      });
      runtime.current.scrollProgress = trigger.progress;
      runtime.current.invalidate();
      cleanupScroll = () => {
        trigger.kill();
        element.style.removeProperty('--globe-parallax-y');
      };
    }).catch(() => { /* The globe still rotates without scroll enhancement. */ });

    return () => {
      disposed = true;
      state.active = false;
      cleanupScroll(); resize.disconnect(); observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', syncPreference);
    };
  }, []);

  const style = {
    '--globe-x': `${layout.centerX}px`, '--globe-y': `${layout.centerY}px`,
    '--globe-diameter': `${layout.diameter}px`, '--globe-copy-top': `${layout.copyTop}px`,
  } as CSSProperties;

  return (
    <div className="hero-globe" ref={host} style={style} aria-hidden="true" data-ready={ready || undefined}
      data-unavailable={unavailable || undefined} data-fallback-ready={fallbackReady || undefined}>
      <div className="hero-globe-fallback" aria-hidden="true">
        <Image unoptimized src="/assets/earth/earth-fallback.svg" width={400} height={400} alt="" onLoad={() => setFallbackReady(true)} />
      </div>
      <div className="hero-globe-canvas">
        {mounted && !unavailable && (
          <GlobeBoundary onUnavailable={onUnavailable}>
            <Suspense fallback={null}>
              <GlobeScene runtime={runtime} controls={controls} onReady={onReady} onUnavailable={onUnavailable} />
            </Suspense>
          </GlobeBoundary>
        )}
      </div>
      <div className="hero-globe-visibility" aria-hidden="true" />
    </div>
  );
}
