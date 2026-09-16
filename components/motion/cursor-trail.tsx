'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; time: number };

/** Decorative desktop trail; renders only while moving or fading out. */
export function CursorTrail() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const surface = canvas.current;
    const context = surface?.getContext('2d');
    if (!surface || !context) return;
    const media = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let points: Point[] = [];
    let frame = 0;
    const lifetime = 260;
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      points = [];
      context.clearRect(0, 0, surface.width, surface.height);
    };
    const resize = () => {
      clear();
      // One pixel per CSS pixel keeps the decorative layer inexpensive.
      surface.width = window.innerWidth;
      surface.height = window.innerHeight;
    };
    const draw = (now: number) => {
      frame = 0;
      points = points.filter((point) => now - point.time < lifetime);
      context.clearRect(0, 0, surface.width, surface.height);
      context.lineCap = 'round';
      for (let i = 1; i < points.length; i++) {
        const alpha = Math.max(0, 1 - (now - points[i - 1].time) / lifetime);
        const width = 0.5 + alpha * 2;
        for (const glow of [true, false]) {
          context.beginPath();
          context.moveTo(points[i - 1].x, points[i - 1].y);
          context.lineTo(points[i].x, points[i].y);
          context.lineWidth = glow ? width * 3 : width;
          context.strokeStyle = `rgba(255, ${glow ? 39 : 63}, ${glow ? 44 : 70}, ${alpha * (glow ? 0.1 : 0.65)})`;
          context.stroke();
        }
      }
      const tip = points.at(-1);
      if (tip) {
        const alpha = Math.max(0, 1 - (now - tip.time) / lifetime);
        context.beginPath();
        context.arc(tip.x, tip.y, 2.2 * alpha, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 165, 174, ${alpha})`;
        context.fill();
        frame = requestAnimationFrame(draw);
      }
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse' || document.hidden) return;
      const now = performance.now();
      const previous = points.at(-1);
      // Avoid streaks across the screen after a tab switch or a long pause.
      if (previous && now - previous.time > lifetime) points = [];
      points.push({ x: event.clientX, y: event.clientY, time: now });
      if (points.length > 40) points.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      clear();
      surface.style.display = media.matches ? 'block' : 'none';
      if (media.matches) resize();
    };
    sync();
    media.addEventListener('change', sync);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', clear);
    document.addEventListener('pointerleave', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      clear();
      media.removeEventListener('change', sync);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', clear);
      document.removeEventListener('pointerleave', clear);
      document.removeEventListener('visibilitychange', clear);
    };
  }, []);
  return <canvas ref={canvas} aria-hidden="true" className="cursor-trail" />;
}
