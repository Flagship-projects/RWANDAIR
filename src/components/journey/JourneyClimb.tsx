"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 3 — The Climb.
 *
 * The ascent, felt. The frame holds while the visitor's scroll IS the climb:
 * the RwandAir A330 (top view, seen from above) rises into the frame and hangs
 * there while the world falls away beneath it — cloud decks stream down past
 * the lens, thinning as the air does, the sky grading from hazy morning to the
 * clean high blue of cruise. Milestone lines drift up alongside the aircraft
 * like thoughts at each altitude, and a live altimeter climbs on the right.
 *
 * Built on the principles studied on jeskojets.com (never copied): a pinned
 * stage the aircraft transits; content sharing the aircraft's airspace rather
 * than sitting in cards; oversized scale; atmosphere as the storyteller.
 * Everything is transform + opacity on one scrubbed timeline — no layout work,
 * nothing re-renders on scroll.
 */
const PLANE_TOP = "/assets/Rwandair new assets/rwandair topview.png";
const CLOUDSCAPE = "/assets/sky/cloudscape-aerial.png"; // real aerial sea of clouds
const CLOUD = "/assets/sky/cloud-real.png"; // real cumulus, true alpha

/* The four altitude thoughts — each drifts up through its scroll window. */
const BEATS = [
  { at: 0.08, alt: "Wheels up", line: "The ground lets go of you.", side: "left" },
  { at: 0.32, alt: "10,000 ft", line: "The city shrinks to a map of itself.", side: "right" },
  { at: 0.56, alt: "25,000 ft", line: "You break through the weather into permanent sunshine.", side: "left" },
  { at: 0.8, alt: "39,000 ft", line: "Cruise. A whole continent ahead of you.", side: "right" },
];


