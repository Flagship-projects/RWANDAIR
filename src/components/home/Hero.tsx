"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { ensureGsapRegistered } from "@/lib/motion";
import { destinations } from "@/lib/data";

// 3D layers — client-only, gated frameloop.
const SkyField = dynamic(() => import("@/components/three/SkyField").then((m) => m.SkyField), {
  ssr: false,
});
const HeroPlane = dynamic(() => import("@/components/three/HeroPlane").then((m) => m.HeroPlane), {
  ssr: false,
});

/**
 * "Dawn over Africa" — a fully procedural cinematic hero. No stock sky or cloud
 * photography: the atmosphere is built from brand-coloured gradients, a
 * breathing sun bloom (RwandAir's sun motif rising over the horizon),
 * SVG-turbulence haze and soft gradient cloud banks, with a 3D parallax
 * starfield overhead. The A330 flies into the dawn, trailing contrails, and the
 * whole scene climbs and recedes as you scroll.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [render3D, setRender3D] = useState(false);

  useEffect(() => {
    setRender3D(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const atmosRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const sunCoreRef = useRef<HTMLDivElement>(null);
  const hazeFarRef = useRef<HTMLDivElement>(null);
  const hazeNearRef = useRef<HTMLDivElement>(null);
  const bankScrollRef = useRef<HTMLDivElement>(null);
  const bankDriftRef = useRef<HTMLDivElement>(null);

  const planeScrollRef = useRef<HTMLDivElement>(null);
  const planeIntroRef = useRef<HTMLDivElement>(null);
  const planeMouseRef = useRef<HTMLDivElement>(null);
  const planeBobRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      /* ---------------- intro ---------------- */
      const lines = titleRef.current?.querySelectorAll(".hero-line-inner");
      gsap.fromTo(lines ?? [], { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.1, delay: 0.4 });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1, stagger: 0.09 });
      // the sun rises into place
      gsap.fromTo(
        sunRef.current,
        { yPercent: reduced ? 0 : 34, opacity: 0, scale: 0.92 },
        { yPercent: 0, opacity: 1, scale: 1, duration: reduced ? 0.6 : 2.4, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo([hazeFarRef.current, hazeNearRef.current, bankDriftRef.current], { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power2.out", delay: 0.3, stagger: 0.15 });
      gsap.fromTo(
        planeIntroRef.current,
        { xPercent: reduced ? 0 : 26, yPercent: reduced ? 0 : -6, opacity: 0 },
        { xPercent: 0, yPercent: 0, opacity: 1, duration: reduced ? 0.6 : 2, ease: "power3.out", delay: 0.3 }
      );

      if (reduced) return;

      /* ---------------- continuous life ---------------- */
      // sun breathes
      gsap.to(sunCoreRef.current, { scale: 1.08, opacity: 0.9, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // plane bob
      gsap.to(planeBobRef.current, { y: 18, rotation: -1.3, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // haze drifts at two speeds
      gsap.to(hazeFarRef.current, { xPercent: -4, duration: 26, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(hazeNearRef.current, { xPercent: 5, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(bankDriftRef.current, { xPercent: -3, duration: 30, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(scrollHintRef.current?.querySelector(".hint-line") ?? {}, {
        scaleY: 0.3,
        transformOrigin: "bottom",
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ---------------- scroll: camera climbs, plane departs ---------------- */
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 1 } as const;
      gsap.to(atmosRef.current, { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: st });
      gsap.to(sunRef.current, { yPercent: 24, opacity: 0.5, ease: "none", scrollTrigger: st });
      gsap.to(planeScrollRef.current, { xPercent: -16, yPercent: -46, scale: 0.68, opacity: 0.2, ease: "none", scrollTrigger: st });
      gsap.to(bankScrollRef.current, { scale: 1.9, yPercent: 22, opacity: 0.95, ease: "none", scrollTrigger: st });
      gsap.to(hazeFarRef.current, { yPercent: 12, ease: "none", scrollTrigger: st });
      gsap.to(contentRef.current, { yPercent: -28, opacity: 0.1, ease: "none", scrollTrigger: st });
      gsap.to(scrollHintRef.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "10% top", scrub: true } });

      /* ---------------- cursor parallax (depth) ---------------- */
      if (!coarse) {
        const planeX = gsap.quickTo(planeMouseRef.current, "x", { duration: 1, ease: "power3.out" });
        const planeY = gsap.quickTo(planeMouseRef.current, "y", { duration: 1, ease: "power3.out" });
        const hazeX = gsap.quickTo(hazeNearRef.current, "x", { duration: 0.8, ease: "power3.out" });
        const sunX = gsap.quickTo(sunRef.current, "x", { duration: 1.6, ease: "power3.out" });
        function onMove(e: MouseEvent) {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          planeX(nx * 48);
          planeY(ny * 30);
          hazeX(nx * -36);
          sunX(nx * 16);
        }
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#000b1e]">
      {/* ================= procedural atmosphere ================= */}
      <div ref={atmosRef} className="absolute inset-0 will-change-transform">
        {/* dawn gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#000914 0%,#00112a 20%,#001b3d 42%,#00305f 64%,#0a4f86 82%,#1f79b0 100%)",
          }}
        />

        {/* 3D parallax starfield (upper sky) */}
        <SkyField />

        {/* rising sun bloom — RwandAir's sun motif */}
        <div ref={sunRef} className="absolute bottom-[-14%] left-[42%] h-[80vh] w-[80vh] -translate-x-1/2 will-change-transform">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%,rgba(255,232,170,0.60) 0%,rgba(247,198,35,0.34) 26%,rgba(232,140,0,0.16) 46%,rgba(232,120,0,0) 66%)",
            }}
          />
          <div
            ref={sunCoreRef}
            className="absolute left-1/2 top-1/2 h-[34vh] w-[34vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%,rgba(255,246,222,0.95) 0%,rgba(255,224,140,0.7) 34%,rgba(247,198,35,0) 70%)",
            }}
          />
        </div>

        {/* warm horizon wash */}
        <div
          className="absolute inset-x-0 bottom-0 h-[52%]"
          style={{
            background:
              "linear-gradient(180deg,rgba(232,140,0,0) 0%,rgba(232,150,40,0.12) 55%,rgba(247,198,35,0.22) 100%)",
          }}
        />

        {/* SVG-turbulence haze — original, procedural clouds */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <filter id="hero-haze-far" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={7} stitchTiles="stitch" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 0.92  0 0 0 0 0.74  0 0 0 0.7 -0.28"
              />
            </filter>
            <filter id="hero-haze-near" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.032" numOctaves={5} seed={19} stitchTiles="stitch" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 -0.34"
              />
            </filter>
          </defs>
          {/* far, warm haze band near the horizon */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <g ref={hazeFarRef as any} style={{ opacity: 0 }}>
            <rect x="-10%" y="46%" width="120%" height="60%" filter="url(#hero-haze-far)" opacity={0.55} />
          </g>
          {/* nearer, cooler wisps */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <g ref={hazeNearRef as any} style={{ opacity: 0 }}>
            <rect x="-10%" y="34%" width="120%" height="52%" filter="url(#hero-haze-near)" opacity={0.4} />
          </g>
        </svg>

        {/* soft gradient cloud banks (guaranteed-smooth base) */}
        <div ref={bankScrollRef} className="absolute inset-0 z-[2] will-change-transform">
          <div ref={bankDriftRef} className="absolute inset-0 opacity-0 will-change-transform">
            <div
              className="absolute bottom-[-6%] left-[-8%] h-[44%] w-[70%] blur-2xl"
              style={{ background: "radial-gradient(60% 60% at 40% 60%,rgba(255,244,220,0.5),rgba(255,244,220,0) 72%)" }}
            />
            <div
              className="absolute bottom-[-10%] right-[-10%] h-[46%] w-[72%] blur-2xl"
              style={{ background: "radial-gradient(60% 60% at 60% 60%,rgba(214,232,255,0.42),rgba(214,232,255,0) 74%)" }}
            />
            <div
              className="absolute bottom-[-4%] left-[30%] h-[36%] w-[52%] blur-2xl"
              style={{ background: "radial-gradient(55% 55% at 50% 60%,rgba(255,224,150,0.4),rgba(255,224,150,0) 72%)" }}
            />
          </div>
        </div>
      </div>

      {/* ================= the aircraft ================= */}
      <div ref={planeScrollRef} className="absolute inset-0 z-[3] will-change-transform">
        <div ref={planeIntroRef} className="absolute inset-0 opacity-0 will-change-transform">
          <div ref={planeMouseRef} className="absolute inset-0 will-change-transform">
            {render3D ? (
              /* 3D studio-clay A330 — env-lit, banks toward the cursor */
              <div ref={planeBobRef} className="absolute left-1/2 top-[4%] aspect-[16/9] w-[98vw] max-w-[1200px] -translate-x-1/2 will-change-transform sm:left-[56%] sm:top-[2%]">
                <HeroPlane />
              </div>
            ) : (
              /* reduced-motion / fallback — flat cutout */
              <div ref={planeBobRef} className="absolute left-1/2 top-[10%] w-[86vw] max-w-[980px] -translate-x-1/2 will-change-transform sm:left-[56%]">
                <div className="pointer-events-none absolute right-[6%] top-[42%] h-[2.2%] w-[62%] -translate-y-1/2 rounded-full blur-md"
                  style={{ background: "linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.5) 82%,rgba(255,255,255,0.7) 100%)" }} />
                <Image
                  src="/assets/aircraft/plane.png"
                  alt="RwandAir Airbus A330 in flight"
                  width={2086}
                  height={585}
                  priority
                  className="relative h-auto w-full drop-shadow-[0_38px_54px_rgba(0,12,32,0.5)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= legibility scrims ================= */}
      <div className="absolute inset-0 z-[4] bg-gradient-to-t from-[#000b1e]/85 via-[#00112a]/20 to-transparent" />
      <div
        className="absolute inset-0 z-[4]"
        style={{ background: "radial-gradient(120% 85% at 10% 100%,rgba(0,9,20,0.72) 0%,rgba(0,9,20,0) 54%)" }}
      />

      {/* ================= content ================= */}
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-28 pt-28 sm:pb-32">
        <p className="hero-fade mb-5 flex items-center gap-3 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">
          <span className="h-px w-8 bg-gold-400/60" /> Rwanda&rsquo;s national carrier
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.94] tracking-tightest text-white drop-shadow-[0_2px_24px_rgba(0,16,42,0.5)]"
        >
          <span className="reveal-mask block"><span className="hero-line-inner block">Fly the</span></span>
          <span className="reveal-mask block">
            <span className="hero-line-inner block italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Dream
            </span>
          </span>
          <span className="reveal-mask block"><span className="hero-line-inner block">of Africa.</span></span>
        </h1>
        <div className="hero-fade mt-10 flex flex-wrap items-center gap-5 opacity-0">
          <Button href="#book">Book a flight</Button>
          <Button href="#destinations" variant="ghost" className="!text-white hover:!text-gold-400">
            Explore the network ↓
          </Button>
        </div>
      </div>

      {/* ================= stats ================= */}
      <div className="hero-fade absolute bottom-8 right-gutter z-10 hidden flex-col items-end gap-2 text-right text-fluid-xs uppercase tracking-wideish text-white/60 opacity-0 sm:flex">
        <span>{destinations.length} destinations</span>
        <span>3 continents</span>
      </div>

      {/* ================= scroll hint ================= */}
      <div ref={scrollHintRef} className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 lg:flex">
        <span className="text-[10px] uppercase tracking-wideish text-white/60">Scroll</span>
        <span className="hint-line block h-8 w-px origin-top bg-white/50" />
      </div>

      {/* ================= film grain ================= */}
      <svg className="pointer-events-none absolute inset-0 z-[5] h-full w-full opacity-[0.06] mix-blend-overlay" aria-hidden>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </section>
  );
}
