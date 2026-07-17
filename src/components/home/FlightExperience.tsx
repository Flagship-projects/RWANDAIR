"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * "The Journey" — the new cinematic flight experience.
 *
 * This is the evolved sibling of {@link CloudCorridor}: where that section is a
 * single pinned cloud transition, this one is a full scroll-driven story that
 * picks up the instant the visitor finishes booking. It reads as an extension
 * of the hero — the same RwandAir A330 keeps climbing — and carries the eye
 * from the ground, up through a rushing cloud deck, and out into the deep-blue
 * stratosphere where the stars come out and the horizon curves.
 *
 * One tall section (~5.4 screens) holds a sticky viewport. A single scrubbed
 * master timeline choreographs everything so scrolling down flies the journey
 * forward and scrolling up plays it perfectly in reverse:
 *
 *   0.00 → departure   warm, hazy low altitude; the jet climbs in
 *   0.30 → breakthrough a cloud deck rushes the lens and whites out
 *   0.55 → cruise       brilliant blue; the sun flares; a headline holds
 *   0.80 → stratosphere deep navy above, stars emerge, the earth curves away
 *
 * As with CloudCorridor, the pin is CSS `position: sticky` (not a ScrollTrigger
 * pin) so it never touches the global pin/scroll bookkeeping the globe and
 * fleet sequence rely on. An altitude readout counts up 0 → 39,000 ft, driven
 * off the same ScrollTrigger progress.
 */
