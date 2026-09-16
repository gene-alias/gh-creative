'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeEarthGeometry } from './earth-geometry';
import { advanceGlobeScroll, getGlobeScrollState, type GlobeControls, type GlobeRuntime } from './globe-controls';

type SceneProps = {
  runtime: RefObject<GlobeRuntime>;
  controls: GlobeControls;
  onReady: () => void;
  onUnavailable: () => void;
};

const vertexShader = `
  attribute vec3 aDirection;
  attribute float aSeed;
  uniform float uExplosion;
  uniform float uDpr;
  uniform float uLift;
  uniform float uPointSize;
  varying float vLight;
  varying float vSeed;
  varying float vFacing;
  void main() {
    vec3 displaced = position + aDirection * (uExplosion * uLift);
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    vec3 viewNormal = normalize(normalMatrix * aDirection);
    vFacing = dot(viewNormal, normalize(-viewPosition.xyz));
    vLight = 0.35 + 0.65 * max(vFacing, 0.0);
    vSeed = aSeed;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp((uPointSize + aSeed * 0.35) * uDpr * 7.0 / max(1.0, -viewPosition.z), 1.0, 9.0);
  }
`;
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlow;
  uniform float uBrightness;
  uniform float uAccent;
  varying float vLight;
  varying float vSeed;
  varying float vFacing;
  void main() {
    if (vFacing <= 0.0) discard;
    float alpha = vLight * uOpacity * uBrightness * smoothstep(0.0, 0.12, vFacing);
    #ifdef GLOBE_POINTS
      float radius = length(gl_PointCoord - 0.5) * 2.0;
      if (radius > 1.0) discard;
      alpha *= exp(-radius * radius * 3.0);
    #endif
    vec3 color = mix(uColor, vec3(0.894, 0.153, 0.173), step(0.94, vSeed) * uAccent);
    gl_FragColor = vec4(color * (1.0 + uGlow * 0.5), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
const rimVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-p.xyz);
    gl_Position = projectionMatrix * p;
  }
