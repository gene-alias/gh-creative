'use client';

import { lazy, Suspense, useSyncExternalStore } from 'react';
/* oxlint-disable next/no-html-link-for-pages */
import { WorkCover } from './work-cover';
import { workCovers } from '@/lib/work-covers';

const DollyGallery = lazy(
  () => import('@/components/react-bits/dolly-gallery'),
);
const query = '(min-width: 1024px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const galleryExamples = [
  workCovers[0],
  {
    ...workCovers[0],
    image: '/assets/work/videos/incredible-kitchens-preview.gif',
    still: '/assets/work/incredible-kitchens-thumbnail.jpg',
    alt: 'A looping preview of a custom kitchen design and installation website.',
  },
  {
    ...workCovers[1],
    image: '/assets/work/visual/jewellery-portraits/031.webp',
    still: '/assets/work/visual/jewellery-portraits/031.webp',
    width: 1650,
    height: 2200,
    alt: 'Freckles and gold: a close portrait framed by hands and gold jewellery.',
  },
  {
    ...workCovers[1],
    image: '/assets/work/visual/architecture-interiors/056.webp',
    still: '/assets/work/visual/architecture-interiors/056.webp',
    alt: 'Curved residence: a contemporary architectural visual.',
  },
  workCovers[2],
  {
    ...workCovers[2],
    image: '/assets/work/centum-branding/app-icons.webp',
    still: '/assets/work/centum-branding/app-icons.webp',
    width: 1600,
    height: 1173,
    alt: 'CENTUM identity and app icon directions in orange and black.',
  },
];
const images = galleryExamples.map((item) => ({
  label: item.category,
  alt: item.alt,
  href: item.href,
  content: <WorkCover item={item} caption rotate={false} />,
}));

export function DesktopWorkGallery() {
  const desktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  if (!desktop) return null;
  return (
    <div className="desktop-work-gallery">
      <div className="desktop-work-gallery__stage">
        <Suspense fallback={<p className="meta">Loading selected work…</p>}>
          <DollyGallery
            images={images}
            infinite={false}
            pageScroll
            pinSection
            itemWidth={560}
            aspectRatio={16 / 10}
            grayscale={0}
            borderRadius={18}
            spacing={650}
            spread={0.7}
            revealRange={1.5}
            passRange={1.4}
            opacityFloor={0.9}
            pulse={0}
            drift={0}
            tilt={2}
            smooth={0.65}
          />
        </Suspense>
      </div>
      <nav
        className="desktop-work-gallery__links"
        aria-label="Explore selected work"
      >
        {workCovers.map((project, index) => (
          <a key={project.href} href={project.href}>
            <span>
              <strong>
                0{index + 1} / {project.category}
              </strong>
              <small>{project.description}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
