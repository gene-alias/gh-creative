/** Begin one-third up from the bottom; finish at the upper third. */
export const REVEAL_VIEWPORT_FRACTION = 2 / 3;
export const REVEAL_FINISH_FRACTION = 1 / 3;
export const REVEAL_START = `top ${REVEAL_VIEWPORT_FRACTION * 100}%`;
export const REVEAL_END = `top ${REVEAL_FINISH_FRACTION * 100}%`;

export function revealObserverOptions(viewportHeight: number) {
  // IntersectionObserver percentage margins are based on root width, so use
  // pixels to keep the same vertical boundary in portrait and landscape.
  return { threshold: 0, rootMargin: `0px 0px -${Math.max(0, viewportHeight) * (1 - REVEAL_VIEWPORT_FRACTION)}px 0px` };
}
