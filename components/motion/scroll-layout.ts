type Viewport = { width: number; height: number };

/** Match ScrollTrigger's mobile chrome tolerance, measured from the last real resize. */
export function viewportNeedsRefresh(previous: Viewport, next: Viewport, touchOnly: boolean) {
  if (Math.abs(next.width - previous.width) > 1) return true;
  const heightChange = Math.abs(next.height - previous.height);
  return heightChange > (touchOnly ? previous.height * 0.25 : 1);
}
