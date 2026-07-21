"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 5 — First Light.
 *
 * The overnight hours, told as one sunrise. The camera never moves: it is fixed
 * on the horizon at 38,000 feet and the only thing that happens is *time*.
 * Scrolling is the night passing — the sky cross-fades from deep night through
 * the first cold band of blue into gold and then full morning, the stars go out
 * one layer at a time, the sun clears the cloud sea, and the aircraft crosses
 * the frame as a small steady silhouette drawing a contrail behind it.
 *
 * Deliberately still. No zoom, no shake, no scale — every beat is colour and
 * light, which is what actually makes a sunrise at altitude feel like one. It
 * resolves onto the same flat daylight blue Africa opens on, so the chapters
 * still hand over without a seam.
 */
const CLOUDSCAPE = "/assets/sky/cloudscape-aerial.png";
const PLANE = "/assets/aircraft/rwandair-transparent.png";

/**
 * The end-state sky. This chapter resolves to one flat colour and JourneyAfrica
 * paints its opening veil in the same value — a solid fill can't show a seam no
 * matter where the two pinned sections meet.
 */
export const DAYBREAK_EXIT_SKY = "#4f86c4";

/** Deterministic star field — same list on server and client, so no hydration drift. */
const STARS = (() => {
  let seed = 20260721;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: 90 }, () => ({
    x: rand() * 100,
    y: rand() * 62,
    s: 0.6 + rand() * 1.6,
    o: 0.25 + rand() * 0.6,
  }));
})();

