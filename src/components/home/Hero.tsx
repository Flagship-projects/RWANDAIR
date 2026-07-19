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

      gsap.fromTo(seaRef.current, { opacity: 0, yPercent: reduced ? 0 : 6, scale: 1.04 }, { opacity: 1, yPercent: 0, scale: 1, duration: reduced ? 0.6 : 2.4, ease: "power2.out", delay: 0.2 });

      // the aircraft flies in from the left, nose forward — the start of one
      // continuous left-to-right journey that the scroll then carries across.
      gsap.fromTo(
        planeIntroRef.current,
        { xPercent: reduced ? 0 : -24, yPercent: reduced ? 0 : -6, opacity: 0 },
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
      // Only the FOREGROUND wisps drift at idle — the sky and the sea of clouds
      // hold perfectly still, like a real horizon from a cruising aircraft.
      gsap.to(wispARef.current, { x: -44, duration: 30, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(wispBRef.current, { x: 30, duration: 38, ease: "sine.inOut", yoyo: true, repeat: -1 });

      /* ======================================================================
         THE FLIGHT — one screen, one scrubbed timeline (0 → 1)
         No pin: the hero is a single viewport tall. Over one screen of scroll
         the jet cruises steadily LEFT → RIGHT across the sky while every cloud
         deck slides the other way at its own speed (parallax), so it reads as
         forward flight. Scroll up simply flies the same path in reverse.
         ====================================================================== */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      /* --- STABLE HORIZON: the background (sky, sun, sea of clouds) never
             translates. It gets one whisper of zoom for depth, and that is
             all. Every sensation of movement comes from the aircraft and the
             two foreground wisp layers streaming past the lens. --- */

      /* --- the aircraft: a steady left-to-right cruise, gentle climb + bank --- */
      tl.to(planePathRef.current, { xPercent: 34, yPercent: -6, rotation: -2, scale: 1.02, duration: 1 }, 0);

      /* --- background: subtle zoom only — no x/y drift anywhere --- */
      tl.to(atmosRef.current, { scale: 1.035, duration: 1 }, 0);

      /* --- sun: softens a touch as we pass, but stays anchored --- */
      tl.to(sunRef.current, { opacity: 0.75, duration: 1 }, 0);

      /* --- foreground wisp A: the near layer — visible at rest, sweeps left --- */
      tl.fromTo(
        wispARef.current,
        { opacity: 0.3, xPercent: 18 },
        { opacity: 0.5, xPercent: -40, ease: "sine.inOut", duration: 1 },
        0
      );

      /* --- foreground wisp B: deeper, slower, fainter — the second plane of depth --- */
      tl.fromTo(
        wispBRef.current,
        { opacity: 0.2, xPercent: 10, yPercent: 2 },
        { opacity: 0.35, xPercent: -26, yPercent: -3, ease: "sine.inOut", duration: 1 },
        0
      );

      /* --- copy hands the stage to the flight early --- */
      tl.to([contentRef.current, statsRef.current], { yPercent: -12, opacity: 0, ease: "power2.in", duration: 0.4 }, 0);
      tl.to(scrollHintRef.current, { opacity: 0, ease: "power1.in", duration: 0.15 }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#bfe0f6]">
      {/* ================= bright daytime atmosphere ================= */}
      <div ref={atmosRef} className="absolute inset-0 will-change-transform">
        {/* clear-sky gradient: deep, slightly desaturated azure aloft → pale,
            luminous horizon. Less cyan than a stock sky — reads premium, and
            lets the white aircraft and clouds carry the brightness. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#07508f 0%,#1268b8 18%,#2f8ad2 40%,#6cb4e6 62%,#b7ddf5 82%,#ecf7ff 100%)",
          }}
        />

        {/* warm sunlight wash spilling from the sun-side — ties the sky to the
            gold accents in the headline instead of leaving a pure cold blue */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 78% 10%,rgba(255,219,158,0.22) 0%,rgba(255,219,158,0.07) 40%,rgba(255,219,158,0) 68%)",
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

        {/* photographic sea of clouds — kept LOW so the upper two-thirds of the
            frame is open blue sky, like a real cruise-altitude view */}
        <div ref={seaRef} className="absolute inset-x-0 bottom-0 z-[2] h-[44%] will-change-transform">
          <div className="relative h-full w-full">
            <Image
              src="/assets/sky/sky-bank.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-bottom"
              style={{
                maskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.4) 24%,#000 52%)",
                WebkitMaskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.4) 24%,#000 52%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= the aircraft (real RwandAir livery) ================= */}
      <div ref={planePathRef} className="absolute inset-0 z-[5] will-change-transform">
        <div ref={planeIntroRef} className="absolute inset-0 opacity-0 will-change-transform">
          <div ref={planeBobRef} className="absolute left-[8%] top-[24%] aspect-[3520/1125] w-[76vw] max-w-[640px] will-change-transform sm:left-[38%] sm:top-[20%] sm:w-[54vw]">
            {/* whisper of haze so the jet reads against the bright sky — kept
                faint and tight so it never shows as a dark smudge on the clouds */}
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(48% 38% at 50% 52%,rgba(3,26,58,0.09),rgba(3,26,58,0) 68%)" }}
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
        style={{ background: "radial-gradient(120% 90% at 10% 100%,rgba(3,26,58,0.42) 0%,rgba(3,26,58,0.1) 40%,rgba(3,26,58,0) 62%)" }}
      />

      {/* ================= content ================= */}
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-28 pt-28 sm:pb-32">
        <p className="hero-fade mb-5 flex items-center gap-3 text-fluid-xs uppercase tracking-wideish text-white opacity-0 drop-shadow-[0_1px_10px_rgba(3,26,58,0.5)]">
          <span className="h-px w-8 bg-gold-400" /> Rwanda&rsquo;s national carrier
        </p>
        {/* Two lines instead of a three-word stack — a longer first line reads
            editorial rather than sing-song, and the display size gives the
            opening the presence the interior pages already have. */}
        <h1
          ref={titleRef}
          className="max-w-4xl font-display text-fluid-display font-light leading-[0.92] tracking-tightest text-white drop-shadow-[0_2px_28px_rgba(3,26,58,0.45)]"
        >
          <span className="reveal-mask block overflow-hidden">
            <span className="hero-line-inner block">
              Fly the{" "}
              <em className="bg-gradient-to-r from-[#ffe3a1] via-[#f5c15c] to-[#e2a437] bg-clip-text pr-2 italic text-transparent">
                Dream
              </em>
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
