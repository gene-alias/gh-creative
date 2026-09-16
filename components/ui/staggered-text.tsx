'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { revealObserverOptions } from '@/components/motion/reveal-timing';
import './staggered-text.css';

type SegmentBy = 'chars' | 'words' | 'lines';
type Direction = 'top' | 'bottom' | 'left' | 'right';
type StaggerDirection = 'forward' | 'reverse' | 'center';

export type StaggeredTextProps = {
  text?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  segmentBy?: SegmentBy;
  separator?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  direction?: Direction;
  blur?: boolean;
  staggerDirection?: StaggerDirection;
  respectReducedMotion?: boolean;
  startDelay?: number;
  viewportReveal?: boolean;
};

function splitText(text: string, segmentBy: SegmentBy, separator?: string) {
  const rows = separator ? text.split(separator) : [text];
  return rows.flatMap((row, rowIndex) => {
    const parts =
      segmentBy === 'chars'
        ? Array.from(row)
        : segmentBy === 'words'
          ? row.split(/(\s+)/)
          : [row];
    const nodes = parts.map((part, index) => ({
      key: `${rowIndex}-${index}`,
      value: part,
    }));
    if (separator && rowIndex < rows.length - 1) {
      nodes.push({ key: `${rowIndex}-break`, value: '\n' });
    }
    return nodes;
  });
}

function orderDelays(count: number, staggerDirection: StaggerDirection) {
  return Array.from({ length: count }, (_, index) => {
    if (staggerDirection === 'reverse') return count - 1 - index;
    if (staggerDirection === 'center') {
      const mid = (count - 1) / 2;
      return Math.abs(index - mid);
    }
    return index;
  });
}

export function StaggeredText({
  text = '',
  className = '',
  as: Tag = 'p',
  segmentBy = 'words',
  separator,
  delay = 80,
  duration = 0.6,
  threshold = 0.1,
  rootMargin = '0px',
  direction = 'top',
  blur = true,
  staggerDirection = 'forward',
  respectReducedMotion = true,
  startDelay = 0,
  viewportReveal = false,
}: StaggeredTextProps) {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const segments = splitText(text, segmentBy, separator);
  const delays = orderDelays(segments.length, staggerDirection);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced =
      respectReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    element.dataset.revealPending = '';
    let revealed = false;
    let observer: IntersectionObserver;
    const observe = () => {
      if (revealed) return;
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            revealed = true;
            delete element.dataset.revealPending;
            setVisible(true);
            observer.disconnect();
          }
        },
        viewportReveal ? revealObserverOptions(window.innerHeight) : { threshold, rootMargin },
      );
      observer.observe(element);
    };
    observe();
    if (viewportReveal) window.addEventListener('resize', observe);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', observe);
      delete element.dataset.revealPending;
    };
  }, [respectReducedMotion, rootMargin, threshold, viewportReveal]);

  const style = {
    '--staggered-delay': `${delay}ms`,
    '--staggered-duration': `${duration}s`,
    '--staggered-start': `${startDelay}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={(element) => { root.current = element; }}
      className={cn(
        'staggered-text',
        visible && 'staggered-text--in',
        blur && 'staggered-text--blur',
        `staggered-text--${direction}`,
        className,
      )}
      style={style}
      aria-label={text}
    >
      {segments.map((segment, index) =>
        segment.value === '\n' ? (
          <br key={segment.key} />
        ) : (
          <span
            key={segment.key}
            className="staggered-text__seg"
            style={{ '--i': delays[index] } as CSSProperties}
            aria-hidden="true"
          >
            {segment.value === ' ' ? '\u00A0' : segment.value}
          </span>
        ),
      )}
    </Tag>
  );
}
