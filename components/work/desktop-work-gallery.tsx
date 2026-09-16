'use client';

import { lazy, Suspense, useSyncExternalStore } from 'react';
import Link from 'next/link';

const DollyGallery = lazy(() => import('@/components/react-bits/dolly-gallery'));
const query = '(min-width: 1024px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const images = [
  { src: '', label: '01 / WEB DESIGN', alt: 'Web design' },
  { src: '', label: '02 / VISUAL DESIGN', alt: 'Visual design' },
  { src: '', label: '03 / BRANDING', alt: 'Branding' },
  { src: '', label: '04 / AUDIO', alt: 'Audio' },
];
const projects = [
  { title: 'Web design', href: '/work/web-design' },
  { title: 'Visual design', href: '/work/visual-design' },
  { title: 'Branding', href: '/work/branding' },
  { title: 'Audio', href: '#services' },
];

export function DesktopWorkGallery() {
  const desktop = useSyncExternalStore(subscribe,
    () => window.matchMedia(query).matches, () => false);
  if (!desktop) return null;
  return (
    <div className="desktop-work-gallery">
      <div className="desktop-work-gallery__stage">
        <Suspense fallback={<p className="meta">Loading selected work…</p>}>
          <DollyGallery images={images} infinite={false} pageScroll pinSection
            itemWidth={340} aspectRatio={4 / 3} grayscale={0} borderRadius={18}
            spacing={650} spread={0.7} revealRange={1.5} passRange={1.4}
            pulse={0} drift={0} tilt={2} smooth={0.65} />
        </Suspense>
      </div>
      <nav className="desktop-work-gallery__links" aria-label="Explore selected work">
        {projects.map((project, index) => (
          <Link key={project.href} href={project.href} prefetch={false}>
            <span>0{index + 1} / {project.title}</span><span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
