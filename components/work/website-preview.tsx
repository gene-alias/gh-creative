'use client';

import { useEffect, useRef } from 'react';

type WebsitePreviewProps = {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
};

/** Load and play silent demos only while visible; native controls remain available. */
export function WebsitePreview({
  src,
  poster,
  label,
  width,
  height,
}: WebsitePreviewProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let pausedByVisitor = false;

    const sync = () => {
      if (!visible || document.hidden) {
        video.pause();
      } else if (!motion.matches && !pausedByVisitor) {
        // Browser autoplay preferences may still require a tap on the native controls.
        void video.play().catch(() => {});
      }
    };
    const onPause = () => {
      if (visible && !document.hidden && !motion.matches)
        pausedByVisitor = true;
    };
    const onPlay = () => {
      pausedByVisitor = false;
    };
    const onMotionChange = () => {
      if (motion.matches) video.pause();
      else sync();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible =
          entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
        sync();
      },
      { threshold: [0, 0.25] },
    );

    video.muted = true;
    observer.observe(video);
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      video.removeEventListener('pause', onPause);
      video.removeEventListener('play', onPlay);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', onMotionChange);
      video.pause();
    };
  }, [src]);

  return (
    // Silent screen recordings contain no speech or soundtrack to caption.
    // oxlint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      className="mini-website-video"
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label={label}
    >
      Your browser cannot play this preview.{' '}
      <a href={src}>Open the website recording</a>.
    </video>
  );
}