export function JourneyClimb() {
  const rootRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".climb-beat", root);

      if (reduced) {
        // calm still: cruise sky, plane centred, last thought visible
        gsap.set(".climb-sky-high", { opacity: 1 });
        gsap.set(".climb-plane", { yPercent: -50 });
        beats.forEach((b, i) => gsap.set(b, { opacity: i === beats.length - 1 ? 1 : 0, yPercent: 0 }));
        if (altRef.current) altRef.current.textContent = "39,000";
        if (phaseRef.current) phaseRef.current.textContent = "CRUISE";
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
            // altimeter
            if (altRef.current)
              altRef.current.textContent = (Math.round((p * 39000) / 100) * 100).toLocaleString("en-US");
            // flight phase
            if (phaseRef.current) {
              const phase = p < 0.16 ? "TAKEOFF" : p < 0.74 ? "CLIMB" : "CRUISE";
              if (phaseRef.current.textContent !== phase) phaseRef.current.textContent = phase;
            }
          },
        },
      });

      /* ---- the sky: one slow deepening, nothing else ---- */
      tl.fromTo(".climb-sky-high", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.35);

      /* ---- the world falls away: one sea of clouds, one passing cumulus ---- */
      tl.fromTo(".climb-deck-low", { yPercent: 6 }, { yPercent: 135, duration: 0.62 }, 0);
      tl.to(".climb-deck-low", { opacity: 0, duration: 0.2 }, 0.42);
      tl.fromTo(".climb-deck-mid", { yPercent: -16 }, { yPercent: 120, duration: 0.7 }, 0.16);
      tl.to(".climb-deck-mid", { opacity: 0, duration: 0.2 }, 0.66);

      /* ---- the aircraft: in at once, whole and centre-stage, the visual
             focus of the climb — then it slips out overhead at the top ---- */
      tl.fromTo(".climb-plane", { yPercent: 112 }, { yPercent: -100, duration: 0.18, ease: "power2.out" }, 0)
        .to(".climb-plane", { yPercent: -118, scale: 0.95, duration: 0.66 }, 0.18)
        .to(".climb-plane", { yPercent: -300, scale: 0.9, duration: 0.16, ease: "power1.in" }, 0.84);
      // constant gentle sway — time-based, layered on top of the scrub
      gsap.to(".climb-plane-inner", {
        rotate: 1.6,
        xPercent: 2,
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      // wingtip vortices: streaming almost the whole climb
      tl.fromTo(".climb-streak", { opacity: 0 }, { opacity: 0.32, duration: 0.12 }, 0.16);
      tl.to(".climb-streak", { opacity: 0, duration: 0.12 }, 0.78);

      /* ---- the four altitude thoughts drift up alongside the aircraft ---- */
      beats.forEach((b, i) => {
        const c = BEATS[i];
        tl.fromTo(
          b,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.09, ease: "power1.out" },
          c.at
        );
        tl.to(b, { yPercent: -110, opacity: 0, duration: 0.09, ease: "power1.in" }, c.at + 0.13);
      });

      /* ---- instruments live through the climb ---- */
      tl.fromTo(".climb-hud", { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.04).to(
        ".climb-hud",
        { opacity: 0, duration: 0.05 },
        0.92
      );

      /* ---- edge feathers into the neighbouring chapters ---- */
      tl.fromTo(".climb-topfade", { opacity: 1 }, { opacity: 0, duration: 0.09 }, 0);
      tl.fromTo(".climb-botfade", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.88);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-2"
      data-journey-chapter="2"
      className="relative h-[560vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ---- the sky: one gradient, one slow deepening. Let it breathe. ---- */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,#0d55a6 0%,#1e7ac9 50%,#79c0ef 85%,#cfe9fa 100%)" }}
        />
        <div
          className="climb-sky-high absolute inset-0 opacity-0"
          style={{ background: "linear-gradient(180deg,#063a80 0%,#1266b4 38%,#3f9ad8 68%,#a8dcf5 100%)" }}
        />

        {/* ---- the world falling away: one sea of clouds, one passing cumulus ---- */}
        <div
          className="climb-deck-low pointer-events-none absolute inset-x-0 bottom-0 h-[85%]"
          style={{
            WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 34%)",
            maskImage: "linear-gradient(180deg,transparent 0%,black 34%)",
          }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOUDSCAPE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="climb-deck-mid pointer-events-none absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOUD} alt="" className="absolute left-[-14%] top-[46%] w-[58%] opacity-90" />
        </div>

        {/* ---- the aircraft, seen from above, climbing with you ---- */}
        <div className="climb-plane pointer-events-none absolute left-1/2 top-full z-[8] w-[clamp(300px,42vw,680px)] -translate-x-1/2" aria-hidden>
          <div className="climb-plane-inner relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLANE_TOP}
              alt="The RwandAir A330 from above, climbing"
              className="w-full drop-shadow-[0_60px_90px_rgba(4,24,54,0.5)]"
            />
            {/* wingtip vortices, streaming down and behind */}
            <div
              className="climb-streak absolute left-[7%] top-[56%] h-[52vh] w-[2px] opacity-0 blur-[1px]"
              style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))" }}
            />
            <div
              className="climb-streak absolute right-[7%] top-[56%] h-[52vh] w-[2px] opacity-0 blur-[1px]"
              style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))" }}
            />
          </div>
        </div>

        {/* ---- the altitude thoughts, sharing the aircraft's airspace ---- */}
        <div className="pointer-events-none absolute inset-0 z-[10]">
          {BEATS.map((b) => (
            <div
              key={b.alt}
              className={
                "climb-beat absolute inset-x-gutter top-[14%] opacity-0 md:top-[38%] md:inset-x-auto md:max-w-sm " +
                (b.side === "left" ? "md:left-[8%]" : "md:right-[8%] md:text-right")
              }
            >
              <p className="text-fluid-xs uppercase tracking-[0.3em] text-gold-300 drop-shadow-[0_1px_10px_rgba(6,30,64,0.7)]">
                {b.alt}
              </p>
              <p className="mt-3 font-display text-fluid-h3 font-light leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(6,30,64,0.6)]">
                {b.line}
              </p>
            </div>
          ))}
        </div>

        {/* ---- one quiet instrument: altitude + phase, bottom-left ---- */}
        <div className="climb-hud pointer-events-none absolute bottom-8 left-gutter z-[12] opacity-0">
          <div className="flex items-end gap-5 text-white">
            <div className="leading-none">
              <div className="font-display text-4xl font-light tabular-nums drop-shadow-[0_1px_12px_rgba(6,30,64,0.6)]">
                <span ref={altRef}>0</span>
                <span className="ml-1.5 text-fluid-xs uppercase tracking-[0.2em] text-white/65">ft</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/60">Altitude</div>
            </div>
            <span
              ref={phaseRef}
              className="mb-0.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-white/85 backdrop-blur-sm"
            >
              TAKEOFF
            </span>
          </div>
        </div>

        {/* chapter marker */}
        <p className="pointer-events-none absolute left-gutter top-[12%] z-[12] text-fluid-xs uppercase tracking-[0.32em] text-white/60">
          Chapter Three — The Climb
        </p>

        {/* ---- edge feathers ---- */}
        <div className="climb-topfade pointer-events-none absolute inset-x-0 top-0 z-[20] h-[32vh] bg-gradient-to-b from-[#07306a] to-transparent" aria-hidden />
        <div className="climb-botfade pointer-events-none absolute inset-x-0 bottom-0 z-[20] h-[40vh] bg-gradient-to-t from-[#062a5c] to-transparent opacity-0" aria-hidden />
      </div>
    </section>
  );
}
