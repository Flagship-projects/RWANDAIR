"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero A330 as a bright-daylight "clay" render. The model's original texture
 * is an auto-generated photo-patchwork (unusable), so we discard all its
 * materials and re-skin the geometry in a single clean pearl-white physical
 * material, lit entirely by a procedural *daytime, above-the-clouds*
 * environment (bright white sun key, saturated sky-blue fill and a strong white
 * cloud bounce from below — the sea of clouds reflecting up onto the belly).
 * The result reads as an intentional premium product silhouette catching the
 * same midday light as the scene around it.
 *
 * Orientation is unknown up-front (auto-generated model), so the base rotation
 * lives in ONE tunable block below — nudge these three numbers to reframe.
 */

const MODEL = "/assets/models/rwandair-a330.glb";

/* ----- tunable framing (adjust if the plane faces the wrong way) ----- */
const BASE_ROT_X = -0.05; // pitch (nose up/down)
const BASE_ROT_Y = -0.72; // yaw (3/4 view) — flip sign to face the other way
const BASE_ROT_Z = 0.12; // bank (roll) — a gentle climbing bank
const MODEL_SCALE = 1.15;

function Plane() {
  const ref = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF(MODEL);

  // Clone and re-skin: strip the broken texture, apply clean studio material.
  const model = useMemo(() => {
    const s = scene.clone(true);
    const skin = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#eef2f8"),
      metalness: 0.3,
      roughness: 0.34,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.15,
    });
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = skin;
        m.castShadow = false;
        m.receiveShadow = false;
      }
    });
    return s;
  }, [scene]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // gentle idle bank/pitch + easing lean toward the cursor (3D parallax)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, BASE_ROT_Z + pointer.current.x * 0.16 + Math.sin(t * 0.5) * 0.025, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, BASE_ROT_X + pointer.current.y * 0.1, 0.05);
    g.position.y = Math.sin(t * 0.6) * 0.035;
  });

  return (
    <group ref={ref} rotation={[BASE_ROT_X, BASE_ROT_Y, BASE_ROT_Z]} scale={MODEL_SCALE}>
      <primitive object={model} />
    </group>
  );
}

function DaylightStudio() {
  // Reflections + image-based light for a bright, high-noon sky above a sea of
  // clouds. Not shown as background (canvas stays transparent) — it only lights
  // and reflects on the fuselage.
  return (
    <Environment resolution={256}>
      {/* brilliant white sun key, high on the sun-side — sculpts the lit top */}
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[2, 3.5, -1]} scale={[7, 7, 1]} />
      {/* cool, restrained sky fill from the left */}
      <Lightformer form="rect" intensity={0.7} color="#6ba9e6" position={[-4, 1.5, 1]} scale={[5, 6, 1]} />
      {/* warm rim from the right (sun-side edge) */}
      <Lightformer form="rect" intensity={1.9} color="#fff1d2" position={[4, 1.2, 2]} scale={[3, 4, 1]} />
      {/* deep-blue underside so the belly falls into shadow for readable form */}
      <Lightformer form="rect" intensity={0.5} color="#0e2c4d" rotation-x={Math.PI / 2} position={[0, -3, 0]} scale={[9, 9, 1]} />
    </Environment>
  );
}

export function HeroPlane() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "10%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0.35, 4.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        {/* crisp white sun for a defined highlight terminator, over the IBL */}
        <directionalLight position={[2.5, 3.5, 2]} intensity={3} color="#fffaf0" />
        {/* cool sky fill — keeps shadows blue, but restrained so form reads */}
        <directionalLight position={[-3, 0.5, -2]} intensity={0.35} color="#7fb0e6" />
        <ambientLight intensity={0.22} />
        <Suspense fallback={null}>
          <Plane />
          <DaylightStudio />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL);
