'use client';

import { useContext, useSyncExternalStore } from 'react';
import { BriefMountContext } from './brief-context';

const query = '(min-width: 1024px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

/** Mount the CTA form here on desktop; its provider owns the shared answers. */
export function InlineProjectBrief() {
  const mount = useContext(BriefMountContext);
  const desktop = useSyncExternalStore(subscribe,
    () => window.matchMedia(query).matches, () => false);
  if (!desktop || !mount) return null;
  return <div ref={mount} className="inline-brief-mount" />;
}
