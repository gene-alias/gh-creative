'use client';

// Local blinking-squares implementation using the supplied component API.
import { Component, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Vector2, type ShaderMaterial } from 'three';

export interface BlinkingSquaresProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  direction?: 'right' | 'left' | 'top' | 'bottom';
  gridSize?: number;
  squareColor?: string;
  falloff?: number;
  fadeStart?: number;
  fadeEnd?: number;
  squareSize?: number;
  minBrightness?: number;
  twinkleSpeed?: number;
  twinkleStrength?: number;
  intensity?: number;
  dpr?: number;
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
  uniform float uTime, uGridSize, uFalloff, uFadeStart, uFadeEnd;
  uniform float uSquareSize, uMinBrightness, uTwinkleStrength, uIntensity;
  uniform int uDirection;
  uniform vec3 uSquareColor, uBackground;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 grid = vec2(uGridSize, uGridSize / aspect);
    vec2 id = floor(vUv * grid);
    vec2 center = (id + 0.5) / grid;
    float axis = center.x;
    if (uDirection == 1) axis = 1.0 - center.x;
    if (uDirection == 2) axis = center.y;
    if (uDirection == 3) axis = 1.0 - center.y;
    float ramp = clamp((axis - uFadeStart) / (uFadeEnd - uFadeStart), 0.0, 1.0);
    float density = pow(ramp, 1.0 / uFalloff);
    float present = density > hash(id + 13.71) ? 1.0 : 0.0;
    vec2 local = abs(fract(vUv * grid) - 0.5);
    float edge = max(local.x, local.y);
    float aa = max(fwidth(edge), 0.001);
    float square = 1.0 - smoothstep(uSquareSize * 0.5 - aa, uSquareSize * 0.5 + aa, edge);
    float seed = hash(id + 71.19);
    float pulse = 0.5 + 0.5 * sin(uTime * mix(1.5, 3.5, seed) + seed * 6.283185);
    float twinkle = mix(1.0, smoothstep(0.15, 0.85, pulse), uTwinkleStrength);
    float brightness = mix(uMinBrightness, 1.0, hash(id + 41.2));
    float amount = clamp(present * square * brightness * twinkle * uIntensity, 0.0, 1.0);
    gl_FragColor = vec4(mix(uBackground, uSquareColor, amount), 1.0);
    #include <colorspace_fragment>
  }
`;

function SquaresScene({ settings, playing }: { settings: BlinkingSquaresProps; playing: boolean }) {
  const { size, invalidate } = useThree();
  const elapsed = useRef(0);
  const material = useRef<ShaderMaterial>(null);
  const {
    direction = 'right', gridSize = 52, squareColor = '#BB29FF',
    backgroundColor = '#000000', falloff = 1.25, fadeStart = 0.65, fadeEnd = 1,
    squareSize = 0.57, minBrightness = 0.55, twinkleSpeed = 1.4,
    twinkleStrength = 0.94, intensity = 1,
  } = settings;
  const uniforms = useMemo(() => ({
    uResolution: { value: new Vector2(size.width, size.height) },
    uTime: { value: 0 },
    uDirection: { value: ['right', 'left', 'top', 'bottom'].indexOf(direction) },
    uGridSize: { value: Math.max(2, gridSize) },
    uFalloff: { value: Math.max(0.01, falloff) },
    uFadeStart: { value: fadeStart },
    uFadeEnd: { value: Math.max(fadeStart + 0.001, fadeEnd) },
    uSquareSize: { value: Math.max(0, Math.min(1, squareSize)) },
    uMinBrightness: { value: Math.max(0, Math.min(1, minBrightness)) },
    uTwinkleStrength: { value: Math.max(0, Math.min(1, twinkleStrength)) },
    uIntensity: { value: Math.max(0, intensity) },
    uSquareColor: { value: new Color(squareColor) },
    uBackground: { value: new Color(backgroundColor) },
  }), [size.width, size.height, direction, gridSize, falloff, fadeStart, fadeEnd,
    squareSize, minBrightness, twinkleStrength, intensity, squareColor, backgroundColor]);
  useEffect(() => {
    if (material.current) material.current.uniforms.uTime.value = elapsed.current;
    invalidate();
  }, [uniforms, invalidate]);
  useFrame((_, delta) => {
    if (playing) elapsed.current += Math.min(delta, 0.05) * twinkleSpeed;
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

export default function BlinkingSquares(props: BlinkingSquaresProps) {
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
  const playing = visible && tabVisible && !reduced && !props.paused
    && (props.twinkleSpeed ?? 1.4) !== 0 && (props.twinkleStrength ?? 0.94) !== 0;
  return (
    <div ref={root} className="blinking-squares" style={{ width: props.width ?? '100%', height: props.height ?? 500 }}>
      <div className="blinking-squares__visual" aria-hidden="true" style={{
        backgroundColor: props.backgroundColor ?? '#000000',
        opacity: props.opacity ?? 1,
      }}>
        {near && !contextLost && (
          <CanvasFallback>
            <Canvas frameloop={playing ? 'always' : 'demand'} dpr={Math.max(0.5, Math.min(2, props.dpr ?? 1.5))}
              gl={{ antialias: false, alpha: false }} fallback={null}
              onCreated={({ gl }) => {
                contextCleanup.current?.();
                const lost = () => setContextLost(true);
                gl.domElement.addEventListener('webglcontextlost', lost);
                contextCleanup.current = () => gl.domElement.removeEventListener('webglcontextlost', lost);
              }}>
              <SquaresScene settings={props} playing={playing} />
            </Canvas>
          </CanvasFallback>
        )}
      </div>
      {props.children && <div className="blinking-squares__content">{props.children}</div>}
    </div>
  );
}