/** 03:10 → 06:05 local, written straight off scroll progress. */
function clockAt(p: number) {
  const mins = Math.round(190 + p * 175);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export function JourneyDaybreak() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        // hold the finished morning, still
        gsap.set(".dawn-day, .dawn-gold, .dawn-glow", { opacity: 1 });
        gsap.set(".dawn-night, .dawn-stars", { opacity: 0 });
        gsap.set(".dawn-cap-1", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // "bottom top", NOT "bottom bottom": the stage stays pinned until the
          // section's bottom clears the viewport top, which is the exact scroll
          // position where Africa's own pin starts — so the two hand off on the
          // same frame. ("bottom bottom" releases a full viewport early and that
          // last viewport scrolled past as dead flat blue; pinSpacing:true was
          // worse still, appending spacing on top of it.)
          end: "bottom top",
          scrub: 1,
          pin: ".dawn-stage",
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (clockRef.current) clockRef.current.textContent = clockAt(self.progress);
          },
        },
      });

      /* ---- the night ends, one layer at a time ---- */
      tl.to(".dawn-stars", { opacity: 0, duration: 0.34 }, 0.12);
      tl.to(".dawn-night", { opacity: 0, duration: 0.42 }, 0.16);
      // the first cold band of light along the horizon
      tl.fromTo(".dawn-band", { opacity: 0 }, { opacity: 1, duration: 0.26 }, 0.1);
      // gold floods in behind it
      tl.fromTo(".dawn-gold", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.34);
      // …then gives way to full morning
      tl.fromTo(".dawn-day", { opacity: 0 }, { opacity: 1, duration: 0.34 }, 0.62);
      tl.to(".dawn-gold, .dawn-band", { opacity: 0, duration: 0.22 }, 0.72);

      /* ---- the sun clears the cloud sea (rise only — never a scale) ---- */
      tl.fromTo(".dawn-sun", { yPercent: 78, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power1.out" }, 0.26);
      tl.fromTo(".dawn-glow", { opacity: 0 }, { opacity: 1, duration: 0.36 }, 0.3);

      /* ---- the cloud sea warms, then cools into daylight ---- */
      tl.fromTo(".dawn-warm", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.34);
      tl.to(".dawn-warm", { opacity: 0, duration: 0.26 }, 0.7);

      /* ---- the aircraft crosses, steady, the whole chapter long ---- */
      tl.fromTo(".dawn-plane", { xPercent: -34 }, { xPercent: 34, duration: 1, ease: "none" }, 0);
      tl.fromTo(".dawn-trail", { scaleX: 0 }, { scaleX: 1, duration: 0.62, ease: "power1.out" }, 0.06);
      // it catches the sunlight as the morning arrives
      tl.to(".dawn-plane-img", { filter: "brightness(1) saturate(1)", duration: 0.34 }, 0.58);

      /* ---- three lines across the night ---- */
      tl.fromTo(".dawn-cap-1", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.04);
      tl.to(".dawn-cap-1", { opacity: 0, duration: 0.05 }, 0.28);
      tl.fromTo(".dawn-cap-2", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.4);
      tl.to(".dawn-cap-2", { opacity: 0, duration: 0.05 }, 0.62);
      tl.fromTo(".dawn-cap-3", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.72);
      tl.to(".dawn-cap-3, .dawn-marker, .dawn-clock", { opacity: 0, duration: 0.06 }, 0.9);

      /* ---- resolve to the flat sky Africa opens on ----
         Late and short on purpose: the flat colour only exists to make the
         chapter boundary seamless, so it should read as one beat of open sky,
         never a stretch of empty blue to scroll through. */
      tl.to(".dawn-exit", { opacity: 1, duration: 0.06 }, 0.94);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-4"
      data-journey-chapter="4"
      className="relative"
      style={{ height: "420svh", background: DAYBREAK_EXIT_SKY }}
    >
      <div className="dawn-stage relative h-[100svh] overflow-hidden">
        {/* ---------------- sky, stacked and cross-faded ---------------- */}
        {/* full morning — the base everything else sits on top of */}
        <div
          className="dawn-day absolute inset-0 opacity-0"
          style={{ background: `linear-gradient(180deg,#2f6cb0 0%,#4079b8 44%,${DAYBREAK_EXIT_SKY} 78%,#7fb0dc 100%)` }}
        />
        {/* gold */}
        <div
          className="dawn-gold absolute inset-0 opacity-0"
          style={{
            background:
              "linear-gradient(180deg,#123a72 0%,#2d5f9c 30%,#a9743f 62%,#eba95a 80%,#ffd79a 100%)",
          }}
        />
        {/* the deep night this chapter opens in */}
        <div
          className="dawn-night absolute inset-0"
          style={{ background: "linear-gradient(180deg,#03102b 0%,#061c3e 46%,#0a2a55 76%,#123763 100%)" }}
        />
        {/* the first cold band on the horizon */}
        <div
          className="dawn-band absolute inset-x-0 bottom-0 h-[52%] opacity-0"
          style={{
            background:
              "linear-gradient(180deg,transparent 0%,rgba(90,150,215,0.35) 42%,rgba(210,190,180,0.5) 76%,rgba(255,220,180,0.6) 100%)",
          }}
        />

        {/* stars */}
        <div className="dawn-stars absolute inset-0" aria-hidden>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
            />
          ))}
        </div>

        {/* ---------------- the sun ---------------- */}
        {/* no clip box — the cloud sea below is painted after it, so the deck
            occludes the disc naturally as it climbs out from behind it */}
        <div
          className="dawn-sun pointer-events-none absolute bottom-[24%] left-[42%] h-[15vh] w-[15vh] -translate-x-1/2 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle,#fff6df 0%,#ffe1a4 44%,rgba(255,196,120,0.45) 66%,transparent 76%)" }}
          aria-hidden
        />
        {/* its bloom across the horizon */}
        <div
          className="dawn-glow pointer-events-none absolute inset-x-0 bottom-[8%] h-[60vh] opacity-0"
          style={{ background: "radial-gradient(60% 100% at 42% 100%,rgba(255,214,150,0.55) 0%,rgba(255,190,130,0.2) 34%,transparent 68%)" }}
          aria-hidden
        />

        {/* ---------------- the aircraft, small and steady ---------------- */}
        <div className="pointer-events-none absolute left-1/2 top-[34%] z-[6] -translate-x-1/2" aria-hidden>
          <div className="dawn-plane relative">
            {/* contrail, drawn out behind it */}
            <span className="dawn-trail absolute right-[62%] top-[52%] block h-px w-[52vw] origin-right bg-gradient-to-l from-white/45 to-transparent" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLANE}
              alt=""
              className="dawn-plane-img relative w-[clamp(150px,20vw,300px)]"
              style={{ filter: "brightness(0.32) saturate(0.5)" }}
            />
          </div>
        </div>

        {/* ---------------- the cloud sea below ---------------- */}
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 42%)",
            maskImage: "linear-gradient(180deg,transparent 0%,black 42%)",
          }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOUDSCAPE} alt="" className="h-full w-full object-cover" />
          {/* night tint, always on */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,32,66,0.72),rgba(6,20,44,0.62))" }} />
          {/* the warm pass, faded in over it at sunrise */}
          <div
            className="dawn-warm absolute inset-0 opacity-0"
            style={{ background: "linear-gradient(180deg,rgba(255,178,104,0.5),rgba(196,120,78,0.34))" }}
          />
        </div>

        {/* ---------------- type ---------------- */}
        <p className="dawn-marker absolute left-gutter top-[12%] z-10 text-fluid-xs uppercase tracking-[0.32em] text-white/45">
          Chapter Five — First Light
        </p>
        <p className="dawn-clock absolute right-gutter top-[12%] z-10 font-display text-fluid-lg font-light tabular-nums text-white/55">
          <span ref={clockRef}>03:10</span>
          <span className="ml-2 text-fluid-xs uppercase tracking-[0.24em] text-white/35">local</span>
        </p>

        <p className="dawn-cap-1 absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-white/85 opacity-0">
          Four hours of dark, and the whole cabin asleep but you.
        </p>
        <p className="dawn-cap-2 absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-white/85 opacity-0">
          Then the horizon gives itself away — a thin blue line, hours before anyone else sees it.
        </p>
        <p className="dawn-cap-3 absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-gold-300/90 opacity-0">
          You lose a night. You gain a morning.
        </p>

        {/* the flat sky Africa inherits */}
        <div
          className="dawn-exit pointer-events-none absolute inset-0 z-20 opacity-0"
          style={{ background: DAYBREAK_EXIT_SKY }}
          aria-hidden
        />
      </div>
    </section>
  );
}
