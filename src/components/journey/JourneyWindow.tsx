"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 5 — The Window. Seat 14A.
 *
 * First-person: you are in the seat, and the world is doing the moving. The
 * outside is built from the real assets — the aerial sea of clouds sliding
 * slowly below, real cumulus crossing the pane at flight speed — while a
 * scrubbed timeline turns the day: brilliant afternoon → golden hour → a storm
 * kept at a distance → night, with a city breathing gold beneath you.
 *
 * What sells it is the glass and the airframe, not the view alone:
 *   · the whole window assembly carries a continuous engine-hum vibration
 *     (ticker-driven, ±1px) with an occasional soft turbulence bump
 *   · a faint reflection of the cabin sits IN the glass, growing stronger as
 *     the world outside goes dark — the way real windows behave at night
 *   · a slow specular sweep drifts across the pane
 *
 * Continuous motion is time-based (drift, sweep, vibration); the day itself is
 * scroll-scrubbed. Everything is transform/opacity — nothing re-renders.
 */
const CLOUDSCAPE = "/assets/sky/cloudscape-aerial.png";
const CLOUD = "/assets/sky/cloud-real.png";
const CABIN_REFLECTION = "/assets/fleet/business-cabin.jpg";

const PHASES = [
  { at: 0.0, caption: "Somewhere over the Rift, the afternoon holds its breath." },
  { at: 0.3, caption: "Golden hour pours itself across the roof of the world." },
  { at: 0.55, caption: "A storm keeps its distance, and its beauty." },
  { at: 0.8, caption: "Then night — and a city breathing gold beneath you." },
];

/* aircraft-window radius, shared by every pane layer */
const WIN_R = "46% 46% 46% 46% / 32% 32% 32% 32%";

