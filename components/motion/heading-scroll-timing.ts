import { REVEAL_VIEWPORT_FRACTION, REVEAL_FINISH_FRACTION } from './reveal-timing.ts';

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
  // Reveal in the lower-middle viewport, leaving plenty of readable travel.
  const entrance = clamp((viewport * REVEAL_VIEWPORT_FRACTION - top)
    / Math.max(1, viewport * (REVEAL_VIEWPORT_FRACTION - REVEAL_FINISH_FRACTION)));
  // Hold at full visibility until the last 10% of the viewport. Finish the
  // exit at the viewport edge so scrolling back up reveals the
  // title on screen, rather than replaying the whole reveal above the viewport.
  // A pinned title must remain readable throughout its section's hold.
  const exitDistance = pin
    ? Math.min(viewport * 0.1, Math.max(1, naturalTop - pin.start))
    : viewport * 0.1;
  const exit = clamp((exitDistance - top) / Math.max(1, exitDistance));
  return {
    yPercent: 105 * (1 - entrance) - 105 * exit,
    opacity: entrance * (1 - exit),
  };
}
