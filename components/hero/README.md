# Hero globe

`HeroGlobe` is an absolutely positioned enhancement of the existing `.hero`. It measures the untransformed navigation and headline offsets to fit its sphere into the open area. Text and controls keep their existing layout and motion above the transparent canvas.

```tsx
<HeroGlobe controls={{ rotationSpeed: 0.12, expansionDistance: 0.24, particleCount: 18000, glowStrength: 0.45, cityLightIntensity: 0.85, outlineBrightness: 0.65 }} />
```

Defaults live in `globe-controls.ts`. Rotation speed is radians/second and expansion distance is in globe radii. `maxPixelRatio` caps render resolution. `GlobeRuntime.scrollProgress` is the normalized 0–1 scroll input; `getGlobeScrollState` maps it directly to expansion, scale, opacity and additional rotation without time-dependent accumulation.

The scroll trigger starts at the hero's top and completes over 90% of its measured height. It adds no pin or document height. Natural Earth coastlines, country borders, land points and cities lift radially in separate shells. Each shell keeps geographic angles unchanged, so outlines remain recognisable. Six batched draw calls (no per-city meshes), shared uniforms, compact buffer geometry and no textures or postprocessing keep rendering lightweight. The dark globe occludes the far hemisphere and an atmospheric rim remains visible.

The globe is decorative and does not intercept touch, pointer, or keyboard input. It rotates slowly on its own and expands with scroll position. There are no tap pulses, manual rotation handlers, or inertia calculations. Reduced motion disables automatic rotation and scroll expansion. Rendering stops when the globe is offscreen, when the document is hidden, and at the fully faded end of the sequence.

The canvas stays transparent until its first complete draw has had a paint opportunity, then fades in over 700 ms. The geographic SVG is reserved for renderer failures and fades in only after its image loads; it is not shown as an interim loading stage. Reduced motion skips the fade. ResizeObserver tracks layout and R3F tracks canvas size/DPR; ScrollTrigger refreshes its measured bounds. Listeners, observers, the trigger and owned GPU resources are released on unmount.

Validation: `node --test components/hero/globe-controls.test.mjs` checks bounded/reversible scroll mapping . TypeScript and the component lint checks cover integration. Verify native vertical swipes, automatic rotation, background/resume and reduced motion on a device.

References: [R3F Canvas](https://r3f.docs.pmnd.rs/api/canvas), [on-demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Three.js disposal](https://threejs.org/manual/en/how-to-dispose-of-objects.html).


Geography is derived from Natural Earth 50m land and admin-0 land boundary lines, plus 110m populated places, downloaded 2026-09-14 from the official nvkelso/natural-earth-vector repository. Natural Earth is public domain; boundaries use its default de facto representation. This is a stylised geographic point cloud, not satellite elevation or measured night-light intensity. All continents, including Antarctica, are included. Small islands and borders are simplified for mobile readability.

`earth-data.json` stores coordinates in hundredths of a degree. `earth-geometry.ts` projects them onto a unit sphere without stretching a flat map. The 18,000 default land points are drawn from a deterministic equal-area sample masked against the real land polygons. The same data generates `public/assets/earth/earth-fallback.svg`. `scripts/build-earth.py` reproduces both assets using Pillow and the three source GeoJSON files listed in the provenance file. No geographic API requests occur at runtime.

The latitude/longitude grid is intentionally omitted; only real geographic outlines and land points define the Earth surface.
