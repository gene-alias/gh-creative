'use client';
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { getHeadingLineState } from './heading-scroll-timing';
import { getHeroLineScrollMotion } from './hero-scroll-timing';
import { viewportNeedsRefresh } from './scroll-layout';
import { REVEAL_START, REVEAL_END, REVEAL_VIEWPORT_FRACTION } from './reveal-timing';

export function useScrollMotion(
  root: RefObject<HTMLElement | null>,
  paused: boolean,
) {
  const [reduced, setReduced] = useState(false);
  const entrancePlayed = useRef(false);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element || paused || entrancePlayed.current || window.scrollY >= 80 ||
      window.location.hash || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.setAttribute('data-hero-entrance', 'pending');
    return () => { element.removeAttribute('data-hero-entrance'); };
  }, [root, paused, reduced]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    const sync = () => setReduced(preference.matches || desktop.matches);
    sync();
    preference.addEventListener('change', sync);
    desktop.addEventListener('change', sync);
    return () => {
      preference.removeEventListener('change', sync);
      desktop.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (
      !element ||
      paused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    let disposed = false;
    let release: (() => void) | undefined;
    // Load motion after hydration; the unenhanced page remains fully readable.
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        // Browser chrome opening/closing must not recalculate pins mid-swipe.
        ScrollTrigger.config({ ignoreMobileResize: true });
        const media = gsap.matchMedia();
        release = () => media.revert();
        media.add(
          '(prefers-reduced-motion: no-preference)',
          () => {
            element.dataset.motion = 'active';
            const select = (selector: string) =>
              Array.from(element.querySelectorAll<HTMLElement>(selector));
            const settings = getComputedStyle(element);
            const value = (name: string) =>
              parseFloat(settings.getPropertyValue('--gh-scroll-' + name));
            element.removeAttribute('data-hero-entrance');
            const hero = select('.hero')[0];
            const touchDevice = window.matchMedia('(pointer: coarse)').matches;
            const desktopLayout = window.matchMedia('(min-width: 1024px)').matches;
            // Animate children for entrance; their parent owns scroll parallax.
            // Re-enabling motion never replays or hides the loaded hero.
            let stopEntrance = () => {};
            if (
              !entrancePlayed.current &&
              window.scrollY < 80 &&
              !window.location.hash
            ) {
              entrancePlayed.current = true;
              const intro = gsap.timeline({
                paused: true,
                defaults: { duration: 0.45, ease: 'power3.out' },
              });
              intro.from(select('.hero .nav'), { opacity: 0, y: -12 }, 0.7);
              const titleTargets = desktopLayout
                ? select('.hero-title-glow .staggered-text__seg')
                : select('.hero-line-reveal');
              const titleDuration = desktopLayout ? 0.85 : 0.5;
              const titleStagger = desktopLayout ? 0.035 : 0.16;
              const supportStart = 1.15 + titleDuration + Math.max(0, titleTargets.length - 1) * titleStagger;
              intro
                .from(titleTargets,
                  { opacity: 0, y: 24, stagger: titleStagger, duration: titleDuration }, 1.15)
                .from(select('.hero-services-reveal'), { opacity: 0, y: 12 }, supportStart)
                .from(select('.hero-subheading'), { opacity: 0, y: 12 }, supportStart)
                .from(select('.hero-support > .button'), { opacity: 0, y: 16 }, supportStart + 0.45)
                .from(select('.hero-footer > *'), { opacity: 0, y: 8 }, supportStart + 0.9);
              // The globe fades for 700ms after its first complete rendered frame.
              // Observe its state so lazy-loading time cannot reorder the entrance.
              const globe = hero.querySelector('.hero-globe');
              let started = false;
              const start = () => {
                if (started) return;
                started = true;
                intro.play();
              };
              const checkReady = () => {
                if (!globe || globe.hasAttribute('data-ready') ||
                  (globe.hasAttribute('data-unavailable') && globe.hasAttribute('data-fallback-ready'))) start();
              };
              const globeObserver = new MutationObserver(checkReady);
              if (globe) globeObserver.observe(globe, { attributes: true,
                attributeFilter: ['data-ready', 'data-unavailable', 'data-fallback-ready'] });
              checkReady();
              // Keep navigation available even if graphics never initialise.
              const fallbackTimer = window.setTimeout(start, 5000);
              // Scrolling or keyboard interaction immediately reveals the controls.
              const finish = () => {
                started = true;
                intro.progress(1);
              };
              window.addEventListener('scroll', finish, {
                passive: true,
                once: true,
              });
              element.addEventListener('focusin', finish, { once: true });
              stopEntrance = () => {
                globeObserver.disconnect();
                window.clearTimeout(fallbackTimer);
                window.removeEventListener('scroll', finish);
                element.removeEventListener('focusin', finish);
              };
              intro.eventCallback('onComplete', stopEntrance);
            }
            // Desktop shares the entrance, with continuous native scrolling.
            if (desktopLayout) {
              element.dataset.motion = 'desktop';
              gsap.fromTo(select('.studio-desktop-portrait'),
                { x: 80, opacity: 0 },
                {
                  x: 0, opacity: 1, duration: 1.2, ease: 'power2.out',
                  scrollTrigger: {
                    trigger: select('.studio-desktop-portrait')[0],
                    start: REVEAL_START,
                    once: true,
                    refreshPriority: -20,
                  },
                });
              gsap.fromTo(select('.particle-layer--middle .planet-drift'), { y: 0 }, {
                y: () => -Math.min(window.innerHeight * 1.5,
                  Math.max(0, element.scrollHeight - window.innerHeight) * 0.18),
                ease: 'none',
                scrollTrigger: {
                  trigger: element, start: 'top top', end: 'bottom bottom',
                  scrub: 0.8, invalidateOnRefresh: true, refreshPriority: -20,
                },
              });
              gsap.fromTo(select('.services-globe'),
                { xPercent: 22, opacity: 0, rotation: -10 },
                { xPercent: 0, opacity: 0.32, rotation: 8, ease: 'none',
                  scrollTrigger: {
                    trigger: select('#services')[0], start: 'top bottom', end: 'top 25%',
                    scrub: 0.8, invalidateOnRefresh: true,
                  },
                });
              gsap.fromTo(select('.services-globe'), { y: 0 }, {
                y: () => select('#services')[0].offsetHeight * 0.55,
                ease: 'none',
                scrollTrigger: {
                  trigger: select('#services')[0], start: 'top top', end: 'bottom top',
                  scrub: 0.6, invalidateOnRefresh: true,
                },
              });
              return () => {
                stopEntrance();
                delete element.dataset.motion;
              };
            }
            const floatingCleanup: (() => void)[] = [];
            // One star field tracks the whole page so parallax never restarts.
            const scene = select('.depth-scene')[0];
            if (scene) {
              const camera = scene.querySelector('.depth-camera');
              const depth = gsap.timeline({
                scrollTrigger: {
                  trigger: element,
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: 0.85,
                  invalidateOnRefresh: true,
                  refreshPriority: -5,
                },
              });
              depth.fromTo(camera,
                { z: touchDevice ? 0 : -80, yPercent: 6, rotationX: touchDevice ? 0 : 4, rotationY: touchDevice ? 0 : -6 },
                { z: touchDevice ? 0 : 220, yPercent: -16, rotationX: touchDevice ? 0 : -4, rotationY: touchDevice ? 0 : 6, ease: 'none', duration: 1 }, 0);
              ['far', 'middle', 'near'].forEach((layer, layerIndex) => {
                const distance = [-500, -180, 80][layerIndex];
                depth.fromTo(scene.querySelector('.particle-layer--' + layer),
                  { z: touchDevice ? 0 : distance, yPercent: 8 + layerIndex * 8, xPercent: -layerIndex * 3 },
                  {
                    z: touchDevice ? 0 : distance + 80 + layerIndex * 50,
                    yPercent: -(18 + layerIndex * 22),
                    xPercent: layerIndex * 5,
                    ease: 'none', duration: 1,
                  }, 0);
                // Planets travel independently on top of each star layer's
                // motion, making their foreground parallax visibly faster.
                depth.fromTo(scene.querySelector('.particle-layer--' + layer + ' .planet-drift'),
                  { yPercent: 0 },
                  { yPercent: -(40 + layerIndex * 20), ease: 'none', duration: 1 }, 0);
              });
            }
            // Float the interactive content as a single surface so accordion
            // measurements and focus targets stay aligned while its height changes.
            select('#services .services').forEach((surface, index) => {
              const float = gsap.fromTo(surface,
              { y: 16, z: touchDevice ? 0 : -20 },
                {
                  y: -12, z: 0,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: surface.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.7 + index * 0.1,
                    invalidateOnRefresh: true,
                  },
                });
              // Native focus remains immediate even while scroll is catching up.
              const settle = () => { float.scrollTrigger?.getTween()?.progress(1); };
              surface.addEventListener('focusin', settle);
              floatingCleanup.push(() => surface.removeEventListener('focusin', settle));
            });
            const shimmer = gsap.fromTo(
              select('.hero .cta-shimmer'),
              { xPercent: -45 },
              {
                xPercent: 110,
                duration: 3,
                repeat: -1,
                repeatDelay: 37,
                ease: 'none',
                paused: true,
              },
            );
            const shimmerVisibility = ScrollTrigger.create({
              trigger: hero,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: (self) => {
                shimmer.paused(!self.isActive);
              },
              onRefresh: (self) => {
                shimmer.paused(!self.isActive);
              },
            });
            // Begin the visible light pass immediately, without waiting for scroll.
            shimmer.paused(!shimmerVisibility.isActive);
            gsap.to(select('.hero-copy'), {
              y: -85,
              z: touchDevice ? 0 : -20,
              rotationX: 0,
              transformPerspective: touchDevice ? 0 : 1100,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: value('scrub'),
              },
            });
            // Keep the entrance on the inner span and scrub a known 1 → 0
            // opacity on its parent, so scrolling back always restores it.
            gsap.fromTo(
              select('.hero-services'),
              { opacity: 1 },
              {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: '+=180',
                  scrub: value('scrub'),
                },
              },
            );
            // Separate layers keep entrance and scroll transforms independent.
            // Finish the title travel within the first screenful of scrolling.
            select('.hero-line').forEach((line, index) => {
              gsap.to(line, {
                x: () => getHeroLineScrollMotion(index, hero.offsetWidth).x,
                y: () => getHeroLineScrollMotion(index, hero.offsetWidth).y,
                scale: getHeroLineScrollMotion(index, hero.offsetWidth).scale,
                transformOrigin: 'right center',
                ease: 'none',
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: () =>
                    '+=' +
                    Math.max(320, Math.min(560, window.innerHeight * 0.65)),
                  scrub: 0.3,
                  invalidateOnRefresh: true,
                },
              });
            });
            const work = select('#work')[0];
            const stage = select('.work-stack')[0];
            const panels = select('.work-panel');
            const workEntrances = new Map<HTMLElement, gsap.core.Timeline>();
            // Each card enters, holds, then floats off into the star field.
            panels.forEach((panel, index) => {
              const fromLeft = index % 2 === 0;
              const drift = gsap.timeline({
                scrollTrigger: {
                  trigger: panel,
                  start: REVEAL_START,
                  end: 'bottom top',
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              });
              drift.fromTo(
                panel,
                {
                  y: 48,
                  xPercent: fromLeft ? -5 : 5,
                  z: touchDevice ? 0 : -80,
                  rotationY: touchDevice ? 0 : fromLeft ? 8 : -8,
                  rotationX: touchDevice ? 0 : 6,
                  opacity: 0,
                },
                {
                  y: 0,
                  xPercent: 0,
                  z: 0,
                  rotationY: 0,
                  rotationX: 0,
                  opacity: 1,
                  duration: 0.18,
                  ease: 'none',
                },
              );
              drift.to({}, { duration: 0.62 });
              drift.to(panel, {
                y: -150,
                xPercent: fromLeft ? -16 : 16,
                z: touchDevice ? 0 : 50,
                rotationX: touchDevice ? 0 : -8,
                rotationY: touchDevice ? 0 : fromLeft ? -10 : 10,
                scale: 0.94,
                opacity: 0,
                duration: 0.2,
                ease: 'none',
              });
              workEntrances.set(panel, drift);
              const image = panel.querySelector<HTMLImageElement>(':scope > img');
              if (image) {
                const travel = [5, 7, 6][index] ?? 6;
                const direction = fromLeft ? 1 : -1;
                const scale = index === 0 ? 1.08 : 1.18;
                const rotation = panel.classList.contains('work-panel--web') ? -7 : 0;
                gsap.fromTo(
                  image,
                  { yPercent: travel * direction, scale, rotation },
                  {
                    yPercent: -travel * direction,
                    scale,
                    rotation,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: panel,
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: 0.45,
                    },
                  },
                );
              }
            });
            gsap.fromTo(
              select('.project-meter span'),
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: stage,
                  start: 'top 85%',
                  end: 'bottom 45%',
                  scrub: true,
                },
              },
            );
            // Keyboard navigation must not land on a panel still off screen.
            const revealFocusedWork = (event: FocusEvent) => {
              const focusedPanel = event.target instanceof Element
                ? event.target.closest<HTMLElement>('.work-panel') : null;
              // Land on the readable hold, not the floated-away end of the scrub.
              if (focusedPanel) workEntrances.get(focusedPanel)?.progress(0.4).pause();
            };
            work.addEventListener('focusin', revealFocusedWork);
            if (window.location.hash === '#work') {
              workEntrances.forEach((entrance) => entrance.progress(0.4).pause());
            }
            // Contact copy fades in as it enters. The section still pins at the
            // top. Offers keeps its pixel reveal as a pin owner.
            const contentFocusCleanup: (() => void)[] = [];
            // The interactive services section stays in normal flow. Its size
            // changes must never remove or recreate the surrounding page pins.
            ['contact'].forEach((id, index) => {
              const section = select('#' + id)[0];
              if (!section) return;
              // Reveal text only; bordered rows, forms and controls stay visible.
              const content = Array.from(section.querySelectorAll(
                ':scope > .body-copy, [data-content-reveal]',
              ));
              const pin = touchDevice ? undefined : ScrollTrigger.create({
                id: id + '-content-pin',
                refreshPriority: [5, 4][index],
                trigger: section,
                start: 'top top',
                end: () => '+=' + Math.max(240, window.innerHeight * 0.45),
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              });
              const reveal = gsap.fromTo(content, { opacity: 0 }, {
                opacity: 1,
                stagger: 0.08,
                ease: 'none',
                scrollTrigger: {
                  id: id + '-copy-reveal',
                  trigger: content[0] ?? section,
                  start: REVEAL_START,
                  end: REVEAL_END,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              });
              // Tabbing to native controls finishes the reveal before focus lands.
              const revealOnFocus = () => {
                if (reveal.progress() < 1) {
                  if (pin) {
                    window.scrollTo({ top: pin.end, behavior: 'instant' });
                    ScrollTrigger.update();
                  } else {
                    reveal.progress(1);
                  }
                }
              };
              section.addEventListener('focusin', revealOnFocus);
              contentFocusCleanup.push(() => section.removeEventListener('focusin', revealOnFocus));
            });
            // Process and service cards follow the same lower-third entry rule.
            select('.offer, .services [data-slot="accordion-item"]').forEach((card) => {
              const reveal = gsap.fromTo(card, { y: 24, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
                scrollTrigger: {
                  trigger: card, start: REVEAL_START, end: 'bottom top',
                  toggleActions: 'play none none reverse',
                },
              });
              const revealOnFocus = () => { reveal.progress(1).pause(); };
              card.addEventListener('focusin', revealOnFocus);
              contentFocusCleanup.push(() => card.removeEventListener('focusin', revealOnFocus));
            });
            const pricingTrack = select('.pricing-track')[0];
            // Pricing is a click-through carousel. Keep a short content reveal only.
            select('.pricing-intro, .pricing-menu, .pricing-track, .pricing-controls').forEach((block) => {
              const isMenu = block.classList.contains('pricing-menu');
              const targets = isMenu ? Array.from(block.querySelectorAll('button')) : block;
              const reveal = gsap.fromTo(targets, {
                x: block.classList.contains('pricing-track') || isMenu ? 0 : -20,
                y: block.classList.contains('pricing-track') ? 0 : isMenu ? 20 : 12,
                opacity: 0,
              }, {
                x: 0,
                y: 0,
                opacity: 1,
                stagger: isMenu ? 0.08 : 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: block,
                  start: REVEAL_START,
                  end: 'bottom top',
                  toggleActions: 'play reverse play reverse',
                },
              });
              // Keyboard users can reach carousel controls before an entrance
              // completes. Reveal them immediately without moving the page.
              const revealOnFocus = () => { reveal.progress(1).pause(); };
              block.addEventListener('focusin', revealOnFocus);
              contentFocusCleanup.push(() => block.removeEventListener('focusin', revealOnFocus));
            });
            select('.section h2').forEach((heading: HTMLElement) => {
              const section = heading.closest<HTMLElement>('.section');
              const lines = Array.from(heading.querySelectorAll<HTMLElement>('.section-title-reveal'));
              if (!section || !lines.length) return;
              if (touchDevice) {
                // A finite entrance avoids rewriting every title transform on
                // every scroll frame on iOS. Keep the same lower-third trigger.
                const sideways = section.id === 'work' || section.id === 'services';
                const entrance = gsap.fromTo(lines, {
                  x: (index: number) => sideways ? (index % 2 === 0 ? -32 : 32) : 0,
                  y: sideways ? 0 : 24,
                  opacity: 0,
                }, {
                  x: 0, y: 0, opacity: 1,
                  duration: 0.95, stagger: 0.12, ease: 'power2.out',
                  scrollTrigger: {
                    trigger: heading, start: REVEAL_START,
                    toggleActions: 'play none none none', once: true,
                  },
                });
                const revealOnFocus = () => { entrance.progress(1).pause(); };
                section.addEventListener('focusin', revealOnFocus);
                contentFocusCleanup.push(() => section.removeEventListener('focusin', revealOnFocus));
                return;
              }
              const pinId = section.id === 'offers' ? 'offers-top-pin'
                : section.id + '-content-pin';
              // Capture original styles in the GSAP context for pause/reduced-motion cleanup.
              gsap.set(lines, { xPercent: 0, yPercent: 0, opacity: 1, rotation: 0 });
              const setters = lines.map((line) => ({
                y: gsap.quickSetter(line, 'yPercent'),
                x: gsap.quickSetter(line, 'xPercent'),
                opacity: gsap.quickSetter(line, 'opacity'),
              }));
              let lineTops: number[] = [];
              const measure = () => {
                const pin = ScrollTrigger.getById(pinId);
                const sectionTop = section.getBoundingClientRect().top;
                const naturalSectionTop = pin ? pin.start : sectionTop + window.scrollY;
                // Measure unmoving masks, never the transformed text or a pin spacer.
                lineTops = lines.map((line) => naturalSectionTop
                  + line.parentElement!.getBoundingClientRect().top - sectionTop);
                return pin;
              };
              const render = (scroll: number) => {
                const pin = ScrollTrigger.getById(pinId);
                setters.forEach((setter, index) => {
                  const state = getHeadingLineState(scroll, window.innerHeight, lineTops[index], pin);
                  if (section.id === 'work' || section.id === 'services') {
                    // Split the work title into a restrained editorial entrance.
                    const entrance = Math.min(1, Math.max(0, 1 - Math.max(0, state.yPercent) / 105));
                    setter.y(0);
                    setter.x((index % 2 === 0 ? -1 : 1) * 100 * (1 - entrance));
                  } else {
                    setter.y(state.yPercent);
                    setter.x(0);
                  }
                  setter.opacity(state.opacity);
                });
              };
              // One scroll owner per title. Subtract the actual pin duration so
              // entry, hold and exit cannot overwrite or prematurely hide one another.
              ScrollTrigger.create({
                id: section.id + '-heading-sequence',
                trigger: element,
                refreshPriority: -10,
                start: () => { measure(); return lineTops[0] - window.innerHeight * REVEAL_VIEWPORT_FRACTION; },
                end: () => {
                  const pin = measure();
                  return lineTops[lineTops.length - 1] + (pin ? pin.end - pin.start : 0);
                },
                onUpdate: (self) => render(self.scroll()),
                onRefresh: (self) => { measure(); render(self.scroll()); },
              });
            });
            const navigateFromMenu = (event: Event) => {
              const id = (event as CustomEvent<string>).detail;
              const destination = select('.section').find((section) => section.id === id);
              if (!destination) return;
              event.preventDefault();
              ScrollTrigger.refresh();
              const pinId = id === 'offers' ? 'offers-top-pin'
                : id === 'contact' ? 'contact-content-pin' : '';
              const pin = pinId ? ScrollTrigger.getById(pinId) : undefined;
              window.scrollTo({
                top: pin ? pin.end : destination.getBoundingClientRect().top + window.scrollY,
                behavior: 'instant',
              });
              ScrollTrigger.update();
              // Complete entrance tweens without changing the carousel's first card.
              ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger instanceof Element && destination.contains(trigger.trigger)
                  && !trigger.vars.scrub) {
                  trigger.animation?.progress(1).pause();
                }
              });
              pricingTrack?.dispatchEvent(new CustomEvent('pricing:select', { detail: 0 }));
              destination.setAttribute('data-menu-revealed', '');
            };
            element.addEventListener('site:navigate', navigateFromMenu);
            contentFocusCleanup.push(() => {
              element.removeEventListener('site:navigate', navigateFromMenu);
            });
            // Re-measure after fonts, images and expandable service content settle.
            let refreshTimer = 0;
            let active = true;
            let refreshPending = false;
            let viewport = { width: window.innerWidth, height: window.innerHeight };
            const flushRefresh = () => {
              if (!active || !refreshPending || ScrollTrigger.isScrolling()) return;
              window.clearTimeout(refreshTimer);
              refreshPending = false;
              ScrollTrigger.refresh(true);
            };
            const refresh = () => {
              // Coalesce layout changes and wait for native momentum to finish.
              // Keep existing timelines, transforms and pin spacers mounted.
              refreshPending = true;
              window.clearTimeout(refreshTimer);
              refreshTimer = window.setTimeout(flushRefresh, 160);
            };
            const resize = () => {
              const next = { width: window.innerWidth, height: window.innerHeight };
              if (!viewportNeedsRefresh(viewport, next, ScrollTrigger.isTouch === 1)) return;
              viewport = next;
              refresh();
            };
            window.addEventListener('resize', resize);
            ScrollTrigger.addEventListener('scrollEnd', flushRefresh);
            // Observe content, not the page whose height includes GSAP's spacers.
            // A pin refresh changing spacer height must not schedule another refresh.
            const sizes = new WeakMap<Element, { width: number; height: number }>();
            const observer = new ResizeObserver((entries) => {
              let changed = false;
              for (const { target, contentRect } of entries) {
                const previous = sizes.get(target);
                if (previous && (Math.abs(previous.width - contentRect.width) > 1 ||
                  Math.abs(previous.height - contentRect.height) > 1)) changed = true;
                sizes.set(target, { width: contentRect.width, height: contentRect.height });
              }
              if (changed) refresh();
            });
            select('.hero, .section').forEach((section) => observer.observe(section));
            void document.fonts.ready.then(() => {
              if (!disposed && active) refresh();
            });
            element
              .querySelectorAll('img')
              .forEach((img) => img.addEventListener('load', refresh));
            refresh();
            return () => {
              active = false;
              stopEntrance();
              floatingCleanup.forEach((cleanup) => cleanup());
              work.removeEventListener('focusin', revealFocusedWork);
              contentFocusCleanup.forEach((cleanup) => cleanup());
              observer.disconnect();
              window.removeEventListener('resize', resize);
              ScrollTrigger.removeEventListener('scrollEnd', flushRefresh);
              window.clearTimeout(refreshTimer);
              element
                .querySelectorAll('img')
                .forEach((img) => img.removeEventListener('load', refresh));
              hero.removeAttribute('data-work-falling');
              delete element.dataset.motion;
            };
          },
          element,
        );
        release = () => media.revert();
      })
      .catch(() => {
        release?.();
        element.removeAttribute('data-hero-entrance');
        delete element.dataset.motion;
        /* Keep the complete static experience if motion cannot load. */
      });
    return () => {
      disposed = true;
      release?.();
    };
  }, [root, paused, reduced]);
  return reduced;
}
