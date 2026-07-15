"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A parallax starfield for the hero's night-to-dawn sky. Stars concentrate in
 * the upper (still-dark) sky and fade out toward the warm horizon, twinkle on
 * their own phase, and drift/lean toward the cursor for depth. Purely
 * procedural — no textures, no borrowed imagery.
 *
 * The frameloop is gated to when the hero is on screen (mirrors the globe) so
 * it never burns cycles once you've scrolled past.
 */

const STAR_COUNT = 1400;

function Stars() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);
    const bright = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const x = (Math.random() - 0.5) * 18;
      // bias upward: more stars high in the sky, fewer near the horizon
      const y = -2 + Math.pow(Math.random(), 0.65) * 9;
      const z = -1 - Math.random() * 7;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      scales[i] = 0.5 + Math.random() * 1.8;
      phases[i] = Math.random();
      // fade stars out toward the (bright, dawn) lower sky
      const yFade = THREE.MathUtils.clamp((y + 1.5) / 6, 0, 1);
      bright[i] = (0.25 + Math.random() * 0.75) * (0.15 + yFade * 0.85);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));

    const u = {
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
    };
    return { geometry: g, uniforms: u };
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    if (groupRef.current) {
      // slow constant drift + easing lean toward the cursor (parallax)
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        pointer.current.x * -0.9,
        0.03
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        pointer.current.y * -0.5,
        0.03
      );
      groupRef.current.rotation.z += delta * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            attribute float aScale;
            attribute float aPhase;
            attribute float aBright;
            uniform float uSize;
            uniform float uPixelRatio;
            varying float vBright;
            varying float vPhase;
            void main() {
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mv;
              gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mv.z, 0.1));
              vBright = aBright;
              vPhase = aPhase;
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying float vBright;
            varying float vPhase;
            void main() {
              vec2 c = gl_PointCoord - 0.5;
              float d = length(c);
              if (d > 0.5) discard;
              float mask = smoothstep(0.5, 0.0, d);
              float tw = 0.55 + 0.45 * sin(uTime * 1.6 + vPhase * 6.2831);
              // most stars cool white; a scattering warm/gold near the dawn
              vec3 cool = vec3(0.82, 0.9, 1.0);
              vec3 warm = vec3(1.0, 0.86, 0.62);
              vec3 col = mix(cool, warm, step(0.82, fract(vPhase * 3.17)));
              gl_FragColor = vec4(col, mask * vBright * tw);
            }
          `}
        />
      </points>
    </group>
  );
}

export function SkyField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={inView && !reduced ? "always" : "never"}
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 2]}
      >
        <Stars />
      </Canvas>
    </div>
  );
}
