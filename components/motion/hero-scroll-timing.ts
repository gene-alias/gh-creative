/** Original lift, with a small inward drift toward the column centre. */
const LINE_X = [-0.07, -0.09] as const;
const LINE_Y = [-190, -145] as const;
const LINE_SCALE = [0.98, 0.99] as const;

export function getHeroLineScrollMotion(index: number, columnWidth: number) {
  const line = index === 0 ? 0 : 1;
  const width = Math.max(0, columnWidth);
  return {
    x: LINE_X[line] * width,
    y: LINE_Y[line],
    scale: LINE_SCALE[line],
  };
}
