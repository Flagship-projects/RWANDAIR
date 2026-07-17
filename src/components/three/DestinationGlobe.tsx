"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { destinations, type Destination } from "@/lib/data";

const RADIUS = 2.15;

function toVector(lat: number, lon: number, r = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ----------------------- sample land mask into dot cloud ------------------ */

function useLandPoints() {
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = "/assets/globe/earth-water.png";
    img.onload = () => {
      const cw = 600;
      const ch = 300;
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, cw, ch);
      const data = ctx.getImageData(0, 0, cw, ch).data;

      const N = 26000; // fibonacci samples over the sphere
      const golden = Math.PI * (3 - Math.sqrt(5));
      const pts: number[] = [];
      const r = RADIUS + 0.015;

      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2; // 1 .. -1
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const x = Math.cos(theta) * ring;
        const z = Math.sin(theta) * ring;

        const lat = Math.asin(y) * (180 / Math.PI);
        const lon = Math.atan2(z, x) * (180 / Math.PI);

        // equirectangular UV -> mask pixel
        const u = (lon + 180) / 360;
        const v = (90 - lat) / 180;
        const px = Math.min(cw - 1, Math.max(0, Math.floor(u * cw)));
        const py = Math.min(ch - 1, Math.max(0, Math.floor(v * ch)));
        const brightness = data[(py * cw + px) * 4];

        // land = dark in this mask
        if (brightness < 100) {
          const p = toVector(lat, lon, r);
          pts.push(p.x, p.y, p.z);
        }
      }
      if (!cancelled) setPositions(new Float32Array(pts));
    };
    return () => {
      cancelled = true;
    };
  }, []);

  return positions;
}

/* --------------------------- round sprite for dots ------------------------ */

function useDotTexture() {
  return useMemo(() => {
    const s = 64;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.55, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
    ctx.fill();
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);
}

/* ------------------------------ atmosphere glow --------------------------- */

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color("#2a8fe0") } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(uColor, 1.0) * intensity;
          }
        `,
      }),
    []
  );
  return (
    <mesh material={material}>
      <sphereGeometry args={[RADIUS * 1.22, 48, 48]} />
    </mesh>
  );
}

/* ---------------------------------- globe --------------------------------- */

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState<Destination | null>(null);
  const hub = destinations.find((d) => d.hub)!;
  const hubPos = useMemo(() => toVector(hub.lat, hub.lon), [hub]);
  const landPositions = useLandPoints();
  const dotTexture = useDotTexture();

  // Start with the hub (Kigali, centre of Africa) facing the camera, then drift
  // very slowly. A Y-rotation of -(lon + 90)° brings that longitude to the front.
  const initialRotY = -(hub.lon + 90) * (Math.PI / 180);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.014;
  });

  return (
    <group ref={groupRef} rotation={[0.22, initialRotY, 0.1]}>
      {/* ocean sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#013a72"
          emissive="#01213f"
          emissiveIntensity={0.6}
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* land dots */}
      {landPositions && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[landPositions, 3]}
              count={landPositions.length / 3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            sizeAttenuation
            map={dotTexture}
            alphaTest={0.4}
            transparent
            color="#aede8c"
            depthWrite
          />
        </points>
      )}

      <Atmosphere />

      {/* routes + destination markers */}
      {destinations.map((d) => {
        const pos = toVector(d.lat, d.lon);
        const isHub = !!d.hub;
        const isActive = active?.code === d.code;
        return (
          <group key={d.code}>
            {!isHub && (
              <QuadraticBezierLine
                start={hubPos.toArray()}
                end={pos.toArray()}
                mid={pos
                  .clone()
                  .add(hubPos)
                  .multiplyScalar(0.5)
                  .normalize()
                  .multiplyScalar(RADIUS + 0.32)
                  .toArray()}
                color={isActive ? "#f7c623" : "#8fd0f5"}
                lineWidth={isActive ? 2 : 0.8}
                transparent
                opacity={isActive ? 0.95 : 0.4}
              />
            )}
            <mesh
              position={pos}
              onPointerOver={(e) => {
                e.stopPropagation();
                setActive(d);
              }}
              onPointerOut={() => setActive((cur) => (cur?.code === d.code ? null : cur))}
            >
              <sphereGeometry args={[isHub ? 0.055 : 0.03, 16, 16]} />
              <meshBasicMaterial color={isHub ? "#f7c623" : "#ffffff"} />
            </mesh>
            {isActive && (
              <Html position={pos} center distanceFactor={6.5} className="pointer-events-none">
                <div className="whitespace-nowrap rounded-md border border-line bg-white px-3 py-1.5 text-[11px] uppercase tracking-wideish text-ink shadow-lg">
                  {d.city}, {d.country}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function DestinationGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  // On touch devices, one-finger drag-to-rotate would swallow vertical page
  // scroll (a scroll-trap). There we disable manual rotation and let the globe
  // auto-spin as a self-running showpiece; desktop keeps full drag control.
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[620px] lg:aspect-auto lg:h-[560px]">
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0.2, 10], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 3, 5]} intensity={1.6} color="#eaf4ff" />
        <directionalLight position={[-6, -2, -4]} intensity={0.35} color="#2a8fe0" />
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={!coarse}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.7}
          rotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
