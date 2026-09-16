/** Public art-direction and interaction controls. Distances are globe radii. */
export const GLOBE_CONTROLS = {
  rotationSpeed: 0.065,
  expansionDistance: 0.24,
  particleCount: 18000,
  glowStrength: 0.45,
  cityLightIntensity: 0.85,
  outlineBrightness: 0.65,
  maxPixelRatio: 1.25,
} as const;

export type GlobeControls = { [Key in keyof typeof GLOBE_CONTROLS]: number };
export type GlobeLayout = { centerX: number; centerY: number; diameter: number };
export type GlobeRuntime = {
  scrollProgress: number;
  active: boolean;
  reducedMotion: boolean;
  layout: GlobeLayout;
  invalidate: () => void;
};

const smoothstep = (start: number, end: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

/** Smooth irregular scroll events on the render clock without overshooting. */
export function advanceGlobeScroll(current: number, target: number, delta: number) {
  const next = current + (target - current) * (1 - Math.exp(-18 * Math.max(0, delta)));
  return Math.abs(target - next) < 0.00001 ? target : next;
}

/** Pure position mapping: reversing or jumping never depends on tween history. */
export function getGlobeScrollState(scrollProgress: number) {
  const progress = Math.max(0, Math.min(1, scrollProgress));
  const explosion = 1 - (1 - Math.min(1, progress / 0.94)) ** 2;
  return {
    explosion,
    scale: 1 + explosion * 0.65,
    rotation: progress * 0.25 + progress * progress * 0.35,
    opacity: 1 - smoothstep(0.65, 1, progress),
  };
}
