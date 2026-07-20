"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { FlightScene } from "@/components/three/FlightScene";

/**
 * Chapter 3 — Into the Sky.
 *
 * The centrepiece: a real, scroll-driven climb through shader-built cloud banks
 * ({@link FlightScene}), craning from sunrise to golden-hour cruise. A single
 * `progressRef` is written by one scrubbed timeline and read every frame in the
 * scene, so nothing re-renders on scroll. The DOM layer keeps the flight data
 * as instrument readouts, not cards — altitude, heading, ground speed — and two
 * quiet lines surface at the breakthrough and at cruise.
 */
const BEATS: { in: number; out: number | null; kicker: string; line: JSX.Element }[] = [
  {
    in: 0.14,
    out: 0.42,
    kicker: "Breaking through",
    line: (
      <>
        The last cloud falls away, and the sky <span className="italic">opens.</span>
      </>
    ),
  },
  {
    in: 0.6,
    out: null,
    kicker: "Cruise",
    line: (
      <>
        Thirty-nine thousand feet <span className="italic text-gold-300">above the continent.</span>
      </>
    ),
  },
];

export function SkywardIntoSky() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const altRef = useRef<HTMLSpanElement>(null);
  const hdgRef = useRef<HTMLSpanElement>(null);
  const spdRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "25%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".sky-beat", root);
      const CIRC = 2 * Math.PI * 26;
      if (arcRef.current) {
        arcRef.current.style.strokeDasharray = String(CIRC);
        arcRef.current.style.strokeDashoffset = String(CIRC);
      }

      if (prefersReduced) {
        beats.forEach((b, i) => gsap.set(b, { opacity: i === beats.length - 1 ? 1 : 0 }));
        if (altRef.current) altRef.current.textContent = "39,000";
        if (hdgRef.current) hdgRef.current.textContent = "158";
        if (spdRef.current) spdRef.current.textContent = "560";
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            if (altRef.current)
              altRef.current.textContent = (Math.round((p * 39000) / 100) * 100).toLocaleString("en-US");
            if (hdgRef.current) hdgRef.current.textContent = String(Math.round(112 + p * 46)).padStart(3, "0");
            if (spdRef.current) spdRef.current.textContent = String(Math.round(p * 560));
            if (arcRef.current) arcRef.current.style.strokeDashoffset = String(CIRC * (1 - p));
          },
        },
      });

      beats.forEach((b, i) => {
        const c = BEATS[i];
        tl.fromTo(b, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.05 }, c.in);
        if (c.out !== null) tl.to(b, { opacity: 0, yPercent: -8, duration: 0.05 }, c.out);
      });

      // instruments live through the flight
      tl.fromTo(".sky-hud", { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.06).to(
        ".sky-hud",
        { opacity: 0, duration: 0.06 },
        0.9
      );
      // edge feathers into the chapters above and below
      tl.fromTo(".sky-topfade", { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0);
      tl.fromTo(".sky-botfade", { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.86);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="skyward-2"
      data-skyward-chapter="2"
      className="relative h-[640vh] bg-[#0a3a76]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          {inView && !reduced ? (
            <Canvas
              camera={{ position: [0, 0.2, 9], fov: 42, near: 0.1, far: 400 }}
              gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
              dpr={[1, 2]}
            >
              <FlightScene progressRef={progressRef} />
            </Canvas>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,#04102b 0%,#0a3a76 30%,#1c7ccb 56%,#79c0ef 80%,#bcdcf3 100%)",
              }}
            />
          )}
        </div>

        {/* legibility scrim */}
        <div
          className="pointer-events-none absolute inset-0 z-[10]"
          style={{
            background:
              "radial-gradient(130% 90% at 22% 88%,rgba(3,18,45,0.5) 0%,rgba(3,18,45,0.1) 42%,rgba(3,18,45,0) 66%)",
          }}
          aria-hidden
        />

        {/* narrative beats */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {BEATS.map((b, i) => (
            <div
              key={i}
              className="sky-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0"
            >
              <p className="mb-5 text-fluid-xs uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">
                {b.kicker}
              </p>
              <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,18,45,0.55)]">
                {b.line}
              </h2>
            </div>
          ))}
        </div>

        {/* instruments — flight data as cockpit readouts, not cards */}
        <div className="sky-hud pointer-events-none absolute inset-x-gutter bottom-8 z-20 hidden items-end justify-between opacity-0 md:flex">
          {/* altitude + heading, dial-framed */}
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <circle
                  ref={arcRef}
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="#ffe07a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-300" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4.5 20l7.5-4 7.5 4L12 2Z" />
                </svg>
              </span>
            </div>
            <div className="leading-none text-white">
              <div className="font-display text-lg font-light tabular-nums">
                HDG <span ref={hdgRef}>112</span>°
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/55">Kigali → the world</div>
            </div>
          </div>

          {/* altitude + ground speed */}
          <div className="flex items-end gap-8 text-right text-white">
            <div className="leading-none">
              <div className="font-display text-3xl font-light tabular-nums drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">
                <span ref={spdRef}>0</span>
                <span className="ml-1 text-fluid-xs uppercase tracking-[0.2em] text-white/60">kt</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/55">Ground speed</div>
            </div>
            <div className="leading-none">
              <div className="font-display text-3xl font-light tabular-nums drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">
                <span ref={altRef}>0</span>
                <span className="ml-1 text-fluid-xs uppercase tracking-[0.2em] text-white/60">ft</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/55">Altitude</div>
            </div>
          </div>
        </div>

        {/* edge feathers */}
        <div className="sky-topfade pointer-events-none absolute inset-x-0 top-0 z-[30] h-[36vh] bg-gradient-to-b from-[#050b18] to-transparent" aria-hidden />
        <div className="sky-botfade pointer-events-none absolute inset-x-0 bottom-0 z-[30] h-[46vh] bg-gradient-to-t from-[#050b18] to-transparent opacity-0" aria-hidden />
      </div>
    </section>
  );
}
