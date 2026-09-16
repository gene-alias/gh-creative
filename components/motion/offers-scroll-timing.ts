/** Fraction of the viewport where the pixel curtain starts dissolving. */
export const OFFERS_REVEAL_APPROACH = 0.55;

/** Keep the full dissolve visible as the section crosses the viewport top. */
export function getOffersScrollDistances(viewportHeight: number, _sectionHeight: number) {
  const approach = viewportHeight * OFFERS_REVEAL_APPROACH;
  return { approach, reveal: viewportHeight * 0.65, pin: 0 };
}

export function offersRevealStart(marginTop: number) {
  return `top+=${marginTop} ${OFFERS_REVEAL_APPROACH * 100}%`;
}
