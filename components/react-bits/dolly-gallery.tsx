"use client";
// Vendor gallery uses imperative frame refs and a keyboard-operable carousel region.
/* oxlint-disable react/react-compiler, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role */
import Image from 'next/image';
/* oxlint-disable next/no-html-link-for-pages */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import "./dolly-gallery.css";
export interface DollyGalleryImage {
  src?: string;
  alt?: string;
  label?: string;
  href?: string;
  content?: ReactNode;
}
export interface DollyGalleryProps {
  images?: (string | DollyGalleryImage)[];
  infinite?: boolean;
  pageScroll?: boolean;
  pinSection?: boolean;
  itemWidth?: number;
  aspectRatio?: number;
  borderRadius?: number;
  grayscale?: number;
  perspective?: number;
  spacing?: number;
  spread?: number;
  scatter?: number;
  revealRange?: number;
  passRange?: number;
  opacityFloor?: number;
  parallaxX?: number;
  parallaxY?: number;
  parallaxSmooth?: number;
  tilt?: number;
  pulse?: number;
  drift?: number;
  smooth?: number;
  wheelSpeed?: number;
  dragSpeed?: number;
  autoScroll?: number;
  pauseOnHover?: boolean;
  backgroundColor?: string;
  onIndexChange?: (index: number) => void;
  className?: string;
  children?: ReactNode;
}
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=900&auto=format&fit=crop",
];
const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));
const wrap = (value: number, span: number) => ((value % span) + span) % span;
const jitter = (k: number, salt: number) => {
  const x = Math.sin(k * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const normalise = (image: string | DollyGalleryImage): DollyGalleryImage =>
  typeof image === "string" ? { src: image } : image;
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const readMotion = () => window.matchMedia(motionQuery).matches;
interface Drag {
  y: number;
  at: number;
  startY: number;
}
export const DollyGallery = ({
  images = DEFAULT_IMAGES,
  infinite = true,
  pageScroll = false,
  pinSection = false,
  itemWidth = 340,
  aspectRatio = 4 / 5,
  borderRadius = 7,
  grayscale = 1,
  perspective = 1000,
  spacing = 800,
  spread = 0.8,
  scatter = 0.1,
  revealRange = 1.5,
  passRange = 1,
  opacityFloor = 0,
  parallaxX = 0.12,
  parallaxY = 0.06,
  parallaxSmooth = 0.85,
  tilt = 4,
  pulse = 0.03,
  drift = 0.08,
  smooth = 0.85,
  wheelSpeed = 1,
  dragSpeed = 1.5,
  autoScroll = 0,
  pauseOnHover = true,
  backgroundColor = "transparent",
  onIndexChange,
  className,
  children,
}: DollyGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLElement | null)[]>([]);
  const scrollDriven = pageScroll || pinSection;
  const target = useRef(pinSection ? -spacing * revealRange : 0);
  const shown = useRef(pinSection ? -spacing * revealRange : 0);
  const speed = useRef(0);
  const sway = useRef(0);
  const frame = useRef(0);
  const live = useRef(false);
  const stamp = useRef(0);
  const hovering = useRef(false);
  const visible = useRef(true);
  const dragging = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const flick = useRef(0);
  const aim = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });
  const lastIndex = useRef(-1);
  const indexChange = useRef(onIndexChange);
  useEffect(() => { indexChange.current = onIndexChange; }, [onIndexChange]);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const reduced = useSyncExternalStore(
    subscribeMotion,
    readMotion,
    () => false,
  );
  const list = useMemo(() => images.map(normalise), [images]);
  const tileWidth = Math.max(40, Math.min(itemWidth, box.width - 32));
  const tileHeight = tileWidth / Math.max(0.1, aspectRatio);
  const step = Math.max(40, spacing);
  const ring = useMemo(() => {
    if (!list.length) return [];
    if (!infinite) return list.map((image, index) => ({ image, index }));
    const needed = Math.ceil(revealRange + passRange) + 2;
    const copies = Math.max(1, Math.ceil((needed + 1) / list.length));
    const out: {
      image: DollyGalleryImage;
      index: number;
    }[] = [];
    for (let c = 0; c < copies; c++) {
      list.forEach((image, index) => out.push({ image, index }));
    }
    return out;
  }, [list, infinite, revealRange, passRange]);
  const cycle = ring.length * step;
  const reach = Math.max(0, (list.length - 1) * step);
  // Carry the final tile through its entire exit, plus a short invisible buffer.
  const pinnedEnd = reach + step * (passRange + 0.2);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const watch = new ResizeObserver(() => {
      setBox({ width: root.clientWidth, height: root.clientHeight });
    });
    watch.observe(root);
    return () => watch.disconnect();
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const watch = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    });
    watch.observe(root);
    return () => watch.disconnect();
  }, []);
  const paint = useCallback(
    (offset: number) => {
      if (!box.height || !ring.length) return;
      const half = cycle / 2;
      const rush = clamp(Math.abs(speed.current) / 2500, 0, 1);
      const px = eased.current.x;
      const py = eased.current.y;
      let nearest = -1;
      let nearestGap = Infinity;
      for (let k = 0; k < ring.length; k++) {
        const slot = slots.current[k];
        if (!slot) continue;
        const raw = k * step - offset;
        const depth = infinite ? wrap(raw + half, cycle) - half : raw;
        const t = depth / step;
        const alpha =
          t >= 0
            ? 1 - clamp(t / Math.max(0.01, revealRange), 0, 1)
            : 1 - clamp(-t / Math.max(0.01, passRange), 0, 1);
        if (alpha <= 0.002 || -depth >= perspective * 0.95) {
          slot.style.visibility = "hidden";
          continue;
        }
        slot.style.visibility = "visible";
        const gap = Math.abs(depth);
        if (gap < nearestGap) {
          nearestGap = gap;
          nearest = ring[k].index;
        }
        const side = k % 2 === 0 ? -1 : 1;
        const baseX = side * spread * (0.7 + 0.3 * jitter(k, 1)) * tileWidth;
        const baseY = (jitter(k, 2) * 2 - 1) * scatter * tileHeight;
        const x = baseX + px * parallaxX * tileWidth * alpha;
        const y =
          baseY +
          py * parallaxY * tileHeight * alpha +
          sway.current * drift * tileHeight;
        const swell = 1 + pulse * rush * alpha;
        const rx = -py * tilt * rush * alpha;
        const ry = px * tilt * rush * alpha;
        const floor = clamp(opacityFloor, 0, 1);
        slot.style.opacity = (floor + (1 - floor) * alpha).toFixed(3);
        slot.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${(-depth).toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${swell.toFixed(4)})`;
      }
      if (nearest >= 0 && nearest !== lastIndex.current) {
        lastIndex.current = nearest;
        indexChange.current?.(nearest);
      }
    },
    [
      box.height,
      ring,
      cycle,
      step,
      infinite,
      revealRange,
      passRange,
      opacityFloor,
      perspective,
      spread,
      scatter,
      tileWidth,
      tileHeight,
      parallaxX,
      parallaxY,
      drift,
      pulse,
      tilt,
    ],
  );
  const settle = useCallback(
    (value: number) => (infinite ? value : clamp(value, pinSection ? -step * revealRange : 0, pinSection ? pinnedEnd : reach)),
    [infinite, reach, pinnedEnd, pinSection, step, revealRange],
  );
  const wake = useCallback(() => {
    if (live.current) return;
    live.current = true;
    stamp.current = 0;
    const tick = (now: number) => {
      const dt = stamp.current
        ? Math.min(0.05, (now - stamp.current) / 1000)
        : 1 / 60;
      stamp.current = now;
      const drifting =
        autoScroll !== 0 &&
        visible.current &&
        !(pauseOnHover && hovering.current) &&
        !dragging.current;
      if (drifting) target.current = settle(target.current + autoScroll * dt);
      if (Math.abs(flick.current) > 1) {
        target.current = settle(target.current + flick.current * dt);
        flick.current *= Math.pow(0.02, dt);
      } else {
        flick.current = 0;
      }
      const rate = 1.5 + (1 - clamp(smooth, 0, 1)) * 30;
      const ease = reduced ? 1 : 1 - Math.exp(-dt * rate);
      const next = shown.current + (target.current - shown.current) * ease;
      const moved = next - shown.current;
      shown.current = next;
      const velocity = reduced ? 0 : moved / dt;
      const blend = 1 - Math.exp(-dt * 8);
      speed.current += (velocity - speed.current) * blend;
      sway.current +=
        (clamp(-velocity / 2500, -1, 1) - sway.current) * blend * 0.6;
      const pointerRate = 2 + (1 - clamp(parallaxSmooth, 0, 1)) * 40;
      const pointerEase = reduced ? 1 : 1 - Math.exp(-dt * pointerRate);
      eased.current.x += (aim.current.x - eased.current.x) * pointerEase;
      eased.current.y += (aim.current.y - eased.current.y) * pointerEase;
      paint(shown.current);
      const restless =
        Math.abs(target.current - shown.current) > 0.05 ||
        Math.abs(speed.current) > 1 ||
        Math.abs(sway.current) > 0.001 ||
        Math.abs(aim.current.x - eased.current.x) > 0.001 ||
        Math.abs(aim.current.y - eased.current.y) > 0.001;
      if (restless || drifting || flick.current !== 0) {
        frame.current = requestAnimationFrame(tick);
      } else {
        shown.current = target.current;
        speed.current = 0;
        sway.current = 0;
        paint(shown.current);
        live.current = false;
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [
    autoScroll,
    pauseOnHover,
    settle,
    reduced,
    smooth,
    parallaxSmooth,
    paint,
  ]);
  useEffect(() => {
    target.current = settle(target.current);
    shown.current = settle(shown.current);
    paint(shown.current);
    wake();
    return () => {
      cancelAnimationFrame(frame.current);
      live.current = false;
    };
  }, [paint, settle, wake]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (pinSection && !reduced) {
      let disposed = false;
      let cleanup = () => {};
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        const section = root.closest<HTMLElement>('#work');
        if (!section) return;
        gsap.registerPlugin(ScrollTrigger);
        const lead = step * revealRange;
        const update = (progress: number) => {
          target.current = -lead + progress * (pinnedEnd + lead);
          wake();
        };
        const trigger = ScrollTrigger.create({
          id: 'desktop-work-gallery-pin', trigger: section,
          start: 'top top', end: () => '+=' + window.innerHeight * Math.max(2, (list.length + passRange + 0.2) * 0.7),
          pin: section, pinSpacing: true, anticipatePin: 1,
          // Upstream pin distance must exist before downstream reveals measure.
          refreshPriority: 100,
          invalidateOnRefresh: true,
        });
        // Begin the approach before the section pins; finish at the pin's end.
        const travel = ScrollTrigger.create({
          id: 'desktop-work-gallery-travel', trigger: section,
          start: 'top 70%', end: () => trigger.end,
          refreshPriority: 90, invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
          onLeave: () => { target.current = pinnedEnd; shown.current = pinnedEnd; paint(pinnedEnd); },
        });
        update(travel.progress);
        cleanup = () => { travel.kill(); trigger.kill(); };
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => { disposed = true; cleanup(); };
    }
    if (pageScroll) {
      const update = () => {
        const rect = root.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
        target.current = settle(progress * reach);
        wake();
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }
    const onWheel = (event: WheelEvent) => {
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? box.height : 1;
      const before = target.current;
      target.current = settle(before + event.deltaY * unit * wheelSpeed);
      if (!infinite && target.current === before) return;
      event.preventDefault();
      flick.current = 0;
      wake();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [box.height, wheelSpeed, settle, infinite, wake, pageScroll, reach, pinnedEnd, passRange, pinSection, reduced, step, revealRange, list.length, paint]);
  const track = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    aim.current.x = clamp(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -1,
      1,
    );
    aim.current.y = clamp(
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
      -1,
      1,
    );
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (scrollDriven || event.button !== 0) return;
    dragging.current = { y: event.clientY, at: performance.now(), startY: event.clientY };
    suppressClick.current = false;
    flick.current = 0;
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    track(event);
    if (scrollDriven) {
      wake();
      return;
    }
    const drag = dragging.current;
    if (!drag) {
      wake();
      return;
    }
    if (!suppressClick.current) {
      if (Math.abs(event.clientY - drag.startY) <= 6) return;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const dy = event.clientY - drag.y;
    const now = performance.now();
    const dt = Math.max(1, now - drag.at) / 1000;
    drag.y = event.clientY;
    drag.at = now;
    target.current = settle(target.current - dy * dragSpeed);
    flick.current = (-dy * dragSpeed) / dt;
    wake();
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    flick.current = clamp(flick.current, -4000, 4000);
    wake();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const jumps: Record<string, number> = {
      ArrowDown: step,
      ArrowUp: -step,
      ArrowRight: step,
      ArrowLeft: -step,
      PageDown: step,
      PageUp: -step,
      " ": step,
    };
    const jump = jumps[event.key];
    if (jump === undefined) return;
    event.preventDefault();
    target.current = settle(target.current + jump);
    wake();
  };
  const tileStyle: CSSProperties = {
    width: tileWidth,
    height: tileHeight,
    left: "50%",
    top: "50%",
    marginLeft: -tileWidth / 2,
    marginTop: -tileHeight / 2,
    borderRadius,
  };
  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      tabIndex={scrollDriven ? undefined : 0}
      className={["dolly-gallery", scrollDriven && "dolly-gallery--scroll", className].filter(Boolean).join(" ")}
      style={{ backgroundColor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => {
        hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
        aim.current.x = 0;
        aim.current.y = 0;
        wake();
      }}
      onKeyDown={scrollDriven ? undefined : onKeyDown}
    >
      <div
        className="dolly-gallery__stage"
        style={{ perspective: `${perspective}px` }}
      >
        {ring.map(({ image, index }, k) => {
          const content = image.content ? image.content : image.src ? <Image
            unoptimized
            width={680}
            height={850}
            src={image.src}
            alt={image.alt ?? `Gallery image ${index + 1}`}
            draggable={false}
            loading="lazy"
            style={{
              filter:
                grayscale > 0
                  ? `grayscale(${clamp(grayscale, 0, 1)})`
                  : undefined,
            }}
            className="dolly-gallery__image"
          /> : <div className="dolly-gallery__blank"><span>{image.label ?? image.alt}</span></div>;
          const bindSlot = (node: HTMLElement | null) => {
            slots.current[k] = node;
          };
          const tileClass = [
            "dolly-gallery__tile",
            image.href && "dolly-gallery__tile--link",
          ].filter(Boolean).join(" ");
          return (
          <div
            key={k}
            ref={bindSlot}
            className={tileClass}
            style={tileStyle}
            aria-hidden={k >= list.length}
          >
            {image.href ? (
              <a
                className="dolly-gallery__tile-link"
                href={image.href}
                tabIndex={k >= list.length ? -1 : 0}
                aria-label={`Explore ${image.alt ?? image.label ?? 'selected'} work`}
                onClick={(event) => {
                  if (!scrollDriven && suppressClick.current && event.detail !== 0) {
                    event.preventDefault();
                  }
                }}
              >
                {content}
              </a>
            ) : content}
          </div>
          );
        })}
      </div>
      {children ? (
        <div className="dolly-gallery__content">{children}</div>
      ) : null}
    </div>
  );
};
export default DollyGallery;
