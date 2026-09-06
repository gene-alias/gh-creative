export type HeadingPin = { start: number; end: number };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Pin travel consumes scroll without moving the title through the viewport. */
export function getHeadingLineState(
  scroll: number,
  viewport: number,
  naturalTop: number,
  pin?: HeadingPin,
) {
  const held = pin ? Math.min(Math.max(0, scroll - pin.start), pin.end - pin.start) : 0;
  const top = naturalTop - (scroll - held);
  const entrance = clamp((viewport - top) / Math.max(1, viewport * 0.28));
  const exit = clamp(-top / 180);
  return {
    yPercent: 105 * (1 - entrance) - 105 * exit,
    opacity: entrance * (1 - exit),
  };
}
