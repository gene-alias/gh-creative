'use client';

// Local halftone-wave implementation using the supplied component API.
import { Component, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Vector2, type ShaderMaterial } from 'three';

export interface HalftoneWaveProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  speed?: number;
  noiseScale?: number;
  octaves?: number;
  gridDensity?: number;
  dotSize?: number;
  softness?: number;
  contrastMin?: number;
  contrastMax?: number;
  scrollX?: number;
  scrollY?: number;
  rotation?: number;
  colorA?: string;
  colorB?: string;
  backgroundColor?: string;
  opacity?: number;
  paused?: boolean;
  children?: ReactNode;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
const fragmentShader = `
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime, uNoiseScale, uDensity, uDotSize, uSoftness;
  uniform float uContrastMin, uContrastMax, uRotation;
  uniform int uOctaves;
  uniform vec2 uScroll;
  uniform vec3 uColorA, uColorB, uBackground;

  float hash(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float field(vec3 p) {
    float total = 0.0;
    float weight = 0.5;
    float weights = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uOctaves) break;
      total += noise(p) * weight;
      weights += weight;
      p = p * 2.03 + vec3(7.1, 3.7, 1.9);
      weight *= 0.5;
    }
    return total / weights;
  }
  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 grid = vec2(uDensity, uDensity / aspect);
    vec2 cell = (floor(vUv * grid) + 0.5) / grid;
    vec2 point = (cell - 0.5) * vec2(aspect, 1.0);
    float c = cos(uRotation), s = sin(uRotation);
    point = mat2(c, -s, s, c) * point;
    float n = field(vec3(point * uNoiseScale + uScroll * uTime, uTime * 0.16));
    float tone = smoothstep(uContrastMin, uContrastMax, n);
    float radius = uDotSize * 0.5 * mix(0.08, 1.0, tone);
    float distanceToCenter = length(fract(vUv * grid) - 0.5);
    float feather = max(0.012, uSoftness * 0.15);
    float dotMask = 1.0 - smoothstep(max(0.0, radius - feather), radius + feather, distanceToCenter);
    vec3 ink = mix(uColorB, uColorA, tone);
    gl_FragColor = vec4(mix(uBackground, ink, dotMask), 1.0);
    #include <colorspace_fragment>
  }
`;

function WaveScene({ settings, playing }: { settings: HalftoneWaveProps; playing: boolean }) {
  const { size, invalidate } = useThree();
  const elapsed = useRef(0);
  const material = useRef<ShaderMaterial>(null);
  const {
    speed = 1, noiseScale = 3, octaves = 3, gridDensity = 40,
    dotSize = 0.75, softness = 0.35, contrastMin = 0.2, contrastMax = 0.8,
    scrollX = 0.1, scrollY = 0.1, rotation = 0,
    colorA = '#FFFFFF', colorB = '#000000', backgroundColor = '#FFFFFF',
  } = settings;
  const uniforms = useMemo(() => ({
    uResolution: { value: new Vector2(size.width, size.height) },
    uTime: { value: 0 },
    uNoiseScale: { value: Math.max(0.01, noiseScale) },
    uOctaves: { value: Math.max(1, Math.min(8, Math.round(octaves))) },
    uDensity: { value: Math.max(2, gridDensity) },
    uDotSize: { value: Math.max(0, Math.min(1, dotSize)) },
    uSoftness: { value: Math.max(0, softness) },
    uContrastMin: { value: contrastMin },
    uContrastMax: { value: Math.max(contrastMin + 0.001, contrastMax) },
    uScroll: { value: new Vector2(scrollX, scrollY) },
    uRotation: { value: rotation * Math.PI / 180 },
    uColorA: { value: new Color(colorA) },
    uColorB: { value: new Color(colorB) },
    uBackground: { value: new Color(backgroundColor) },
  }), [size.width, size.height, noiseScale, octaves, gridDensity, dotSize, softness,
    contrastMin, contrastMax, scrollX, scrollY, rotation, colorA, colorB, backgroundColor]);
  useEffect(() => {
    if (material.current) material.current.uniforms.uTime.value = elapsed.current;
    invalidate();
  }, [uniforms, invalidate]);
  useFrame((_, delta) => {
    if (playing) elapsed.current += Math.min(delta, 0.05) * speed;
    if (material.current) material.current.uniforms.uTime.value = elapsed.current;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader}
        fragmentShader={fragmentShader} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

class CanvasFallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HalftoneWave(props: HalftoneWaveProps) {
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const contextCleanup = useRef<(() => void) | null>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(node);
    preload.observe(node);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () => setTabVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener('change', syncPreference);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      observer.disconnect();
      preload.disconnect();
      preference.removeEventListener('change', syncPreference);
      document.removeEventListener('visibilitychange', syncVisibility);
      contextCleanup.current?.();
    };
  }, []);
  const playing = visible && tabVisible && !reduced && !props.paused;
  return (
    <div ref={root} className="halftone-wave" style={{ width: props.width ?? '100%', height: props.height ?? 500 }}>
      <div className="halftone-wave__visual" aria-hidden="true" style={{
        backgroundColor: props.backgroundColor ?? '#FFFFFF',
        color: props.colorB ?? '#000000', opacity: props.opacity ?? 1,
      }}>
        {near && !contextLost && (
          <CanvasFallback>
            <Canvas frameloop={playing ? 'always' : 'demand'} dpr={[1, 1.5]}
              gl={{ antialias: false, alpha: false }} fallback={null}
              onCreated={({ gl }) => {
                contextCleanup.current?.();
                const lost = () => setContextLost(true);
                gl.domElement.addEventListener('webglcontextlost', lost);
                contextCleanup.current = () => gl.domElement.removeEventListener('webglcontextlost', lost);
              }}>
              <WaveScene settings={props} playing={playing} />
            </Canvas>
          </CanvasFallback>
        )}
      </div>
      {props.children && <div className="halftone-wave__content">{props.children}</div>}
    </div>
  );
}