export function FlightExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  // atmosphere / lighting layers (cross-faded to change the time-of-flight)
  const gradDepartureRef = useRef<HTMLDivElement>(null);
  const gradCruiseRef = useRef<HTMLDivElement>(null);
  const gradStratoRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const sunCoreRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);

  // cloud decks
  const seaRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);
  const cloudNearRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const wispARef = useRef<HTMLDivElement>(null);
  const wispBRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // aircraft
  const planePathRef = useRef<HTMLDivElement>(null);
  const planeBobRef = useRef<HTMLDivElement>(null);

  // typography beats
  const msg1Ref = useRef<HTMLDivElement>(null);
  const msg2Ref = useRef<HTMLDivElement>(null);
  const msg3Ref = useRef<HTMLDivElement>(null);

  // HUD + edge feathers
  const hudRef = useRef<HTMLDivElement>(null);
  const altValueRef = useRef<HTMLSpanElement>(null);
  const altBarRef = useRef<HTMLSpanElement>(null);
  const topFadeRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ------------------------------------------------------------------
         Continuous ambient life — keeps drifting even while the scroll (and
         a held headline) sits still. Rides `x`/`y` (px) so the scrubbed
         timeline can own xPercent/yPercent/scale on the same nodes.
         ------------------------------------------------------------------ */
      const drifts: gsap.core.Tween[] = [];
      if (!reduced) {
        drifts.push(
          gsap.to(planeBobRef.current, { y: 16, rotation: -1, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          gsap.to(sunCoreRef.current, { scale: 1.1, opacity: 0.9, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          gsap.to(raysRef.current, { rotation: 10, duration: 44, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          gsap.to(seaRef.current, { x: -16, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 })
        );
        const dots = particlesRef.current?.children;
        if (dots) {
          Array.from(dots).forEach((d, i) => {
            drifts.push(
              gsap.to(d, {
                y: gsap.utils.random(-50, 50),
                x: gsap.utils.random(-30, 30),
                duration: gsap.utils.random(7, 14),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: i * 0.12,
              })
            );
          });
        }
        // stars twinkle independently
        const stars = starsRef.current?.querySelectorAll("span");
        stars?.forEach((s, i) => {
          drifts.push(
            gsap.to(s, {
              opacity: gsap.utils.random(0.25, 1),
              duration: gsap.utils.random(1.4, 3.6),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 0.05,
            })
          );
        });
      }

      if (reduced) {
        // Present a calm, legible cruise still — no scrubbed camera work.
        gsap.set(gradDepartureRef.current, { opacity: 0 });
        gsap.set([gradCruiseRef.current, gradStratoRef.current], { opacity: 1 });
        gsap.set([cloudFarRef.current, cloudNearRef.current, flashRef.current], { opacity: 0 });
        gsap.set([starsRef.current, curveRef.current], { opacity: 0.6 });
        gsap.set(msg3Ref.current, { opacity: 1 });
        gsap.set([msg1Ref.current, msg2Ref.current], { opacity: 0 });
        gsap.set([topFadeRef.current, bottomFadeRef.current], { opacity: 0 });
        if (altValueRef.current) altValueRef.current.textContent = "39,000";
        gsap.set(altBarRef.current, { scaleY: 1 });
        return () => drifts.forEach((t) => t.kill());
      }

      // initial state
      gsap.set(gradDepartureRef.current, { opacity: 1 });
      gsap.set([gradCruiseRef.current, gradStratoRef.current, starsRef.current, curveRef.current], { opacity: 0 });
      gsap.set(bottomFadeRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const ft = Math.round((self.progress * 39000) / 100) * 100;
            if (altValueRef.current) altValueRef.current.textContent = ft.toLocaleString("en-US");
            if (altBarRef.current) gsap.set(altBarRef.current, { scaleY: self.progress });
          },
        },
      });

      /* -------------------- lighting: climb through the day -------------------- */
      // departure haze → brilliant cruise → deep stratosphere
      tl.to(gradDepartureRef.current, { opacity: 0, duration: 0.34 }, 0.06);
      tl.fromTo(gradCruiseRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.12);
      tl.to(gradCruiseRef.current, { opacity: 0, duration: 0.3 }, 0.62);
      tl.fromTo(gradStratoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0.6);

      // stars + earth-curve emerge only at altitude
      tl.fromTo(starsRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.26 }, 0.66);
      tl.fromTo(curveRef.current, { opacity: 0, yPercent: 8 }, { opacity: 0.9, yPercent: 0, duration: 0.3 }, 0.68);

      /* ----------------------------- edge feathers ----------------------------- */
      tl.fromTo(topFadeRef.current, { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0);
      tl.fromTo(bottomFadeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.86);

      /* ------------------------------- the sun -------------------------------- */
      tl.fromTo(
        sunRef.current,
        { opacity: 0.2, scale: 0.9, xPercent: -8, yPercent: 12 },
        { opacity: 1, scale: 1.15, xPercent: 4, yPercent: -6, duration: 0.5 },
        0.2
      ).to(sunRef.current, { opacity: 0.7, scale: 1.3, yPercent: -16, duration: 0.4 }, 0.62);

      /* ---------------------------- the cloud decks ---------------------------- */
      // sea of clouds sinks away beneath us as we climb
      tl.fromTo(
        seaRef.current,
        { yPercent: 4, scale: 1.08, opacity: 1 },
        { yPercent: 34, scale: 0.82, opacity: 0.35, duration: 1 },
        0
      );

      // a far bank swells and passes early
      tl.fromTo(cloudFarRef.current, { opacity: 0, scale: 1.1, yPercent: 6 }, { opacity: 0.85, scale: 2.4, yPercent: -6, duration: 0.5 }, 0.06)
        .to(cloudFarRef.current, { opacity: 0, duration: 0.24 }, 0.4);

      // the near deck rushes the lens — the breakthrough
      tl.fromTo(cloudNearRef.current, { opacity: 0, scale: 1.3, yPercent: 8 }, { opacity: 1, scale: 5.2, yPercent: -10, duration: 0.5 }, 0.28)
        .to(cloudNearRef.current, { opacity: 0, duration: 0.2 }, 0.56);

      // white-out at the heart of the cloud
      tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.7, duration: 0.12 }, 0.44)
        .to(flashRef.current, { opacity: 0, duration: 0.22 }, 0.54);

      // foreground wisps — soft opposing passes for depth
      tl.fromTo(wispARef.current, { opacity: 0, scale: 1.2, xPercent: 14 }, { opacity: 0.55, scale: 1.8, xPercent: -20, duration: 1 }, 0.1);
      tl.fromTo(wispBRef.current, { opacity: 0, scale: 1.3, xPercent: 10, yPercent: 4 }, { opacity: 0.4, scale: 2, xPercent: -16, yPercent: -8, duration: 1 }, 0.34);

      /* ----------------------- the aircraft: a climbing arc ---------------------- */
      // climbs in low-left → banks up through the deck → recedes high-right
      tl.fromTo(
        planePathRef.current,
        { xPercent: -10, yPercent: 16, rotation: 4, scale: 0.92 },
        { xPercent: 4, yPercent: -2, rotation: -3, scale: 1.02, duration: 0.5 },
        0
      )
        .to(planePathRef.current, { xPercent: 26, yPercent: -24, rotation: -6, scale: 0.68, opacity: 0.9, duration: 0.5 }, 0.5);

      /* ----------------------------- typography beats ---------------------------- */
      const beat = (el: HTMLDivElement | null, at: number, hold: number) => {
        tl.fromTo(el, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.1 }, at)
          .to(el, { opacity: 0, yPercent: -8, duration: 0.1 }, at + hold);
      };
      beat(msg1Ref.current, 0.06, 0.2);
      beat(msg2Ref.current, 0.44, 0.18);
      // final message holds to the very end of the section
      tl.fromTo(msg3Ref.current, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.1 }, 0.74);

      // HUD fades in for the flight, out at the top and tail
      tl.fromTo(hudRef.current, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.05)
        .to(hudRef.current, { opacity: 0, duration: 0.08 }, 0.9);

      return () => drifts.forEach((t) => t.kill());
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.trigger === rootRef.current && t.kill());
    };
  }, []);

  return (
    <div ref={rootRef} className="relative h-[540vh] bg-[#2f7fc0]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ===================== atmosphere / lighting ===================== */}
        {/* departure — warm, hazy low altitude */}
        <div
          ref={gradDepartureRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#2f7fc0 0%,#6fb2e0 34%,#bfe0f6 58%,#f2e3c4 82%,#f7dca0 100%)",
          }}
        />
        {/* cruise — brilliant clear blue */}
        <div
          ref={gradCruiseRef}
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "linear-gradient(180deg,#0a63b4 0%,#3f9cdd 40%,#7bc0ec 66%,#bfe2f7 86%,#eaf6ff 100%)",
          }}
        />
        {/* stratosphere — deep navy above, sky-blue below (feeds into CloudCorridor) */}
        <div
          ref={gradStratoRef}
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "linear-gradient(180deg,#040f28 0%,#0a3a76 26%,#1c7ccb 52%,#67b4e8 78%,#bcdcf3 100%)",
          }}
        />

        {/* starfield — masked to the upper sky, only reads at altitude */}
        <div
          ref={starsRef}
          className="pointer-events-none absolute inset-0 z-[2] opacity-0"
          style={{
            maskImage: "linear-gradient(180deg,#000 0%,#000 40%,transparent 66%)",
            WebkitMaskImage: "linear-gradient(180deg,#000 0%,#000 40%,transparent 66%)",
          }}
          aria-hidden
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${1 + (i % 3) * 0.6}px`,
                height: `${1 + (i % 3) * 0.6}px`,
                left: `${(i * 47) % 100}%`,
                top: `${(i * 29) % 62}%`,
                opacity: 0.3 + (i % 5) * 0.14,
                boxShadow: "0 0 4px rgba(255,255,255,0.8)",
              }}
            />
          ))}
        </div>

        {/* sun + volumetric god-rays */}
        <div ref={sunRef} className="absolute right-[10%] top-[-14%] z-[3] h-[92vh] w-[92vh] opacity-20 will-change-transform">
          <div
            ref={raysRef}
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "conic-gradient(from 200deg at 50% 42%,rgba(255,255,255,0) 0deg,rgba(255,255,255,0.28) 7deg,rgba(255,255,255,0) 15deg,rgba(255,255,255,0) 30deg,rgba(255,255,255,0.2) 40deg,rgba(255,255,255,0) 50deg,rgba(255,255,255,0) 70deg,rgba(255,255,255,0.24) 84deg,rgba(255,255,255,0) 96deg,rgba(255,255,255,0) 120deg,rgba(255,255,255,0.16) 134deg,rgba(255,255,255,0) 146deg)",
              maskImage: "radial-gradient(circle at 50% 42%,transparent 4%,#000 26%,transparent 82%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 42%,transparent 4%,#000 26%,transparent 82%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%,rgba(255,255,255,0.9) 0%,rgba(255,250,235,0.4) 22%,rgba(255,244,214,0.12) 44%,rgba(255,244,214,0) 64%)",
            }}
          />
          <div
            ref={sunCoreRef}
            className="absolute left-1/2 top-[42%] h-[24vh] w-[24vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%,rgba(255,255,255,0.98) 0%,rgba(255,252,240,0.72) 38%,rgba(255,246,220,0) 72%)",
            }}
          />
        </div>

        {/* curvature of the earth — a faint atmospheric rim at altitude */}
        <div ref={curveRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[64%] opacity-0" aria-hidden>
          <div
            className="absolute inset-x-[-30%] bottom-[-52%] h-[130%] rounded-[50%]"
            style={{
              background:
                "radial-gradient(circle at 50% 0%,rgba(190,224,246,0.55) 0%,rgba(120,190,235,0.28) 30%,rgba(10,58,118,0) 62%)",
              boxShadow: "inset 0 4px 60px rgba(255,255,255,0.35)",
            }}
          />
        </div>

        {/* drifting particles / ice crystals (kept alive during held beats) */}
        <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/60 blur-[1px]"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${(i * 53) % 100}%`,
                top: `${(i * 41) % 100}%`,
                opacity: 0.3 + (i % 4) * 0.12,
              }}
            />
          ))}
        </div>

        {/* ===================== cloud decks ===================== */}
        {/* the sea of clouds below — sinks away as we climb */}
        <div ref={seaRef} className="absolute inset-x-0 bottom-0 z-[4] h-[74%] will-change-transform">
          <div className="relative h-full w-full">
            <Image
              src="/assets/sky/sky-bank.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-bottom"
              style={{
                maskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.4) 14%,#000 40%)",
                WebkitMaskImage: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.4) 14%,#000 40%)",
              }}
              aria-hidden
            />
          </div>
        </div>

        {/* far cloud bank — swells and passes */}
        <div ref={cloudFarRef} className="absolute inset-0 z-20 opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-2-a.png" alt="" fill sizes="120vw" className="object-cover" aria-hidden />
        </div>
        {/* near cloud bank — the fly-through / breakthrough */}
        <div ref={cloudNearRef} className="absolute inset-0 z-[26] opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-1-a.png" alt="" fill sizes="140vw" className="object-cover" aria-hidden />
        </div>

        {/* ===================== the aircraft ===================== */}
        <div ref={planePathRef} className="absolute inset-0 z-[24] will-change-transform">
          <div ref={planeBobRef} className="absolute left-[6%] top-[40%] aspect-[3520/1125] w-[64vw] max-w-[680px] will-change-transform sm:left-[10%]">
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(58% 46% at 50% 52%,rgba(3,26,58,0.18),rgba(3,26,58,0) 72%)" }}
            />
            <Image
              src="/assets/aircraft/rwandair-transparent.png"
              alt="RwandAir Airbus A330 climbing to cruising altitude"
              fill
              sizes="70vw"
              className="object-contain drop-shadow-[0_30px_60px_rgba(3,26,58,0.3)]"
            />
          </div>
        </div>

        {/* white-out at the core of the cloud */}
        <div ref={flashRef} className="absolute inset-0 z-[30] bg-white opacity-0" aria-hidden />

        {/* foreground volumetric wisps (screen-blended) */}
        <div ref={wispARef} className="pointer-events-none absolute inset-0 z-[32] opacity-0 mix-blend-screen will-change-transform">
          <div className="absolute inset-[-14%] blur-[3px]">
            <Image src="/assets/sky/cloud-wisp.png" alt="" fill sizes="150vw" className="scale-[1.4] object-cover" aria-hidden />
          </div>
        </div>
        <div ref={wispBRef} className="pointer-events-none absolute inset-0 z-[32] opacity-0 mix-blend-screen will-change-transform">
          <div className="absolute inset-[-18%] -scale-x-100 blur-[6px]">
            <Image src="/assets/sky/cloud-wisp-2.png" alt="" fill sizes="160vw" className="scale-[1.7] object-cover" aria-hidden />
          </div>
        </div>

        {/* ===================== typography beats ===================== */}
        <div ref={msg1Ref} className="absolute inset-0 z-[36] flex flex-col items-center justify-center px-gutter text-center opacity-0">
          <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-blue-800/80">Now boarding</p>
          <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-blue-900">
            The journey begins the moment you <span className="italic">leave the ground.</span>
          </h2>
        </div>

        <div ref={msg2Ref} className="absolute inset-0 z-[36] flex flex-col items-center justify-center px-gutter text-center opacity-0">
          <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-white/85 drop-shadow-[0_1px_10px_rgba(3,26,58,0.4)]">Cruising</p>
          <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white drop-shadow-[0_2px_28px_rgba(3,26,58,0.45)]">
            Thirty-nine thousand feet <span className="italic">above Africa.</span>
          </h2>
        </div>

        <div ref={msg3Ref} className="absolute inset-0 z-[36] flex flex-col items-center justify-center px-gutter text-center opacity-0">
          <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-sky-300/90">Above the clouds</p>
          <h2 className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.96] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
            Where every mile is the{" "}
            <span className="italic bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
              dream
            </span>
            .
          </h2>
        </div>

        {/* ===================== flight HUD (altitude readout) ===================== */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute bottom-8 right-gutter z-[38] hidden items-end gap-4 opacity-0 md:flex"
          aria-hidden
        >
          <div className="relative h-24 w-px bg-white/20">
            <span ref={altBarRef} className="absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 bg-gold-400" />
          </div>
          <div className="text-right leading-none text-white">
            <div className="font-display text-2xl font-light tabular-nums tracking-tight drop-shadow-[0_1px_10px_rgba(3,26,58,0.5)]">
              <span ref={altValueRef}>0</span>
              <span className="ml-1 text-fluid-xs uppercase tracking-wideish text-white/70">ft</span>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-wideish text-white/60">Altitude</div>
          </div>
        </div>

        {/* ===================== edge feathers ===================== */}
        <div
          ref={topFadeRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-[40] h-[40vh] bg-gradient-to-b from-paper to-transparent"
          aria-hidden
        />
        <div
          ref={bottomFadeRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[40] h-[45vh] bg-gradient-to-t from-[#bcdcf3] to-transparent opacity-0"
          aria-hidden
        />

        {/* faint atmospheric grain */}
        <svg className="pointer-events-none absolute inset-0 z-[42] h-full w-full opacity-[0.05] mix-blend-overlay" aria-hidden>
          <filter id="flight-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#flight-grain)" />
        </svg>
      </div>
    </div>
  );
}
