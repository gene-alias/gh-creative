/** Fraction of the viewport where the pixel curtain starts dissolving. */
export const OFFERS_REVEAL_APPROACH = 0.85;

/** Finish before the section reaches the top, without pinning the page. */
export function getOffersScrollDistances(viewportHeight: number, _sectionHeight: number) {
  const approach = viewportHeight * OFFERS_REVEAL_APPROACH;
  return { approach, reveal: viewportHeight * (OFFERS_REVEAL_APPROACH - 0.2), pin: 0 };
}

export function offersRevealStart(marginTop: number) {
  return `top+=${marginTop} ${OFFERS_REVEAL_APPROACH * 100}%`;
}
