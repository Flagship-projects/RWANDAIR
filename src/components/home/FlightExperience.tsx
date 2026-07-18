"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { FlightScene } from "@/components/three/FlightScene";
import { destinations } from "@/lib/data";

/**
 * "The Ascent" — the cinematic flight experience.
 *
 * The evolved sibling of {@link CloudCorridor}: a real, scroll-driven 3D flight
 * that begins the instant the visitor finishes booking. The 3D half
 * ({@link FlightScene}) owns a genuine camera craning and climbing through
 * shader-built cloud banks while the RwandAir A330 leads the flight and banks
 * into its turn; this component owns the tall scroll track, the single
 * scroll→progress driver, and the crisp DOM storytelling layer on top.
 *
 * The story now plays in five chapters across the climb:
 *
 *   1. DEPARTURE    sunrise; "the journey begins" as the jet enters
 *   2. THE REVEAL   the mid cloud decks part (a `uOpen` gap in the shader)
 *                   and the destination names surface through the gap
 *   3. CRUISE       brilliant daylight, thirty-nine thousand feet
 *   4. THE NETWORK  a constellation draws itself — Kigali at the hub,
 *                   gold route arcs reaching out across the continent
 *   5. ARRIVAL      golden hour floods the scene for the closing line
 *
 * One `progressRef` (0 → 1) is written by a single scrubbed timeline and read
 * every frame inside the scene — nothing re-renders on scroll. The pin is CSS
 * `position: sticky` (never a ScrollTrigger pin) so it stays clear of the
 * global pin/scroll bookkeeping the globe and fleet sequence rely on.
 */

/* Chapter windows on the 0→1 scroll span: rise at `in`, clear at `out`. */
const CHAPTERS: { in: number; out: number | null }[] = [
  { in: 0.05, out: 0.19 }, // departure
  { in: 0.26, out: 0.4 }, // the reveal (matches the shader's uOpen band)
  { in: 0.46, out: 0.58 }, // cruise
  { in: 0.64, out: 0.79 }, // the network
  { in: 0.86, out: null }, // arrival — holds to the end
];

/* Marquee horizons surfaced in the reveal — not the departure city itself. */
const REVEAL_CODES = ["LHR", "CDG", "DXB", "JNB", "LOS", "NBO"];

/* The route constellation (viewBox 0 0 100 62). Kigali is the hub. */
const HUB = { x: 48, y: 44 };
const NET = [
  { label: "London", x: 18, y: 8 },
  { label: "Dubai", x: 88, y: 12 },
  { label: "Doha", x: 76, y: 22 },
  { label: "Lagos", x: 22, y: 28 },
  { label: "Accra", x: 11, y: 40 },
  { label: "Nairobi", x: 66, y: 36 },
  { label: "Johannesburg", x: 56, y: 58 },
];

/** A gently bowed arc from the hub out to a node. */
function arcPath(x: number, y: number) {
  const cx = (HUB.x + x) / 2 + (y - HUB.y) * 0.2;
  const cy = (HUB.y + y) / 2 + (HUB.x - x) * 0.2;
  return `M ${HUB.x} ${HUB.y} Q ${cx} ${cy} ${x} ${y}`;
}

