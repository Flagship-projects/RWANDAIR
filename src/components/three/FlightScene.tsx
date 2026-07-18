"use client";

import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The 3D half of the cinematic flight. A single scroll value (0 → 1, supplied
 * by the parent via `progressRef`) craning-and-climbs a real camera through
 * layered, shader-driven cloud banks — a pure first-person flight. Depth and
 * parallax are genuine: the camera flies *through* the world, so near clouds
 * sweep the lens and distant ones drift.
 *
 * Lighting is graded along four keyframes — sunrise → brilliant cruise →
 * thin-air stratosphere → golden-hour arrival — pushed into every material's
 * uniforms each frame, so the whole scene changes colour and mood as you
 * climb. Stars only surface at the top of the climb, when the sky above goes
 * to deep navy, then dim again for the arrival.
 *
 * Everything reads `progressRef.current` inside `useFrame`; nothing re-renders
 * on scroll, so it stays fluid. The frameloop is gated by the parent Canvas.
 */

/* ------------------------------------------------------------------ *
 * Lighting / colour keyframes — the three moods of the climb.
 * Each is [skyTop, skyHorizon, sun, cloudLit, cloudShadow].
 * ------------------------------------------------------------------ */
type Grade = { top: THREE.Color; horizon: THREE.Color; sun: THREE.Color; lit: THREE.Color; shadow: THREE.Color; sunY: number };
const K: Grade[] = [
  {
    // sunrise, low and warm — the departure
    top: new THREE.Color("#123a63"),
    horizon: new THREE.Color("#ffb173"),
    sun: new THREE.Color("#ffd39a"),
    lit: new THREE.Color("#ffdfc0"),
    shadow: new THREE.Color("#5f6f96"),
    sunY: -0.12,
  },
  {
    // breaking into brilliant daylight cruise
    top: new THREE.Color("#0a63b4"),
    horizon: new THREE.Color("#cfeaff"),
    sun: new THREE.Color("#ffffff"),
    lit: new THREE.Color("#ffffff"),
    shadow: new THREE.Color("#8fb6df"),
    sunY: 0.18,
  },
  {
    // thin air, deep navy above, cool and clear — top of climb
    top: new THREE.Color("#04102b"),
    horizon: new THREE.Color("#79c0ef"),
    sun: new THREE.Color("#eaf4ff"),
    lit: new THREE.Color("#dcecff"),
    shadow: new THREE.Color("#2a4f7d"),
    sunY: 0.42,
  },
  {
    // golden-hour arrival — the sun sinks back toward the horizon and the
    // whole sky warms for the final beat
    top: new THREE.Color("#13294f"),
    horizon: new THREE.Color("#ffca7a"),
    sun: new THREE.Color("#ffd9a0"),
    lit: new THREE.Color("#ffe6c4"),
    shadow: new THREE.Color("#4a5f8c"),
    sunY: 0.06,
  },
];
// Scroll positions of the four moods above.
const K_STOPS = [0, 0.4, 0.75, 1];

/** Sample the keyframed grade at t∈[0,1] into the provided target colours. */
function grade(t: number, out: Grade) {
  let i = 0;
  while (i < K_STOPS.length - 2 && t > K_STOPS[i + 1]) i++;
  const lt = THREE.MathUtils.clamp((t - K_STOPS[i]) / (K_STOPS[i + 1] - K_STOPS[i]), 0, 1);
  const a = K[i];
  const b = K[i + 1];
  out.top.copy(a.top).lerp(b.top, lt);
  out.horizon.copy(a.horizon).lerp(b.horizon, lt);
  out.sun.copy(a.sun).lerp(b.sun, lt);
  out.lit.copy(a.lit).lerp(b.lit, lt);
  out.shadow.copy(a.shadow).lerp(b.shadow, lt);
  out.sunY = THREE.MathUtils.lerp(a.sunY, b.sunY, lt);
  return out;
}

/* ------------------------------------------------------------------ *
 * Shared GLSL — value-noise fbm for the cloud plates.
 * ------------------------------------------------------------------ */
