"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 5 — The Window. One camera move.
 *
 * Minimal by intent: a dim cabin, one window, golden light. The visitor sits
 * with it for a moment — the sea of clouds sliding below, a single cumulus
 * crossing, the airframe's faint hum — and then the camera begins to move.
 * Slowly at first, then decisively: straight through the glass. The frame
 * swells past the edges of the viewport, the reflections dissolve, and what's
 * left is open sky filling the screen — which is exactly where the next
 * chapter begins. No cut. One continuous movement, cabin → sky.
 *
 * (Principles studied live on jeskojets.com, not copied: the window as an
 * aperture the whole scene scales through; slow-then-fast pacing; only one
 * camera action at a time; colour continuity so the next scene inherits the
 * same sky. See JourneyAfrica's intro veil for the receiving end.)
 */
const CLOUDSCAPE = "/assets/sky/cloudscape-aerial.png";
const CLOUD = "/assets/sky/cloud-real.png";
const CABIN_REFLECTION = "/assets/fleet/business-cabin.jpg";

/**
 * The end-state sky. The camera flies through the glass into *open* sky, so the
 * exit is one flat colour — which is also what makes the hand-off seamless: a
 * solid fill can't show a seam no matter where the two pinned sections meet.
 * JourneyAfrica paints its opening veil in this exact colour.
 */
export const WINDOW_EXIT_SKY = "#4f86c4";

const WIN_R = "46% 46% 46% 46% / 32% 32% 32% 32%";

export function JourneyWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vibRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tickerFn: ((time: number) => void) | null = null;

    const ctx = gsap.context(() => {
      if (reduced) {
        return; // the seated golden view, still — already the default markup
      }

      /* ---------- quiet, continuous life ---------- */
      gsap.to(".win-floor", { xPercent: -8, duration: 48, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.fromTo(".win-drift", { xPercent: 170 }, { xPercent: -190, duration: 44, ease: "none", repeat: -1 });
      gsap.fromTo(".win-sweep", { xPercent: -150 }, { xPercent: 150, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
      // the airframe's hum
      tickerFn = (time: number) => {
        const el = vibRef.current;
        if (!el) return;
        const x = Math.sin(time * 9.7) * 0.55 + Math.sin(time * 23.3) * 0.3;
        const y = Math.cos(time * 11.3) * 0.5 + Math.sin(time * 17.7) * 0.28;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      };
      gsap.ticker.add(tickerFn);

      /* ---------- the single camera move ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=340%",
          scrub: 1,
          // pinSpacing TRUE + a 100svh section: GSAP owns the scroll distance
          // and lays the next chapter flush against the pin's end — no gap, so
          // the fly-through hands straight to Africa with nothing between.
          pin: ".win-stage",
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // captions: sit with it… then the invitation… then silence
      tl.fromTo(".win-cap-1", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.04);
      tl.to(".win-cap-1", { opacity: 0, y: -10, duration: 0.05, ease: "power2.in" }, 0.38);
      tl.fromTo(".win-cap-2", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0.46);
      tl.to(".win-cap-2", { opacity: 0, duration: 0.05 }, 0.58);

      // phase one — the slow lean toward the glass
      tl.fromTo(".win-zoom", { scale: 1 }, { scale: 1.16, duration: 0.52, ease: "power1.inOut" }, 0);

      // phase two — through it. The aperture swallows the viewport.
      // Origin sits in the open sky so the camera flies toward light, and the
      // cloud floor slides away beneath instead of magnifying into pixels.
      tl.to(".win-zoom", { scale: 9, duration: 0.44, ease: "power2.in" }, 0.52);
      tl.to(".win-bezel, .win-tag", { opacity: 0, duration: 0.1 }, 0.6);
      tl.to(".win-reflect, .win-sweep", { opacity: 0, duration: 0.1 }, 0.58);
      tl.to(".win-drift", { opacity: 0, duration: 0.08 }, 0.62);
      tl.to(".win-floor", { opacity: 0, duration: 0.12 }, 0.68);
      tl.to(".win-shadow", { opacity: 0, duration: 0.12 }, 0.62);
      // the cabin dims away behind you as you leave it
      tl.to(".win-wall, .win-marker", { opacity: 0, duration: 0.12 }, 0.6);
      // …and the frame resolves to flat open sky — the exact colour Africa opens
      // on, so the two pinned sections meet with no visible seam
      tl.to(".win-exit", { opacity: 1, duration: 0.14 }, 0.78);
    }, root);

    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="journey-4" data-journey-chapter="4" className="relative" style={{ background: WINDOW_EXIT_SKY }}>
      <div className="win-stage relative flex h-[100svh] items-center justify-center overflow-hidden">
        {/* the cabin, dim and quiet */}
        <div className="win-wall absolute inset-0" style={{ background: "radial-gradient(130% 105% at 50% 42%,#0d2c55 0%,#072045 55%,#041730 100%)" }} />

        {/* ============ the window (vibrating, then flown through) ============ */}
        <div ref={vibRef} className="relative z-10 will-change-transform">
          <div className="win-zoom relative origin-[50%_16%] will-change-transform">
            <div className="relative h-[74vh] max-h-[840px] aspect-[10/14]">
              {/* outside, clipped to the pane */}
              <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: WIN_R }}>
                {/* golden sky — the exact sky the next chapter opens on */}
                <div className="absolute inset-0" style={{ background: WINDOW_EXIT_SKY }} />
                {/* sun bloom low in the frame */}
                <div
                  className="absolute left-[38%] top-[62%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle,rgba(255,244,214,0.95) 0%,rgba(255,220,150,0.4) 38%,transparent 70%)", filter: "blur(2px)" }}
                  aria-hidden
                />

                {/* the sea of clouds, sliding beneath the flight */}
                <div
                  className="win-floor absolute bottom-[-4%] left-[-30%] h-[46%] w-[165%]"
                  style={{ WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 45%)", maskImage: "linear-gradient(180deg,transparent 0%,black 45%)" }}
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CLOUDSCAPE} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(255,180,110,0.35),rgba(190,120,80,0.28))" }} />
                </div>

                {/* one cumulus, crossing at flight speed */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CLOUD} alt="" className="win-drift absolute left-0 top-[22%] w-[70%] opacity-85" aria-hidden />

                {/* the glass: faint cabin reflection + slow specular sweep */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CABIN_REFLECTION} alt="" className="win-reflect absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-[0.07] mix-blend-screen" aria-hidden />
                <div
                  className="win-sweep absolute inset-y-[-20%] left-0 w-[55%] rotate-[16deg] mix-blend-screen"
                  style={{ background: "linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.12) 46%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0.12) 54%,transparent 80%)" }}
                  aria-hidden
                />
                {/* double-pane depth */}
                <div className="win-shadow pointer-events-none absolute inset-0" style={{ borderRadius: WIN_R, boxShadow: "inset 0 0 46px 18px rgba(2,8,20,0.5), inset 0 0 6px 2px rgba(255,255,255,0.08)" }} />
              </div>

              {/* the surround */}
              <div
                className="win-bezel pointer-events-none absolute inset-0"
                style={{
                  borderRadius: WIN_R,
                  boxShadow:
                    "0 0 0 14px #d9dde3, 0 0 0 15px rgba(150,158,170,0.9), 0 0 0 30px #0a2448, 0 46px 110px rgba(1,8,20,0.65)",
                }}
              />
              <span className="win-tag absolute -right-2 -top-12 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
                Seat 14A
              </span>
            </div>
          </div>
        </div>

        {/* two lines, then silence */}
        <p className="win-cap-1 absolute inset-x-0 bottom-[7%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-white/85 opacity-0">
          The best seat in the sky has always been the one by the glass.
        </p>
        <p className="win-cap-2 absolute inset-x-0 bottom-[7%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-gold-300/90 opacity-0">
          Come closer.
        </p>

        {/* chapter marker */}
        <p className="win-marker absolute left-gutter top-[12%] z-10 text-fluid-xs uppercase tracking-[0.32em] text-white/45">
          Chapter Five — The Window
        </p>

        {/* the flat open sky the camera resolves into — becomes the whole
            viewport at the end of the fly-through, matching Africa's veil */}
        <div className="win-exit pointer-events-none absolute inset-0 z-20 opacity-0" style={{ background: WINDOW_EXIT_SKY }} aria-hidden />
      </div>
    </section>
  );
}
