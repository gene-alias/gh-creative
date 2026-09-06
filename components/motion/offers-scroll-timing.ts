/** Reveal starts a quarter-screen before pinning; both end at the same scroll offset. */
export function getOffersScrollDistances(viewportHeight: number, sectionHeight: number) {
  const approach = viewportHeight * 0.25;
  const reveal = Math.max(approach + 240, Math.min(sectionHeight * 0.65, viewportHeight * 0.72));
  return { approach, reveal, pin: reveal - approach };
}