const NOISE = /* glsl */ `
  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.55;
    for (int i = 0; i < 5; i++){ v += a * vnoise(p); p = p * 2.02 + 11.3; a *= 0.5; }
    return v;
  }
`;

/* ---------------------------- sky backdrop ---------------------------- */
function Backdrop({ gradeRef }: { gradeRef: MutableRefObject<Grade> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#123a63") },
      uHorizon: { value: new THREE.Color("#ffb173") },
      uSun: { value: new THREE.Color("#ffd39a") },
      uSunY: { value: -0.12 },
    }),
    []
  );
  useFrame(() => {
    if (!mat.current) return;
    const g = gradeRef.current;
    (uniforms.uTop.value as THREE.Color).copy(g.top);
    (uniforms.uHorizon.value as THREE.Color).copy(g.horizon);
    (uniforms.uSun.value as THREE.Color).copy(g.sun);
    uniforms.uSunY.value = g.sunY;
  });
  // Parented to the camera so it always fills the view.
  return (
    <mesh position={[0, 0, 0]} scale={[220, 130, 1]} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uSun; uniform float uSunY;
          void main(){
            float y = vUv.y;
            // sky gradient, warm and dense near the horizon
            vec3 col = mix(uHorizon, uTop, smoothstep(0.32, 0.95, y));
            // sun glow blooming up from the horizon on the sun-side
            vec2 sunPos = vec2(0.68, 0.30 + uSunY);
            float d = distance(vec2(vUv.x, vUv.y * 0.82), vec2(sunPos.x, sunPos.y * 0.82));
            col += uSun * smoothstep(0.55, 0.0, d) * 0.9;
            col += uSun * smoothstep(0.14, 0.0, d) * 0.6;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* ---------------------------- cloud plate ---------------------------- */
type CloudDef = { pos: [number, number, number]; scale: [number, number]; seed: number; density: number; floor?: boolean; part?: boolean };

function Cloud({ def, gradeRef, progressRef }: { def: CloudDef; gradeRef: MutableRefObject<Grade>; progressRef: MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 40 },
      uSeed: { value: def.seed },
      uDensity: { value: def.density },
      uFloor: { value: def.floor ? 1 : 0 },
      uOpen: { value: 0 },
      uLit: { value: new THREE.Color("#ffffff") },
      uShadow: { value: new THREE.Color("#8fb6df") },
    }),
    [def]
  );
  useFrame((_, dt) => {
    if (!mat.current) return;
    uniforms.uTime.value += dt;
    const g = gradeRef.current;
    (uniforms.uLit.value as THREE.Color).copy(g.lit);
    (uniforms.uShadow.value as THREE.Color).copy(g.shadow);
    // "the clouds part" — mid decks open a soft gap during the reveal beat,
    // then close again as the flight cruises on
    if (def.part) {
      const p = progressRef.current;
      uniforms.uOpen.value =
        THREE.MathUtils.smoothstep(p, 0.24, 0.33) * (1 - THREE.MathUtils.smoothstep(p, 0.4, 0.5));
    }
  });
  return (
    <mesh position={def.pos} rotation={def.floor ? [-1.15, 0, 0] : [0, 0, 0]}>
      <planeGeometry args={[def.scale[0], def.scale[1]]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          ${NOISE}
          varying vec2 vUv;
          uniform float uTime; uniform float uSeed; uniform float uDensity; uniform float uFloor; uniform float uOpen;
          uniform vec3 uLit; uniform vec3 uShadow;
          void main(){
            vec2 uv = vUv * vec2(3.2, 2.2) + vec2(uSeed, uSeed * 0.6);
            uv += vec2(uTime * 0.015, uTime * 0.006);
            float n = fbm(uv);
            // soft-oval falloff so plate edges dissolve into the sky
            vec2 c = (vUv - 0.5) * vec2(1.9, 2.3);
            float edge = smoothstep(1.0, 0.15, length(c));
            float body = smoothstep(0.52 - uDensity, 0.95, n) * edge;
            // the parting: a soft gap widens from the centre of the plate,
            // ragged along the noise so it opens like weather, not a wipe
            body *= 1.0 - uOpen * smoothstep(0.95 - uOpen * 0.4, 0.05, length(c) + (n - 0.5) * 0.5);
            // vertical shade: brighter tops, cooler bellies (billowing form)
            float shade = mix(0.55, 1.0, smoothstep(0.15, 0.85, vUv.y + (n - 0.5) * 0.4));
            shade = mix(shade, 1.0, uFloor * 0.4);
            vec3 col = mix(uShadow, uLit, shade);
            float a = body * (uFloor > 0.5 ? 0.9 : 1.0);
            if (a < 0.01) discard;
            gl_FragColor = vec4(col, a);
          }
        `}
      />
    </mesh>
  );
}

function CloudField({ gradeRef, progressRef }: { gradeRef: MutableRefObject<Grade>; progressRef: MutableRefObject<number> }) {
  // A corridor of plates the camera flies through: a low sea, mid decks that
  // rush the lens at the breakthrough (and part for the reveal), and high
  // wisps near the top of climb.
  const clouds = useMemo<CloudDef[]>(
    () => [
      // sea of clouds (tilted floors) sliding beneath the flight
      { pos: [0, -7, -14], scale: [70, 44], seed: 2.1, density: 0.16, floor: true },
      { pos: [-6, -8, -34], scale: [90, 54], seed: 7.7, density: 0.14, floor: true },
      { pos: [8, -9, -56], scale: [120, 64], seed: 4.3, density: 0.12, floor: true },
      // mid decks — the ones you break through; these part for the reveal
      { pos: [-9, 1.5, -8], scale: [26, 16], seed: 9.2, density: 0.24, part: true },
      { pos: [11, 3.2, -18], scale: [30, 18], seed: 1.4, density: 0.22, part: true },
      { pos: [-13, 4.5, -28], scale: [34, 20], seed: 15.6, density: 0.2, part: true },
      { pos: [10, 6.5, -40], scale: [40, 22], seed: 3.9, density: 0.18, part: true },
      { pos: [-6, 8, -52], scale: [46, 24], seed: 21.1, density: 0.16, part: true },
      // high wisps, thin and drifting
      { pos: [4, 11, -30], scale: [40, 12], seed: 6.6, density: 0.12 },
      { pos: [-10, 13, -48], scale: [52, 14], seed: 12.3, density: 0.1 },
    ],
    []
  );
  return (
    <group>
      {clouds.map((def, i) => (
        <Cloud key={i} def={def} gradeRef={gradeRef} progressRef={progressRef} />
      ))}
    </group>
  );
}

/* ------------------------------ stars ------------------------------ */
function Stars({ gradeRef, progressRef }: { gradeRef: MutableRefObject<Grade>; progressRef: MutableRefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { geometry, uniforms } = useMemo(() => {
    const N = 900;
    const positions = new Float32Array(N * 3);
    const scales = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = 6 + Math.random() * 40; // high in the sky only
      positions[i * 3 + 2] = -20 - Math.random() * 60;
      scales[i] = 0.5 + Math.random() * 1.6;
      phases[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return {
      geometry: g,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      },
    };
  }, []);
  useFrame((_, dt) => {
    if (!mat.current) return;
    uniforms.uTime.value += dt;
    // emerge at top of climb, then dim again as the golden-hour arrival warms
    const p = progressRef.current;
    uniforms.uOpacity.value =
      THREE.MathUtils.smoothstep(p, 0.55, 0.8) * (1 - THREE.MathUtils.smoothstep(p, 0.88, 0.98) * 0.7);
  });
  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aScale; attribute float aPhase;
          uniform float uPixelRatio; varying float vPhase;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 22.0 * aScale * uPixelRatio * (1.0 / max(-mv.z, 0.1));
            vPhase = aPhase;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime; uniform float uOpacity; varying float vPhase;
          void main(){
            vec2 c = gl_PointCoord - 0.5; float d = length(c);
            if (d > 0.5) discard;
            float mask = smoothstep(0.5, 0.0, d);
            float tw = 0.55 + 0.45 * sin(uTime * 1.5 + vPhase * 6.2831);
            gl_FragColor = vec4(vec3(0.85, 0.92, 1.0), mask * tw * uOpacity);
          }
        `}
      />
    </points>
  );
}

