"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { destinations, type Destination } from "@/lib/data";

const RADIUS = 2.4;

function toVector(lat: number, lon: number, r = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState<Destination | null>(null);
  const hub = destinations.find((d) => d.hub)!;
  const hubPos = useMemo(() => toVector(hub.lat, hub.lon), [hub]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#0d1f38"
          emissive="#12233c"
          emissiveIntensity={0.4}
          roughness={0.9}
          metalness={0.05}
          wireframe={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS + 0.004, 48, 48]} />
        <meshBasicMaterial color="#3d6fa8" wireframe transparent opacity={0.12} />
      </mesh>

      {destinations.map((d) => {
        const pos = toVector(d.lat, d.lon);
        const isHub = !!d.hub;
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
                  .multiplyScalar(RADIUS + 0.75)
                  .toArray()}
                color={active?.code === d.code ? "#e8c896" : "#c9954f"}
                lineWidth={active?.code === d.code ? 1.6 : 0.6}
                transparent
                opacity={active?.code === d.code ? 0.9 : 0.28}
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
              <sphereGeometry args={[isHub ? 0.045 : 0.03, 12, 12]} />
              <meshBasicMaterial color={isHub ? "#e8c896" : "#f7f4ee"} />
            </mesh>
            {active?.code === d.code && (
              <Html position={pos} center distanceFactor={7} className="pointer-events-none">
                <div className="whitespace-nowrap rounded-md border border-line bg-ink/90 px-3 py-1.5 text-xs uppercase tracking-wideish text-paper shadow-lg">
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
  return (
    <div className="relative aspect-square w-full max-w-[560px] mx-auto lg:aspect-auto lg:h-[520px]">
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 42 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 3, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.6}
          rotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}
