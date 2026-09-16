'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

const layers = ['far', 'middle', 'near'] as const;
const planets = [
  [{ x: 82, y: 46, size: 38 }],
  [{ x: 14, y: 112, size: 74 }],
  [{ x: 90, y: 188, size: 120 }],
] as const;
const random = (seed: number, salt: number) => {
  const value = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
// Batch each star color into one SVG path instead of animating hundreds
// of individual DOM elements inside the perspective layers.
const starFields = [false, true].map((hero) => layers.map((_, depth) => {
  const paths = ['', '', ''];
  for (let index = 0; index < [160, 72, 20][depth]; index++) {
    const seed = index + depth * 173 + (hero ? 7 : 19);
    const x = random(seed, 1) * 1200 - 100;
    const y = random(seed, 2) * 1200 - 100;
    const radius = 0.8 + depth * 0.65 + random(seed, 3);
    const color = index % 7 === 0 ? 2 : index % 3 === 0 ? 1 : 0;
    paths[color] += `M${x.toFixed(1)} ${y.toFixed(1)}h${radius.toFixed(1)}v${radius.toFixed(1)}h-${radius.toFixed(1)}z`;
  }
  return paths;
}));

// Hundreds of tiny stars share one SVG path, keeping the distant dust lightweight.
const galaxyDust = Array.from({ length: 420 }, (_, index) => {
  const y = random(index, 1) * 1200;
  const spread = (random(index, 2) + random(index, 3) - 1) * 150;
  const x = 500 - y * 0.36 + spread;
  const size = 0.35 + random(index, 4) * 0.7;
  return `M${x.toFixed(1)} ${y.toFixed(1)}h${size.toFixed(1)}v${size.toFixed(1)}h-${size.toFixed(1)}z`;
}).join(' ');

/** Deterministic stars keep server markup and hydration identical. */
export function DepthScene({ hero = false }: { hero?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = root.current;
    if (!scene) return;
    const sync = () => { scene.dataset.idleActive = String(!document.hidden); };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return (
    <div className={`depth-scene${hero ? ' depth-scene--hero' : ''}`} aria-hidden="true" ref={root}>
      <div className="depth-camera">
        <svg className="galaxy-dust" viewBox="0 0 600 1200" preserveAspectRatio="xMidYMid slice">
          <path d={galaxyDust} />
        </svg>
        {layers.map((layer, depth) => (
          <div className={`particle-layer particle-layer--${layer}`} key={layer}>
            <div className="planet-drift">
            {planets[depth].map((planet) => (
              <div
                className="depth-planet"
                key={planet.size}
                style={{
                  left: `${planet.x}%`, top: `${planet.y}%`,
                  '--planet-size': `${planet.size}px`,
                } as CSSProperties}
              >
                <svg className="depth-planet__wireframe" viewBox="0 0 100 100" fill="none">
                  <use href="/assets/planet-wireframe.svg#mesh" />
                </svg>
              </div>
            ))}
            </div>
            <div className="star-drift">
              <svg className="star-field" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                {starFields[hero ? 1 : 0][depth].map((path, index) => (
                  <path key={index} d={path} fill={['#f1f3ff', '#a9c7ff', '#ffddbc'][index]} />
                ))}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
