'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { getHeadingLineState } from './heading-scroll-timing';

export function useScrollMotion(
  root: RefObject<HTMLElement | null>,
  paused: boolean,
) {
  const [reduced, setReduced] = useState(false);
  const entrancePlayed = useRef(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
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
            const hero = select('.hero')[0];
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
                defaults: { duration: 0.65, ease: 'power3.out' },
              });
              intro
                .from(select('.hero-art'), { opacity: 0, duration: 1 }, 0)
                .from(
                  select('.hero-logo, .hero .menu-trigger'),
                  { opacity: 0, y: -12, stagger: 0.12 },
                  0.12,
                )
                .from(
                  select('.studio-index, .hero-services-reveal'),
                  { opacity: 0, y: 12, stagger: 0.1 },
                  0.3,
                )
                .from(
                  select('.hero-line-reveal'),
                  { opacity: 0, y: 24, stagger: 0.14, duration: 0.8 },
                  0.5,
                )
                .from(
                  select('.hero-description-reveal'),
                  { opacity: 0, y: 16 },
                  0.82,
                )
                .from(
                  select('.hero-support > .button, .hero-support > .hero-secondary-actions'),
                  { opacity: 0, y: 16, stagger: 0.12 },
                  1,
                )
                .from(
                  select('.hero-footer > *'),
                  { opacity: 0, y: 8, stagger: 0.08 },
                  1.15,
                );
              // Scrolling or keyboard interaction immediately reveals the controls.
              const finish = () => {
                intro.progress(1);
              };
              window.addEventListener('scroll', finish, {
                passive: true,
                once: true,
              });
              element.addEventListener('focusin', finish, { once: true });
              stopEntrance = () => {
                window.removeEventListener('scroll', finish);
                element.removeEventListener('focusin', finish);
              };
              intro.eventCallback('onComplete', stopEntrance);
            }
            gsap.to(select('.hero-refraction'), {
              y: value('hero-travel'),
              scale: 1.18,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: value('scrub'),
              },
            });
            const shimmer = gsap.fromTo(
              select('.refraction-shimmer, .hero .cta-shimmer'),
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
              y: -64,
              ease: 'none',
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: value('scrub'),
              },
            });
            const workLink = select('.hero-secondary-actions > .text-link')[0];
            const workLinkRow = select('.hero-secondary-actions')[0];
            const fallDistance = () => Math.max(280, window.innerHeight * 0.45);
            const workLinkFall = gsap.timeline({
              scrollTrigger: {
                id: 'hero-work-link-fall',
                // Measure the row, which stays in place while its link falls.
                trigger: workLinkRow,
                start: 'top 22%',
                end: () => '+=' + fallDistance(),
                scrub: true,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  hero.toggleAttribute('data-work-falling', self.isActive);
                },
              },
            });
            workLinkFall
              .fromTo(workLink,
                { y: 0, rotation: 0 },
                {
                  // Compensate for page scroll so the visible motion is downward.
                  y: () => window.innerHeight * 0.9 + fallDistance(),
                  rotation: 5,
                  transformOrigin: 'left center',
                  duration: 1,
                  ease: 'power2.in',
                },
                0,
              )
              .fromTo(workLink,
                { autoAlpha: 1 },
                { autoAlpha: 0, duration: 0.45, ease: 'power1.in' },
                0.55,
              );
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
            gsap.fromTo(
              select('.hero-description'),
              { opacity: 1 },
              {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: '+=240',
                  scrub: value('scrub'),
                },
              },
            );
            // Separate layers keep entrance and scroll transforms independent.
            // Finish the title travel within the first screenful of scrolling.
            select('.hero-line').forEach((line, index) => {
              gsap.to(line, {
                y: index === 0 ? -190 : -145,
                x: index === 0 ? -180 : -100,
                scale: index === 0 ? 1.04 : 1.015,
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
            select('.signal-ribbon__line').forEach(
              (line: HTMLElement, index: number) => {
                gsap.fromTo(
                  line,
                  { xPercent: index ? -16 : 0 },
                  {
                    xPercent: index ? 0 : -16,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: select('.signal-ribbon')[0],
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: value('scrub'),
                    },
                  },
                );
              },
            );
            const services = select('#services')[0];
            const servicesBackground = select('.services-background')[0];
            if (services && servicesBackground) {
              gsap.fromTo(
                servicesBackground,
                { yPercent: -14 },
                {
                  yPercent: 14,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: services,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: value('scrub'),
                  },
                },
              );
            }
            const work = select('#work')[0];
            const stage = select('.work-stack')[0];
            const panels = select('.work-panel');
            const sequenceDuration = panels.length * 1.2;
            const showcase = gsap.timeline({
              scrollTrigger: {
                id: 'work-showcase-pin',
                refreshPriority: 30,
                trigger: work,
                start: 'top top',
                end: () => '+=' + Math.max(1050, window.innerHeight * 2.4),
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                // Direct scrubbing reaches the final frame before the pin releases.
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            panels.forEach((panel, index) => {
              showcase.fromTo(
                panel,
                { xPercent: index % 2 === 0 ? -120 : 120 },
                { xPercent: 0, duration: 1, ease: 'power2.out' },
                index * 1.2,
              );
              // The panel owns the slide-in; its image drifts independently inside it.
              const image = panel.querySelector('img');
              if (image) {
                const travel = [5, 7, 6][index] ?? 6;
                const direction = index % 2 === 0 ? 1 : -1;
                const scale = index === 0 ? 1.08 : 1.18;
                showcase.fromTo(image,
                  { yPercent: travel * direction, scale },
                  {
                    yPercent: -travel * direction, scale,
                    duration: sequenceDuration - index * 1.2,
                    ease: 'none',
                  },
                  index * 1.2,
                );
              }
            });
            // Overscan keeps the background covered throughout its slower drift.
            showcase.fromTo(select('.work-pattern-background'),
              { y: -28, scale: 1.12 },
              { y: 28, scale: 1.12, duration: sequenceDuration, ease: 'none' },
              0,
            );
            // Leave a short scroll beat to see the completed stack before release.
            showcase.fromTo(
              select('.project-meter span'),
              { scaleX: 0 },
              { scaleX: 1, ease: 'none', duration: sequenceDuration },
              0,
            );
            // Continue depth movement after the pin ends; no extra pin or scroll space.
            // Exit uses the panels' vertical axis, separate from slide-in x and image y.
            const workExitDistance = () => Math.max(280, Math.min(work.offsetHeight, window.innerHeight * 0.8));
            const backgroundExitTravel = () => {
              const pin = showcase.scrollTrigger!;
              // Match the pinned background's 56px travel per scroll pixel.
              // The inner layer inherits its parent's fixed 1.12 scale.
              return 56 * workExitDistance() / Math.max(1, pin.end - pin.start) / 1.12;
            };
            const workExit = gsap.timeline({
              scrollTrigger: {
                id: 'work-showcase-exit',
                trigger: work,
                refreshPriority: 25,
                start: () => showcase.scrollTrigger!.end,
                end: () => '+=' + workExitDistance(),
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            panels.forEach((panel, index) => {
              workExit.fromTo(panel,
                { y: 0 },
                { y: -(80 + index * 55), duration: 1, ease: 'none', immediateRender: false },
                0,
              );
            });
            workExit
              .fromTo(select('.work-pattern-background > .blinking-squares'),
                { y: 0 },
                { y: backgroundExitTravel, duration: 1, ease: 'none', immediateRender: false },
                0,
              );
            // Keyboard navigation must not land on a panel still off screen.
            const revealFocusedWork = (event: FocusEvent) => {
              if (
                event.target instanceof Element &&
                event.target.closest('.work-panel-link') &&
                showcase.progress() < 1
              ) {
                const trigger = showcase.scrollTrigger;
                if (!trigger) return;
                window.scrollTo({ top: trigger.end, behavior: 'instant' });
                ScrollTrigger.update();
              }
            };
            work.addEventListener('focusin', revealFocusedWork);
            // The remaining sections get a brief content reveal at the top.
            // Keep work's panel sequence and offers' pixel reveal as their pin owners.
            const contentFocusCleanup: (() => void)[] = [];
            ['services', 'studio', 'contact'].forEach((id, index) => {
              const section = select('#' + id)[0];
              if (!section) return;
              // Reveal text only; bordered rows, forms and controls stay visible.
              const content = Array.from(section.querySelectorAll(
                ':scope > .body-copy, [data-content-reveal]',
              ));
              const sequence = gsap.timeline({
                scrollTrigger: {
                  id: id + '-content-pin',
                  refreshPriority: [28, 5, 4][index],
                  trigger: section,
                  start: 'top top',
                  end: () => '+=' + (id === 'services'
                    ? Math.max(480, window.innerHeight * 0.85)
                    : Math.max(240, window.innerHeight * 0.45)),
                  pin: true,
                  pinSpacing: true,
                  scrub: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              if (id === 'services') {
                sequence.fromTo(section.querySelectorAll(':scope > .body-copy'),
                  { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' },
                );
                section.querySelectorAll('.service-trigger').forEach((row) => {
                  const start = sequence.duration() + 0.08;
                  // Finish each row before the next begins. The button, row
                  // dividers and SVG icon frames remain completely static.
                  sequence.fromTo(row.querySelectorAll(':scope > span'),
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'none' }, start,
                  );
                  sequence.fromTo(row.querySelectorAll('[data-slot="accordion-trigger-icon"] > *'),
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: 'none' }, start,
                  );
                });
              } else {
                sequence.fromTo(content, { opacity: 0 }, {
                  opacity: 1, stagger: 0.15, duration: 0.6, ease: 'none',
                });
              }
              sequence.to({}, { duration: 0.15 });
              // Tabbing to native controls finishes the reveal before focus lands.
              const revealOnFocus = () => {
                const pin = sequence.scrollTrigger;
                if (pin && sequence.progress() < 1) {
                  window.scrollTo({ top: pin.end, behavior: 'instant' });
                  ScrollTrigger.update();
                }
              };
              section.addEventListener('focusin', revealOnFocus);
              contentFocusCleanup.push(() => section.removeEventListener('focusin', revealOnFocus));
            });
            select('.section h2').forEach((heading: HTMLElement) => {
              const section = heading.closest<HTMLElement>('.section');
              const lines = Array.from(heading.querySelectorAll<HTMLElement>('.section-title-reveal'));
              if (!section || !lines.length) return;
              const pinId = section.id === 'work' ? 'work-showcase-pin'
                : section.id === 'offers' ? 'offers-top-pin' : section.id + '-content-pin';
              // Capture original styles in the GSAP context for pause/reduced-motion cleanup.
              gsap.set(lines, { yPercent: 0, opacity: 1, rotation: 0 });
              const setters = lines.map((line) => ({
                y: gsap.quickSetter(line, 'yPercent'),
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
                  setter.y(state.yPercent);
                  setter.opacity(state.opacity);
                });
              };
              // One scroll owner per title. Subtract the actual pin duration so
              // entry, hold and exit cannot overwrite or prematurely hide one another.
              ScrollTrigger.create({
                id: section.id + '-heading-sequence',
                trigger: element,
                refreshPriority: -10,
                start: () => { measure(); return lineTops[0] - window.innerHeight; },
                end: () => {
                  const pin = measure();
                  return lineTops[lineTops.length - 1] + (pin ? pin.end - pin.start : 0) + 180;
                },
                onUpdate: (self) => render(self.scroll()),
                onRefresh: (self) => { measure(); render(self.scroll()); },
              });
            });
            select('.studio .signal-wordmark__echo').forEach(
              (line: HTMLElement, index: number) => {
                gsap.fromTo(
                  line,
                  { x: index ? -18 : 18 },
                  {
                    x: index ? 18 : -18,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: select('.studio')[0],
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: value('scrub'),
                    },
                  },
                );
              },
            );
            // Re-measure after fonts, images and expandable service content settle.
            let frame = 0;
            let active = true;
            const refresh = () => {
              cancelAnimationFrame(frame);
              frame = requestAnimationFrame(() => ScrollTrigger.refresh());
            };
            const observer = new ResizeObserver(refresh);
            observer.observe(element);
            observer.observe(stage);
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
              work.removeEventListener('focusin', revealFocusedWork);
              contentFocusCleanup.forEach((cleanup) => cleanup());
              observer.disconnect();
              cancelAnimationFrame(frame);
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