`;
const rimFragment = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 3.0);
    gl_FragColor = vec4(uColor, rim * uOpacity * (0.12 + uGlow * 0.18));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* oxlint-disable react/react-compiler -- R3F requires imperative ref/uniform mutations inside useFrame; React never renders from this state. */
function Globe({ runtime, controls, onReady, onUnavailable }: SceneProps) {
  'use no memo'; // R3F owns these mutable GPU resources and per-frame refs.
  const group = useRef<THREE.Group>(null);
  const { gl, invalidate, viewport, size } = useThree();
  const motion = useRef({ idle: 0, scroll: 0, ready: false });
  const readyFrame = useRef(0);
  const resources = useMemo(() => {
    const uniforms = {
      uExplosion: { value: 0 }, uDpr: { value: 1 },
      uColor: { value: new THREE.Color('#E6EBF1') }, uOpacity: { value: 1 },
      uGlow: { value: controls.glowStrength },
    };
    const material = (points: boolean, lift: number, brightness: number, pointSize = 1, accent = 0, color = '#E6EBF1') => new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uColor: { value: new THREE.Color(color) }, uLift: { value: lift }, uBrightness: { value: brightness }, uPointSize: { value: pointSize }, uAccent: { value: accent } },
      vertexShader, fragmentShader,
      defines: points ? { GLOBE_POINTS: '' } : {},
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return {
      ...makeEarthGeometry(controls.particleCount),
      coastMaterial: material(false, 0.5, controls.outlineBrightness, 1, 0, '#E4272C'),
      borderMaterial: material(false, 0.8, controls.outlineBrightness * 0.32, 1, 0, '#E4272C'),
      landMaterial: material(true, 0.35, 1.05, 1.35, 0, '#E4272C'),
      cityMaterial: material(true, 1.25, controls.cityLightIntensity, 2.8, 1),
      uniforms,
      rimGeometry: new THREE.SphereGeometry(0.995, 48, 32),
      core: new THREE.MeshBasicMaterial({ color: '#030305', transparent: true }),
      rim: new THREE.ShaderMaterial({
        vertexShader: rimVertex, fragmentShader: rimFragment,
        uniforms: { uColor: uniforms.uColor, uGlow: uniforms.uGlow, uOpacity: { value: 1 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      }),
    };
  }, [controls.particleCount, controls.glowStrength, controls.cityLightIntensity, controls.outlineBrightness]);

  useEffect(() => {
    const state = runtime.current;
    state.invalidate = invalidate;
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', lost);
    const previousShaderError = gl.debug.onShaderError;
    gl.debug.onShaderError = () => onUnavailable();
    invalidate();
    return () => {
      state.invalidate = () => {};
      cancelAnimationFrame(readyFrame.current);
      canvas.removeEventListener('webglcontextlost', lost);
      gl.debug.onShaderError = previousShaderError;
    };
  }, [gl, invalidate, runtime, onUnavailable]);

  useEffect(() => () => {
    [resources.land, resources.coast, resources.borders, resources.cities, resources.rimGeometry].forEach((geometry) => geometry.dispose());
    [resources.coastMaterial, resources.borderMaterial, resources.landMaterial, resources.cityMaterial, resources.rim, resources.core].forEach((material) => material.dispose());
  }, [resources]);

  useFrame((_, frameDelta) => {
    if (!group.current) return;
    const state = runtime.current;
    const delta = Math.min(frameDelta, 0.05);
    const target = state.reducedMotion ? 0 : state.scrollProgress;
    motion.current.scroll = !motion.current.ready || !state.active || state.reducedMotion
      ? target : advanceGlobeScroll(motion.current.scroll, target, delta);
    const scroll = getGlobeScrollState(motion.current.scroll);
    if (state.active && !state.reducedMotion) {
      motion.current.idle += controls.rotationSpeed * delta * (1 + motion.current.scroll * 0.8);
    }
    const worldPerPixel = viewport.height / size.height;
    group.current.position.set(0, 0, 0);
    group.current.rotation.set(-0.16, 0.44 + motion.current.idle + scroll.rotation, -0.1);
    group.current.scale.setScalar(state.layout.diameter * worldPerPixel * 0.5 * scroll.scale);
    resources.uniforms.uExplosion.value = scroll.explosion * controls.expansionDistance;
    resources.uniforms.uOpacity.value = scroll.opacity;
    resources.uniforms.uDpr.value = gl.getPixelRatio();
    resources.rim.uniforms.uOpacity.value = scroll.opacity;
    resources.core.opacity = scroll.opacity;
    if (!motion.current.ready) {
      motion.current.ready = true;
      // useFrame runs before the draw. Reveal only after that draw has had
      // a paint opportunity, including when reduced motion stops the loop.
      readyFrame.current = requestAnimationFrame(() => {
        readyFrame.current = requestAnimationFrame(onReady);
      });
    }
    if (state.active && !state.reducedMotion && scroll.opacity > 0.001) {
      // One display-synchronised loop owns rotation and expansion. No timer
      // interleaves lower-rate frames with scroll-triggered frames.
      invalidate();
    }
  });

  return (
    <group ref={group} dispose={null}>
      <mesh geometry={resources.rimGeometry} material={resources.core} renderOrder={-1} frustumCulled={false} />
      <mesh geometry={resources.rimGeometry} material={resources.rim} frustumCulled={false} />
      <lineSegments geometry={resources.coast} material={resources.coastMaterial} frustumCulled={false} />
      <lineSegments geometry={resources.borders} material={resources.borderMaterial} frustumCulled={false} />
      <points geometry={resources.land} material={resources.landMaterial} frustumCulled={false} />
      <points geometry={resources.cities} material={resources.cityMaterial} frustumCulled={false} />
    </group>
  );
}

/* oxlint-enable react/react-compiler */

export default function GlobeScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 7], fov: 38, near: 0.1, far: 50 }}
      dpr={[1, props.controls.maxPixelRatio]}
      frameloop="demand"
      resize={{ scroll: false, offsetSize: true }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      fallback={null}
    >
      <Globe {...props} />
    </Canvas>
  );
}