export function JourneyWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vibRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  // city lights + stars, seeded so SSR and client agree
  const { lights, stars } = useMemo(() => {
    let seed = 14;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return {
      lights: Array.from({ length: 70 }, () => ({
        x: 8 + rnd() * 84,
        y: 74 + rnd() * 20,
        s: 0.6 + rnd() * 1.7,
        d: rnd() * 3,
      })),
      stars: Array.from({ length: 40 }, () => ({
        x: 4 + rnd() * 92,
        y: 4 + rnd() * 38,
        s: 0.5 + rnd() * 1.2,
        d: rnd() * 4,
      })),
    };
  }, []);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tickerFn: ((time: number) => void) | null = null;

    const ctx = gsap.context(() => {
      if (reduced) {
        // a single still: golden hour, mid-caption
        gsap.set(".win-sky-golden", { opacity: 1 });
        gsap.set(".win-tint-golden", { opacity: 1 });
        gsap.set(".win-sun", { top: "56%", opacity: 0.95 });
        if (captionRef.current) captionRef.current.textContent = PHASES[1].caption;
        return;
      }

      /* ---------- continuous, time-based life ---------- */
      // the sea of clouds sliding beneath the flight
      gsap.to(".win-floor", { xPercent: -9, duration: 46, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // cumulus crossing the pane
      gsap.fromTo(".win-drift-a", { xPercent: 150 }, { xPercent: -180, duration: 34, ease: "none", repeat: -1 });
      gsap.fromTo(".win-drift-b", { xPercent: 210 }, { xPercent: -190, duration: 52, ease: "none", repeat: -1, delay: 9 });
      // specular sweep across the glass
      gsap.fromTo(".win-sweep", { xPercent: -150 }, { xPercent: 150, duration: 15, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // engine hum: the whole assembly micro-vibrates
      tickerFn = (time: number) => {
        const el = vibRef.current;
        if (!el) return;
        const x = Math.sin(time * 9.7) * 0.6 + Math.sin(time * 23.3) * 0.3;
        const y = Math.cos(time * 11.3) * 0.5 + Math.sin(time * 17.7) * 0.3;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      };
      gsap.ticker.add(tickerFn);
      // …and every so often, a soft pocket of turbulence
      gsap.timeline({ repeat: -1, repeatDelay: 9, delay: 4 })
        .to(".win-turb", { y: 2.6, rotation: 0.25, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 3 })
        .to(".win-turb", { y: 0, rotation: 0, duration: 0.3, ease: "sine.out" });

      /* ---------- the day, scrubbed by scroll ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".win-stage",
          pinSpacing: false, // the 440vh section already reserves the travel
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let idx = 0;
            for (let i = 0; i < PHASES.length; i++) if (p >= PHASES[i].at) idx = i;
            const cap = captionRef.current;
            if (cap && cap.dataset.i !== String(idx)) {
              cap.dataset.i = String(idx);
              cap.textContent = PHASES[idx].caption;
              gsap.fromTo(cap, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", overwrite: true });
            }
          },
        },
      });

      // sky grades stack up as the day turns
      tl.fromTo(".win-sky-golden", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.24);
      tl.fromTo(".win-sky-dusk", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5);
      tl.fromTo(".win-sky-night", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.75);
      // the cloud floor takes the same light
      tl.fromTo(".win-tint-golden", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.24);
      tl.fromTo(".win-tint-dusk", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5);
      tl.fromTo(".win-tint-night", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.75);
      // the sun sinks with the day and is gone by dusk
      tl.fromTo(".win-sun", { top: "22%" }, { top: "56%", duration: 0.3 }, 0.15);
      tl.to(".win-sun", { top: "74%", opacity: 0, duration: 0.15 }, 0.5);
      // warm spill on the cabin wall at golden hour, gone by night
      tl.fromTo(".win-spill", { opacity: 0 }, { opacity: 0.55, duration: 0.1 }, 0.26);
      tl.to(".win-spill", { opacity: 0, duration: 0.15 }, 0.55);
      // the distant storm owns the dusk
      tl.fromTo(".win-storm", { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.51);
      tl.to(".win-storm", { opacity: 0, duration: 0.08 }, 0.76);
      // night: stars, moon, the city below — and the glass starts reflecting
      tl.fromTo(".win-night", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.76);
      tl.fromTo(".win-reflect", { opacity: 0.05 }, { opacity: 0.12, duration: 0.12 }, 0.74);
      // drifting cumulus thin out after dusk (less weather up here at night)
      tl.to(".win-drift-a, .win-drift-b", { opacity: 0.25, duration: 0.15 }, 0.6);
    }, root);

    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="journey-4" data-journey-chapter="4" className="relative h-[440vh] bg-[#041c3f]">
      <div className="win-stage relative flex h-[100svh] items-center justify-center overflow-hidden">
        {/* cabin wall */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(130% 105% at 50% 42%,#0d2c55 0%,#072045 55%,#041730 100%)" }} />
        {/* warm light spilling onto the wall at golden hour */}
        <div
          className="win-spill pointer-events-none absolute left-1/2 top-1/2 h-[110vh] w-[110vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle,rgba(255,190,120,0.4) 0%,rgba(255,190,120,0.12) 40%,transparent 68%)" }}
          aria-hidden
        />

        {/* ============ the window assembly (vibrating) ============ */}
        <div ref={vibRef} className="relative z-10 will-change-transform">
          <div className="win-turb relative">
            <div className="relative h-[76vh] max-h-[860px] aspect-[10/14]">
              {/* -------- outside, clipped to the pane -------- */}
              <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: WIN_R }}>
                {/* sky through the day */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#2374c4 0%,#5da4dd 52%,#b7dcf2 100%)" }} />
                <div className="win-sky-golden absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,#39568f 0%,#a06a8a 38%,#e08a5a 66%,#ffd9a0 88%,#ffe9c4 100%)" }} />
                <div className="win-sky-dusk absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,#141f44 0%,#333c6e 45%,#6a5378 72%,#a06258 100%)" }} />
                <div className="win-sky-night absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,#02050e 0%,#081128 55%,#0f1c3e 100%)" }} />

                {/* the sun, sinking as the day turns */}
                <div
                  className="win-sun absolute left-[30%] top-[22%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle,#fff6df 0%,rgba(255,224,160,0.75) 30%,rgba(255,205,140,0.2) 60%,transparent 78%)", filter: "blur(1px)" }}
                  aria-hidden
                />

                {/* night sky: stars + moon */}
                <div className="win-night absolute inset-0 opacity-0" aria-hidden>
                  <div
                    className="absolute right-[20%] top-[13%] h-10 w-10 rounded-full"
                    style={{ background: "radial-gradient(circle at 38% 38%,#f4f6fb 0%,#cfd8e8 55%,rgba(160,180,210,0.25) 78%,transparent 90%)", boxShadow: "0 0 26px rgba(210,225,250,0.45)" }}
                  />
                  {stars.map((s, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full bg-[#dfe9fb]"
                      style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animation: `winTwinkle ${2.4 + s.d}s ease-in-out ${s.d}s infinite` }}
                    />
                  ))}
                </div>

                {/* the sea of clouds below the flight (real, sliding) */}
                <div
                  className="win-floor absolute bottom-[-4%] left-[-30%] h-[52%] w-[165%]"
                  style={{ WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 42%)", maskImage: "linear-gradient(180deg,transparent 0%,black 42%)" }}
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CLOUDSCAPE} alt="" className="h-full w-full object-cover" />
                  {/* the floor takes the light of each phase */}
                  <div className="win-tint-golden absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,rgba(255,170,90,0.42),rgba(200,90,60,0.3))" }} />
                  <div className="win-tint-dusk absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,rgba(58,52,110,0.55),rgba(30,30,70,0.6))" }} />
                  <div className="win-tint-night absolute inset-0 opacity-0" style={{ background: "linear-gradient(180deg,rgba(3,7,20,0.82),rgba(4,8,24,0.9))" }} />
                </div>

                {/* the city below, breathing at night */}
                <div className="win-night absolute inset-0 opacity-0" aria-hidden>
                  {lights.map((l, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full bg-[#ffd9a0]"
                      style={{ left: `${l.x}%`, top: `${l.y}%`, width: l.s, height: l.s, boxShadow: "0 0 5px rgba(255,214,150,0.85)", animation: `winTwinkle ${2 + l.d}s ease-in-out ${l.d}s infinite` }}
                    />
                  ))}
                </div>

                {/* real cumulus crossing the pane at flight speed */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CLOUD} alt="" className="win-drift-a absolute left-0 top-[16%] w-[75%] opacity-90" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CLOUD} alt="" className="win-drift-b absolute left-0 top-[44%] w-[52%] opacity-60 blur-[1px]" aria-hidden />

                {/* the storm, kept at a distance */}
                <div className="win-storm absolute inset-0 opacity-0" aria-hidden>
                  <div className="absolute right-[6%] top-[34%] h-[42%] w-[38%] rounded-[45%] bg-[#0b1020] opacity-85 blur-xl" />
                  <div className="win-bolt absolute right-[18%] top-[40%] h-28 w-[2px]" />
                </div>

                {/* -------- the glass itself -------- */}
                {/* faint cabin reflection, stronger as the night comes */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CABIN_REFLECTION}
                  alt=""
                  className="win-reflect absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-[0.05] mix-blend-screen"
                  aria-hidden
                />
                {/* specular sweep */}
                <div
                  className="win-sweep absolute inset-y-[-20%] left-0 w-[55%] rotate-[16deg] mix-blend-screen"
                  style={{ background: "linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.13) 46%,rgba(255,255,255,0.22) 50%,rgba(255,255,255,0.13) 54%,transparent 80%)" }}
                  aria-hidden
                />
                {/* double-pane depth: inner shadow hugging the opening */}
                <div className="pointer-events-none absolute inset-0" style={{ borderRadius: WIN_R, boxShadow: "inset 0 0 46px 18px rgba(2,8,20,0.55), inset 0 0 6px 2px rgba(255,255,255,0.08)" }} />
              </div>

              {/* -------- the surround -------- */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: WIN_R,
                  boxShadow:
                    "0 0 0 14px #d9dde3, 0 0 0 15px rgba(150,158,170,0.9), 0 0 0 30px #0a2448, 0 46px 110px rgba(1,8,20,0.65)",
                }}
              />
              {/* seat tag */}
              <span className="absolute -right-2 -top-12 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
                Seat 14A
              </span>
            </div>
          </div>
        </div>

        {/* the single, evolving line */}
        <p
          ref={captionRef}
          data-i="0"
          className="absolute inset-x-0 bottom-[7%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-white/85"
        >
          {PHASES[0].caption}
        </p>

        {/* chapter marker */}
        <p className="absolute left-gutter top-[12%] z-10 text-fluid-xs uppercase tracking-[0.32em] text-white/45">
          Chapter Five — The Window
        </p>
      </div>

      <style jsx>{`
        @keyframes winTwinkle {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 1;
          }
        }
        .win-bolt {
          animation: winFlash 7s steps(1) 1.2s infinite;
        }
        @keyframes winFlash {
          0%,
          91%,
          100% {
            background: rgba(255, 255, 255, 0);
            box-shadow: none;
          }
          92%,
          94% {
            background: rgba(228, 240, 255, 0.95);
            box-shadow: 0 0 34px 8px rgba(198, 222, 255, 0.75);
          }
        }
      `}</style>
    </section>
  );
}
