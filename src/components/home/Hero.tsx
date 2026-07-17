"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { ensureGsapRegistered } from "@/lib/motion";
import { destinations } from "@/lib/data";

/**
 * "Above the Clouds" — a bright, daytime cinematic hero. The visitor opens the
 * page already in flight: a brilliant blue sky, volumetric sun and god-rays
 * overhead, a photographic sea of clouds below, and RwandAir's A330 (real
 * livery) climbing through soft cumulus that drift past the lens at several
 * depths (parallax).
 *
 * The whole scene is built to feel airborne. On load the jet flies in and the
 * clouds part; then — the Awwwards "fly through the clouds" beat — as you
 * scroll the camera pushes FORWARD: cloud layers rush toward you, swell in
 * scale and dissolve, the horizon drops away, and the jet climbs off into the
 * open sky. Uplifting from the very first frame.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  const atmosRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const sunCoreRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const skyBankRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudNearRef = useRef<HTMLDivElement>(null);

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
      /* ---------------- intro: emerge into the light ---------------- */
      const lines = titleRef.current?.querySelectorAll(".hero-line-inner");
      gsap.fromTo(lines ?? [], { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.1, delay: 0.5 });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.1, stagger: 0.09 });

      // the sun blooms into place
      gsap.fromTo(
        sunRef.current,
        { yPercent: reduced ? 0 : -18, opacity: 0, scale: 0.9 },
        { yPercent: 0, opacity: 1, scale: 1, duration: reduced ? 0.6 : 2.6, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(raysRef.current, { opacity: 0 }, { opacity: 1, duration: 2.6, ease: "power2.out", delay: 0.6 });

      // the sea of clouds settles
      gsap.fromTo(skyBankRef.current, { opacity: 0, yPercent: reduced ? 0 : 10, scale: 1.08 }, { opacity: 1, yPercent: 0, scale: 1, duration: reduced ? 0.6 : 2.4, ease: "power2.out", delay: 0.2 });
      gsap.fromTo([cloudFarRef.current, cloudMidRef.current], { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.out", delay: 0.4, stagger: 0.2 });
      // near wisps rush in, as if we've just broken through a cloud
      gsap.fromTo(
        cloudNearRef.current,
        { opacity: 0, scale: reduced ? 1 : 1.5 },
        { opacity: 1, scale: 1, duration: reduced ? 0.6 : 2.6, ease: "power3.out", delay: 0.1 }
      );

      // the aircraft flies in from the sun-side
      gsap.fromTo(
        planeIntroRef.current,
        { xPercent: reduced ? 0 : 30, yPercent: reduced ? 0 : -8, opacity: 0 },
        { xPercent: 0, yPercent: 0, opacity: 1, duration: reduced ? 0.6 : 2.2, ease: "power3.out", delay: 0.4 }
      );

      if (reduced) return;

      /* ---------------- continuous life ---------------- */
      // sun breathes; rays slowly turn and shimmer
      gsap.to(sunCoreRef.current, { scale: 1.09, opacity: 0.92, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(raysRef.current, { rotation: 8, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(raysRef.current, { opacity: 0.55, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // plane bob
      gsap.to(planeBobRef.current, { y: 20, rotation: -1.2, duration: 4.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // multi-speed cloud drift — the sense of flying forward
      gsap.to(cloudFarRef.current, { xPercent: -3, duration: 34, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(cloudMidRef.current, { xPercent: 5, duration: 22, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(cloudNearRef.current, { xPercent: -6, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(cloudNearRef.current, { scale: 1.06, duration: 12, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(skyBankRef.current, { xPercent: -2, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(scrollHintRef.current?.querySelector(".hint-line") ?? {}, {
        scaleY: 0.3,
        transformOrigin: "bottom",
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ------- scroll: fly FORWARD through the clouds (Awwwards beat) -------
         The camera pushes into the sky: every cloud layer swells toward the
         lens (scale up from centre) and dissolves, the sea of clouds and the
         horizon drop away below, and the jet climbs off into the open blue.
         Depth = each layer scales/moves at its own rate. */
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 1 } as const;
      gsap.to(atmosRef.current, { yPercent: 4, scale: 1.16, ease: "none", scrollTrigger: st });
      gsap.to(sunRef.current, { yPercent: -34, opacity: 0.45, ease: "none", scrollTrigger: st });
      // far band parts and swells
      gsap.to(cloudFarRef.current, { yPercent: -14, scale: 1.6, opacity: 0.4, ease: "none", scrollTrigger: st });
      // the sea of clouds drops away beneath us (horizon falls)
      gsap.to(skyBankRef.current, { yPercent: 42, scale: 1.7, opacity: 0.85, ease: "none", scrollTrigger: st });
      // mid clouds rush toward the lens and blow past
      gsap.to(cloudMidRef.current, { yPercent: 20, scale: 2.2, opacity: 0.5, ease: "none", scrollTrigger: st });
      // foreground wisps swell hugest and dissolve — we punch straight through
      gsap.to(cloudNearRef.current, { yPercent: -10, scale: 3.2, opacity: 0, ease: "none", scrollTrigger: st });
      // the jet leads us up and climbs off into the open sky
      gsap.to(planeScrollRef.current, { xPercent: 8, yPercent: -30, scale: 1.08, opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to(contentRef.current, { yPercent: -22, opacity: 0.04, ease: "none", scrollTrigger: st });
      gsap.to(scrollHintRef.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "10% top", scrub: true } });

      /* ---------------- cursor parallax (depth) ---------------- */
      if (!coarse) {
        const planeX = gsap.quickTo(planeMouseRef.current, "x", { duration: 1, ease: "power3.out" });
        const planeY = gsap.quickTo(planeMouseRef.current, "y", { duration: 1, ease: "power3.out" });
        const nearX = gsap.quickTo(cloudNearRef.current, "x", { duration: 0.7, ease: "power3.out" });
        const nearY = gsap.quickTo(cloudNearRef.current, "y", { duration: 0.7, ease: "power3.out" });
        const midX = gsap.quickTo(cloudMidRef.current, "x", { duration: 1.1, ease: "power3.out" });
        const sunX = gsap.quickTo(sunRef.current, "x", { duration: 1.8, ease: "power3.out" });
        function onMove(e: MouseEvent) {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          planeX(nx * 42);
          planeY(ny * 26);
          nearX(nx * -60);
          nearY(ny * -34);
          midX(nx * 28);
          sunX(nx * 14);
        }
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#bfe0f6]">
      {/* ================= bright daytime atmosphere ================= */}
      <div ref={atmosRef} className="absolute inset-0 will-change-transform">
        {/* clear-sky gradient: deep azure aloft → pale, luminous horizon */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#0a63b4 0%,#1c7ccb 20%,#3f9cdd 42%,#7bc0ec 66%,#bfe2f7 84%,#eaf6ff 100%)",
          }}
        />

        {/* volumetric sun + god-rays, high on the sun-side */}
        <div ref={sunRef} className="absolute right-[8%] top-[-18%] h-[95vh] w-[95vh] will-change-transform">
          {/* god-ray shafts */}
          <div
            ref={raysRef}
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "conic-gradient(from 195deg at 50% 40%,rgba(255,255,255,0) 0deg,rgba(255,255,255,0.30) 7deg,rgba(255,255,255,0) 15deg,rgba(255,255,255,0) 28deg,rgba(255,255,255,0.22) 38deg,rgba(255,255,255,0) 48deg,rgba(255,255,255,0) 66deg,rgba(255,255,255,0.26) 80deg,rgba(255,255,255,0) 92deg,rgba(255,255,255,0) 116deg,rgba(255,255,255,0.18) 130deg,rgba(255,255,255,0) 142deg)",
              maskImage: "radial-gradient(circle at 50% 40%,transparent 4%,#000 26%,transparent 82%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 40%,transparent 4%,#000 26%,transparent 82%)",
            }}
          />
          {/* soft warm-white bloom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%,rgba(255,255,255,0.85) 0%,rgba(255,250,235,0.42) 22%,rgba(255,244,214,0.14) 42%,rgba(255,244,214,0) 62%)",
            }}
          />
          {/* bright core */}
          <div
            ref={sunCoreRef}
            className="absolute left-1/2 top-[40%] h-[26vh] w-[26vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%,rgba(255,255,255,0.98) 0%,rgba(255,252,240,0.7) 38%,rgba(255,246,220,0) 72%)",
            }}
          />
        </div>

        {/* photographic sea of clouds below the horizon */}
        <div ref={skyBankRef} className="absolute inset-x-0 bottom-0 z-[2] h-[68%] will-change-transform">
          <div className="relative h-full w-full">
            <Image
              src="/assets/sky/sky-bank.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-bottom"
              style={{
                maskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.35) 16%,#000 42%)",
                WebkitMaskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.35) 16%,#000 42%)",
              }}
            />
          </div>
        </div>

        {/* far cloud band — small, high, slow */}
        <div ref={cloudFarRef} className="absolute inset-0 z-[3] will-change-transform">
          <div className="absolute inset-x-[-8%] top-[8%] h-[70%] opacity-70 blur-[1px]">
            <Image src="/assets/sky/clouds-2-a.png" alt="" fill sizes="120vw" className="scale-[1.15] object-cover" />
          </div>
        </div>
      </div>

      {/* ================= mid clouds (around the aircraft) ================= */}
      <div ref={cloudMidRef} className="absolute inset-0 z-[4] will-change-transform">
        <div className="absolute inset-0 opacity-90 blur-[2px]">
          <Image src="/assets/sky/clouds-1-a.png" alt="" fill sizes="130vw" className="scale-[1.25] object-cover" />
        </div>
      </div>

      {/* ================= the aircraft (real RwandAir livery) ================= */}
      <div ref={planeScrollRef} className="absolute inset-0 z-[5] will-change-transform">
        <div ref={planeIntroRef} className="absolute inset-0 opacity-0 will-change-transform">
          <div ref={planeMouseRef} className="absolute inset-0 will-change-transform">
            <div ref={planeBobRef} className="absolute left-1/2 top-[7%] aspect-[2/1] w-[86vw] max-w-[860px] -translate-x-1/2 will-change-transform sm:left-[58%] sm:top-[4%]">
              {/* soft ground/haze glow so the jet reads against the bright sky */}
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(52% 42% at 50% 52%,rgba(3,26,58,0.16),rgba(3,26,58,0) 72%)" }}
              />
              <Image
                src="/assets/aircraft/takeoff-cutout.png"
                alt="RwandAir Airbus A330 climbing above the clouds"
                fill
                priority
                sizes="86vw"
                className="object-contain drop-shadow-[0_30px_60px_rgba(3,26,58,0.28)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= foreground wisps (in front of everything) ================= */}
      <div ref={cloudNearRef} className="pointer-events-none absolute inset-0 z-[6] will-change-transform">
        <div className="absolute inset-[-6%] opacity-95 blur-[6px]">
          <Image src="/assets/sky/clouds-2-a.png" alt="" fill sizes="140vw" className="scale-[1.5] object-cover" />
        </div>
      </div>

      {/* ================= legibility scrim (soft, keeps the sky bright) ================= */}
      <div
        className="absolute inset-0 z-[7]"
        style={{ background: "radial-gradient(130% 95% at 12% 100%,rgba(3,26,58,0.52) 0%,rgba(3,26,58,0.12) 42%,rgba(3,26,58,0) 66%)" }}
      />

      {/* ================= content ================= */}
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-28 pt-28 sm:pb-32">
        <p className="hero-fade mb-5 flex items-center gap-3 text-fluid-xs uppercase tracking-wideish text-white opacity-0 drop-shadow-[0_1px_10px_rgba(3,26,58,0.5)]">
          <span className="h-px w-8 bg-gold-400" /> Rwanda&rsquo;s national carrier
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.94] tracking-tightest text-white drop-shadow-[0_2px_28px_rgba(3,26,58,0.45)]"
        >
          <span className="reveal-mask block overflow-hidden"><span className="hero-line-inner block">Fly the</span></span>
          <span className="reveal-mask block overflow-hidden">
            <span className="hero-line-inner block italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
              Dream
            </span>
          </span>
          <span className="reveal-mask block overflow-hidden"><span className="hero-line-inner block">of Africa.</span></span>
        </h1>
        <p className="hero-fade mt-8 max-w-md text-fluid-lg font-light leading-relaxed text-white/90 opacity-0 drop-shadow-[0_1px_14px_rgba(3,26,58,0.45)]">
          From the heart of Rwanda to the world &mdash; rise above with Africa&rsquo;s premium airline.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap items-center gap-5 opacity-0">
          <Button href="#book">Book a flight</Button>
          <Button href="#destinations" variant="ghost" className="!text-white hover:!text-gold-300">
            Explore the network ↓
          </Button>
        </div>
      </div>

      {/* ================= stats ================= */}
      <div className="hero-fade absolute bottom-8 right-gutter z-10 hidden flex-col items-end gap-2 text-right text-fluid-xs uppercase tracking-wideish text-white/75 opacity-0 drop-shadow-[0_1px_10px_rgba(3,26,58,0.5)] sm:flex">
        <span>{destinations.length} destinations</span>
        <span>3 continents</span>
      </div>

      {/* ================= scroll hint ================= */}
      <div ref={scrollHintRef} className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 lg:flex">
        <span className="text-[10px] uppercase tracking-wideish text-white/70">Scroll</span>
        <span className="hint-line block h-8 w-px origin-top bg-white/60" />
      </div>

      {/* ================= faint atmospheric grain ================= */}
      <svg className="pointer-events-none absolute inset-0 z-[8] h-full w-full opacity-[0.04] mix-blend-overlay" aria-hidden>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </section>
  );
}
