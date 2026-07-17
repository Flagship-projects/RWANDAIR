"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { ensureGsapRegistered } from "@/lib/motion";
import { destinations } from "@/lib/data";

/**
 * "Above the Clouds" — a bright, daytime cinematic hero.
 *
 * LOADING (unchanged): the visitor opens the page already in flight — a
 * brilliant blue sky, volumetric sun and god-rays overhead, a photographic sea
 * of clouds below, and RwandAir's A330 flying in from the sun-side as the
 * clouds settle.
 *
 * SCROLLING (the flight): the section PINS and a single scrubbed master
 * timeline plays a choreographed, cinematic flight over ~2.6 screen-heights.
 * The jet moves naturally through distinct beats — throttle up, bank and cut
 * through a cloud, then climb toward the horizon and settle into the distance —
 * while every cloud deck streams past at its own speed and in the opposite
 * direction (deep parallax). Scroll down = flying forward; scroll back up plays
 * the exact same weave in reverse, perfectly smooth, because it is all one
 * scrubbed timeline. The headline hands the stage to the pure flight early.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  const atmosRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const sunCoreRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const wispARef = useRef<HTMLDivElement>(null);
  const wispBRef = useRef<HTMLDivElement>(null);

  const planePathRef = useRef<HTMLDivElement>(null);
  const planeIntroRef = useRef<HTMLDivElement>(null);
  const planeBobRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ======================================================================
         INTRO — emerge into the light (kept from the original loading beat)
         ====================================================================== */
      const lines = titleRef.current?.querySelectorAll(".hero-line-inner");
      gsap.fromTo(lines ?? [], { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.1, delay: 0.5 });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.1, stagger: 0.09 });

      gsap.fromTo(
        sunRef.current,
        { yPercent: reduced ? 0 : -18, opacity: 0, scale: 0.9 },
        { yPercent: 0, opacity: 1, scale: 1, duration: reduced ? 0.6 : 2.6, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(raysRef.current, { opacity: 0 }, { opacity: 1, duration: 2.6, ease: "power2.out", delay: 0.6 });

      gsap.fromTo(seaRef.current, { opacity: 0, yPercent: reduced ? 0 : 10, scale: 1.08 }, { opacity: 1, yPercent: 0, scale: 1, duration: reduced ? 0.6 : 2.4, ease: "power2.out", delay: 0.2 });
      gsap.fromTo([cloudFarRef.current, cloudMidRef.current], { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.out", delay: 0.4, stagger: 0.2 });

      // the aircraft flies in from the sun-side
      gsap.fromTo(
        planeIntroRef.current,
        { xPercent: reduced ? 0 : 26, yPercent: reduced ? 0 : -8, opacity: 0 },
        { xPercent: 0, yPercent: 0, opacity: 1, duration: reduced ? 0.6 : 2.2, ease: "power3.out", delay: 0.4 }
      );

      if (reduced) return;

      /* ======================================================================
         CONTINUOUS LIFE — subtle ambient breathing (runs under everything)
         Idle drift rides `x` (px) so the scroll timeline can own `xPercent`
         on the same elements without ever fighting for a property.
         ====================================================================== */
      gsap.to(sunCoreRef.current, { scale: 1.09, opacity: 0.92, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(raysRef.current, { rotation: 8, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(raysRef.current, { opacity: 0.6, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(planeBobRef.current, { y: 18, rotation: -1.1, duration: 4.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(cloudFarRef.current, { x: -26, duration: 34, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(cloudMidRef.current, { x: 34, duration: 24, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(seaRef.current, { x: -18, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });

      /* ======================================================================
         THE FLIGHT — one pinned, scrubbed master timeline (0 → 1)
         Every layer is placed on this single timeline, so forward and reverse
         are guaranteed to be perfectly continuous. Eases inside the timeline
         give each move its own natural accel/decel while scroll stays linear.
         ====================================================================== */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=260%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* --- the aircraft: three beats, always reading as forward flight --------
         Beat A (0 → .30)  throttle up — eases forward-right, noses up, swells a touch
         Beat B (.30 → .64) banks and cuts down through a passing cloud deck
         Beat C (.64 → 1)  climbs toward the horizon and recedes into the distance */
      tl.to(planePathRef.current, { xPercent: 7, yPercent: -3, rotation: -2, scale: 1.05, ease: "power1.inOut", duration: 0.3 }, 0)
        .to(planePathRef.current, { xPercent: 17, yPercent: 5, rotation: 2.2, scale: 1.0, ease: "sine.inOut", duration: 0.34 }, 0.3)
        .to(planePathRef.current, { xPercent: 29, yPercent: -22, rotation: -3, scale: 0.62, ease: "power2.inOut", duration: 0.36 }, 0.64);

      /* --- sun: lifts and softens, drifting to the sun-side --- */
      tl.to(sunRef.current, { xPercent: 7, yPercent: -16, opacity: 0.55, duration: 1 }, 0);

      /* --- far deck (deep): slow, drifts LEFT against the jet, barely swells --- */
      tl.to(cloudFarRef.current, { xPercent: -5, yPercent: 7, scale: 1.14, opacity: 0.5, ease: "sine.inOut", duration: 1 }, 0);

      /* --- sea of clouds: the horizon sinks away below as we climb --- */
      tl.to(seaRef.current, { xPercent: -8, yPercent: 30, scale: 1.36, opacity: 0.9, ease: "power1.in", duration: 1 }, 0);

      /* --- mid deck (around the jet): rushes down-and-left, swells, blows past --- */
      tl.to(cloudMidRef.current, { xPercent: -16, yPercent: 24, scale: 1.85, opacity: 0.4, ease: "power1.in", duration: 0.64 }, 0)
        .to(cloudMidRef.current, { xPercent: -28, yPercent: 42, scale: 2.35, opacity: 0, ease: "power1.out", duration: 0.36 }, 0.64);

      /* --- foreground wisp A: streaks in and blows past the lens (the "cut
             through a cloud" moment), sweeping left as the jet pushes right --- */
      tl.fromTo(
        wispARef.current,
        { opacity: 0, scale: 1.15, xPercent: 14, yPercent: -6 },
        { opacity: 0.85, scale: 1.9, xPercent: -10, yPercent: 5, ease: "sine.in", duration: 0.34 },
        0.22
      ).to(wispARef.current, { opacity: 0, scale: 2.9, xPercent: -30, yPercent: 14, ease: "power1.out", duration: 0.3 }, 0.56);

      /* --- foreground wisp B: a second, slower pass later for depth/richness --- */
      tl.fromTo(
        wispBRef.current,
        { opacity: 0, scale: 1.2, xPercent: 10, yPercent: 4 },
        { opacity: 0.6, scale: 2.1, xPercent: -12, yPercent: -4, ease: "sine.in", duration: 0.36 },
        0.44
      ).to(wispBRef.current, { opacity: 0, scale: 3.1, xPercent: -28, yPercent: -12, ease: "power1.out", duration: 0.2 }, 0.8);

      /* --- atmosphere breathes forward a touch --- */
      tl.to(atmosRef.current, { yPercent: 3, scale: 1.08, duration: 1 }, 0);

      /* --- copy hands the stage to the flight early --- */
      tl.to([contentRef.current, statsRef.current], { yPercent: -14, opacity: 0, ease: "power2.in", duration: 0.26 }, 0);
      tl.to(scrollHintRef.current, { opacity: 0, ease: "power1.in", duration: 0.1 }, 0);
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%,rgba(255,255,255,0.85) 0%,rgba(255,250,235,0.42) 22%,rgba(255,244,214,0.14) 42%,rgba(255,244,214,0) 62%)",
            }}
          />
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
        <div ref={seaRef} className="absolute inset-x-0 bottom-0 z-[2] h-[68%] will-change-transform">
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
      <div ref={planePathRef} className="absolute inset-0 z-[5] will-change-transform">
        <div ref={planeIntroRef} className="absolute inset-0 opacity-0 will-change-transform">
          <div ref={planeBobRef} className="absolute left-1/2 top-[24%] aspect-[3520/1125] w-[80vw] max-w-[940px] -translate-x-1/2 will-change-transform sm:top-[22%]">
            {/* soft haze glow so the jet reads against the bright sky */}
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(58% 46% at 50% 52%,rgba(3,26,58,0.16),rgba(3,26,58,0) 72%)" }}
            />
            <Image
              src="/assets/aircraft/rwandair-transparent.png"
              alt="RwandAir Airbus A330 in flight"
              fill
              priority
              sizes="80vw"
              className="object-contain drop-shadow-[0_30px_60px_rgba(3,26,58,0.28)]"
            />
          </div>
        </div>
      </div>

      {/* ================= foreground volumetric wisps (screen-blended) ================= */}
      <div ref={wispARef} className="pointer-events-none absolute inset-0 z-[6] opacity-0 mix-blend-screen will-change-transform">
        <div className="absolute inset-[-14%] blur-[3px]">
          <Image src="/assets/sky/cloud-wisp.png" alt="" fill sizes="150vw" className="scale-[1.4] object-cover" />
        </div>
      </div>
      <div ref={wispBRef} className="pointer-events-none absolute inset-0 z-[6] opacity-0 mix-blend-screen will-change-transform">
        <div className="absolute inset-[-18%] -scale-x-100 blur-[6px]">
          <Image src="/assets/sky/cloud-wisp-2.png" alt="" fill sizes="160vw" className="scale-[1.7] object-cover" />
        </div>
      </div>

      {/* ================= legibility scrim (soft, keeps the sky bright) ================= */}
      <div
        className="pointer-events-none absolute inset-0 z-[7]"
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
      <div ref={statsRef} className="hero-fade absolute bottom-8 right-gutter z-10 hidden flex-col items-end gap-2 text-right text-fluid-xs uppercase tracking-wideish text-white/75 opacity-0 drop-shadow-[0_1px_10px_rgba(3,26,58,0.5)] sm:flex">
        <span>{destinations.length} destinations</span>
        <span>3 continents</span>
      </div>

      {/* ================= scroll hint ================= */}
      <div ref={scrollHintRef} className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 lg:flex">
        <span className="text-[10px] uppercase tracking-wideish text-white/70">Scroll to fly</span>
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