/* --------------------------- ice particles --------------------------- */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const { geometry, uniforms } = useMemo(() => {
    const N = 240;
    const positions = new Float32Array(N * 3);
    const scales = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -Math.random() * 22;
      scales[i] = 0.4 + Math.random() * 1.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return {
      geometry: g,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      },
    };
  }, []);
  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    // parent to camera so a fine snow of ice crystals always streams past
    if (ref.current) {
      ref.current.position.copy(state.camera.position);
      ref.current.quaternion.copy(state.camera.quaternion);
    }
  });
  return (
    <points ref={ref} geometry={geometry} position={[0, 0, -6]}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aScale; uniform float uTime; uniform float uPixelRatio;
          void main(){
            vec3 p = position;
            p.x += sin(uTime * 0.5 + position.y) * 0.6;
            p.y += cos(uTime * 0.4 + position.x) * 0.5;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 8.0 * aScale * uPixelRatio * (1.0 / max(-mv.z, 0.1));
          }
        `}
        fragmentShader={/* glsl */ `
          void main(){
            vec2 c = gl_PointCoord - 0.5; float d = length(c);
            if (d > 0.5) discard;
            gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, d) * 0.5);
          }
        `}
      />
    </points>
  );
}

/* --------------------------- camera + rig --------------------------- */
function Rig({ progressRef, gradeRef, backdropRef }: { progressRef: MutableRefObject<number>; gradeRef: MutableRefObject<Grade>; backdropRef: MutableRefObject<THREE.Group | null> }) {
  const { camera } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    grade(p, gradeRef.current);

    // crane-and-climb: fly forward through the corridor while gaining altitude
    camera.position.z = THREE.MathUtils.lerp(9, -46, p);
    camera.position.y = THREE.MathUtils.lerp(0.2, 3.4, p) + Math.sin(t * 0.5) * 0.06;
    camera.position.x = Math.sin(t * 0.3) * 0.15;
    camera.lookAt(0, camera.position.y + THREE.MathUtils.lerp(0.6, 1.6, p), camera.position.z - 12);

    // backdrop follows the camera so the sky always fills the frame
    if (backdropRef.current) {
      backdropRef.current.position.set(camera.position.x, camera.position.y, camera.position.z - 60);
    }
    // key light tracks the graded sun
    if (sun.current) {
      sun.current.color.copy(gradeRef.current.sun);
      sun.current.position.set(6, 4 + gradeRef.current.sunY * 6, camera.position.z - 20);
      sun.current.intensity = 2.4 + THREE.MathUtils.smoothstep(p, 0.2, 0.6) * 1.2;
    }
  });

  return (
    <>
      <directionalLight ref={sun} position={[6, 4, -20]} intensity={2.6} color="#fff1d2" />
      <directionalLight position={[-4, 1, 6]} intensity={0.4} color="#7fb0e6" />
      <ambientLight intensity={0.35} />
    </>
  );
}

/* ------------------------------ scene ------------------------------ */
export function FlightScene({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const gradeRef = useRef<Grade>({
    top: new THREE.Color(),
    horizon: new THREE.Color(),
    sun: new THREE.Color(),
    lit: new THREE.Color(),
    shadow: new THREE.Color(),
    sunY: -0.12,
  });
  const backdropRef = useRef<THREE.Group>(null);

  return (
    <>
      <Rig progressRef={progressRef} gradeRef={gradeRef} backdropRef={backdropRef} />
      {/* backdrop lives in a camera-tracked group updated in Rig */}
      <group ref={backdropRef}>
        <Backdrop gradeRef={gradeRef} />
      </group>
      <CloudField gradeRef={gradeRef} progressRef={progressRef} />
      <Stars gradeRef={gradeRef} progressRef={progressRef} />
      <Particles />
    </>
  );
}