export function FlightExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  // DOM overlay refs
  const hudRef = useRef<HTMLDivElement>(null);
  const altValueRef = useRef<HTMLSpanElement>(null);
  const altFillRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const topFadeRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);

  // Only mount/run the WebGL canvas while the section is near the viewport.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "20%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".flight-beat", root);

      if (prefersReduced) {
        // Calm still: closing chapter visible, HUD parked at cruise, no motion.
        beats.forEach((el, i) => gsap.set(el, { opacity: i === beats.length - 1 ? 1 : 0 }));
        gsap.set(hudRef.current, { opacity: 1 });
        gsap.set([topFadeRef.current, bottomFadeRef.current], { opacity: 0 });
        if (altValueRef.current) altValueRef.current.textContent = "39,000";
        if (altFillRef.current) altFillRef.current.style.transform = "scaleY(1)";
        return;
      }

      // Route arcs: prime the self-drawing stroke.
      const arcs = Array.from(root.querySelectorAll<SVGPathElement>(".net-path"));
      arcs.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      /* --- one master scrubbed timeline: positions are scroll fractions --- */
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
            // altitude readout climbs 0 → 39,000 ft
            const ft = Math.round((p * 39000) / 100) * 100;
            if (altValueRef.current) altValueRef.current.textContent = ft.toLocaleString("en-US");
            if (altFillRef.current) altFillRef.current.style.transform = `scaleY(${p})`;
            if (headingRef.current) headingRef.current.textContent = String(Math.round(112 + p * 46)).padStart(3, "0");
          },
        },
      });

      // chapters — each rises, holds, and clears (the last one holds on)
      beats.forEach((el, i) => {
        const c = CHAPTERS[i];
        if (!c) return;
        tl.fromTo(el, { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 0.05 }, c.in);
        if (c.out !== null) tl.to(el, { opacity: 0, yPercent: -6, duration: 0.05 }, c.out);
      });

      // the reveal — destination chips surface through the parted clouds
      tl.fromTo(
        ".flight-chip",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.04, stagger: 0.008 },
        0.28
      );

      // the network — arcs draw out from Kigali, nodes and labels light up
      arcs.forEach((p, i) => {
        tl.to(p, { strokeDashoffset: 0, duration: 0.07 }, 0.65 + i * 0.006);
      });
      tl.fromTo(".net-node", { opacity: 0 }, { opacity: 1, duration: 0.03, stagger: 0.005 }, 0.665);
      tl.fromTo(".net-hub", { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.645);

      // HUD lives through the flight
      tl.fromTo(hudRef.current, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.05).to(
        hudRef.current,
        { opacity: 0, duration: 0.05 },
        0.9
      );

      // arrival — a warm glow floods up for the closing line
      tl.fromTo(glowRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.08 }, 0.84);

      // edge feathers into the paper above and the CloudCorridor below
      tl.fromTo(topFadeRef.current, { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0);
      tl.fromTo(bottomFadeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.88);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-[720vh] bg-[#0a3a76]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ===================== the 3D flight ===================== */}
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
            // reduced-motion / off-screen still: a calm graded sky
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,#04102b 0%,#0a3a76 30%,#1c7ccb 56%,#79c0ef 80%,#bcdcf3 100%)",
              }}
            />
          )}
        </div>

        {/* legibility scrim — keeps type readable over the bright sky */}
        <div
          className="pointer-events-none absolute inset-0 z-[10]"
          style={{ background: "radial-gradient(130% 90% at 20% 92%,rgba(3,18,45,0.5) 0%,rgba(3,18,45,0.12) 40%,rgba(3,18,45,0) 66%)" }}
          aria-hidden
        />

        {/* golden-hour arrival glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-[12] opacity-0"
          style={{ background: "radial-gradient(120% 80% at 70% 78%,rgba(255,202,122,0.4) 0%,rgba(255,202,122,0.12) 38%,rgba(255,202,122,0) 64%)" }}
          aria-hidden
        />

        {/* ===================== the five chapters ===================== */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* 1 — departure */}
          <div className="flight-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0">
            <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-white/85 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">Now boarding</p>
            <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,18,45,0.55)]">
              The journey begins the moment you <span className="italic">leave the ground.</span>
            </h2>
          </div>

          {/* 2 — the reveal: clouds part, destinations surface */}
          <div className="flight-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0">
            <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-white/85 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">The reveal</p>
            <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,18,45,0.55)]">
              The clouds part, and a <span className="italic">continent</span> appears.
            </h2>
            <div className="mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
              {destinations.filter((d) => REVEAL_CODES.includes(d.code)).map((d) => (
                <span
                  key={d.code}
                  className="flight-chip rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-fluid-xs uppercase tracking-wideish text-white/90 opacity-0 backdrop-blur-md"
                >
                  {d.city}
                </span>
              ))}
            </div>
          </div>

          {/* 3 — cruise */}
          <div className="flight-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0">
            <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-white/85 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">Cruising</p>
            <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,18,45,0.55)]">
              Thirty-nine thousand feet <span className="italic">above Africa.</span>
            </h2>
          </div>

          {/* 4 — the network: a constellation draws itself from Kigali */}
          <div className="flight-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0">
            <svg className="w-full max-w-3xl" viewBox="0 0 100 62" aria-hidden>
              <defs>
                <linearGradient id="netGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f7c623" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffe07a" />
                </linearGradient>
              </defs>
              {NET.map((n) => (
                <g key={n.label}>
                  <path
                    className="net-path"
                    d={arcPath(n.x, n.y)}
                    fill="none"
                    stroke="url(#netGrad)"
                    strokeWidth="0.3"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 3px rgba(247,198,35,0.6))" }}
                  />
                  <g className="net-node opacity-0">
                    <circle cx={n.x} cy={n.y} r="0.8" fill="#ffe07a" />
                    <text
                      x={n.x > 60 ? n.x - 2 : n.x + 2}
                      y={n.y + 0.9}
                      textAnchor={n.x > 60 ? "end" : "start"}
                      fontSize="2.6"
                      letterSpacing="0.35"
                      fill="rgba(255,255,255,0.85)"
                      className="uppercase"
                    >
                      {n.label}
                    </text>
                  </g>
                </g>
              ))}
              <g className="net-hub opacity-0">
                <circle cx={HUB.x} cy={HUB.y} r="1.4" fill="#ffffff" />
                <circle cx={HUB.x} cy={HUB.y} r="2.6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
                <text x={HUB.x} y={HUB.y + 5.2} textAnchor="middle" fontSize="3" letterSpacing="0.5" fill="#ffffff" className="uppercase">
                  Kigali
                </text>
              </g>
            </svg>
            <p className="mt-7 text-fluid-xs uppercase tracking-wideish text-white/80 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">The network</p>
            <h2 className="mt-3 max-w-3xl font-display text-fluid-h3 font-light leading-[1.05] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,18,45,0.55)]">
              From Kigali, the <span className="italic">continent connects.</span>
            </h2>
          </div>

          {/* 5 — arrival, golden hour */}
          <div className="flight-beat absolute inset-0 flex flex-col items-center justify-center px-gutter text-center opacity-0">
            <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-gold-300/90 drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">Golden hour</p>
            <h2 className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.96] tracking-tightest text-white drop-shadow-[0_2px_34px_rgba(0,0,0,0.55)]">
              Where every mile is the{" "}
              <span className="italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">dream</span>.
            </h2>
          </div>
        </div>

        {/* ===================== navigation HUD ===================== */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-x-gutter bottom-8 z-20 hidden items-end justify-between opacity-0 md:flex"
          aria-hidden
        >
          {/* heading / nav readout, framed like a cockpit instrument */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 backdrop-blur-md">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-300" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4.5 20l7.5-4 7.5 4L12 2Z" />
            </svg>
            <div className="leading-none">
              <div className="font-display text-lg font-light tabular-nums tracking-tight text-white">
                HDG <span ref={headingRef}>112</span>°
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-wideish text-white/55">Kigali → the world</div>
            </div>
          </div>

          {/* altitude tape */}
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-[3px] overflow-hidden rounded-full bg-white/15">
              <div ref={altFillRef} className="absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 bg-gradient-to-t from-gold-500 to-gold-300" />
            </div>
            <div className="text-right leading-none text-white">
              <div className="font-display text-3xl font-light tabular-nums tracking-tight drop-shadow-[0_1px_12px_rgba(3,18,45,0.6)]">
                <span ref={altValueRef}>0</span>
                <span className="ml-1 text-fluid-xs uppercase tracking-wideish text-white/60">ft</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-wideish text-white/55">Altitude</div>
            </div>
          </div>
        </div>

        {/* ===================== edge feathers ===================== */}
        <div
          ref={topFadeRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-[30] h-[38vh] bg-gradient-to-b from-paper to-transparent"
          aria-hidden
        />
        <div
          ref={bottomFadeRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[30] h-[45vh] bg-gradient-to-t from-[#bcdcf3] to-transparent opacity-0"
          aria-hidden
        />

        {/* faint atmospheric grain */}
        <svg className="pointer-events-none absolute inset-0 z-[32] h-full w-full opacity-[0.05] mix-blend-overlay" aria-hidden>
          <filter id="ascent-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ascent-grain)" />
        </svg>
      </div>
    </div>
  );
}
