"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

const PLANE = "/assets/aircraft/takeoff-cutout.png";

/**
 * Chapter 7 — Arrival.
 *
 * The descent. Golden-hour light floods up from the horizon as the aircraft
 * settles toward it; the closing line lands, the calls-to-action arrive, and a
 * quiet cue hands the visitor back to the rest of the site (the shared Footer
 * that follows). The one warm, resolved breath after the whole climb.
 */
export function JourneyArrival() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        // the descent — horizon glow rises, aircraft settles toward it
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
        });
        tl.fromTo(".arr-glow", { yPercent: 30, opacity: 0.3 }, { yPercent: 0, opacity: 1, ease: "none" }, 0)
          .fromTo(".arr-plane", { yPercent: -34, xPercent: 10, scale: 1.06, rotate: -3 }, { yPercent: 26, xPercent: -4, scale: 0.9, rotate: 1, ease: "none" }, 0)
          .fromTo(".arr-horizon", { scaleX: 0.4, opacity: 0 }, { scaleX: 1, opacity: 1, ease: "power2.out" }, 0.1);
      } else {
        gsap.set(".arr-glow", { opacity: 1 });
      }

      // closing content reveal
      gsap.from(".arr-reveal", {
        opacity: 0,
        y: 34,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: ".arr-close", start: "top 72%" },
      });
      gsap.from(".arr-title .reveal-line", {
        yPercent: 120,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".arr-close", start: "top 76%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-6"
      data-journey-chapter="6"
      className="relative h-[220vh] bg-[#07306a]"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        {/* graded arrival sky */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0a2a5e 0%,#25497a 40%,#6b5a7a 66%,#c98a5a 84%,#f2b878 100%)" }} />
        {/* golden horizon bloom rising from the bottom */}
        <div className="arr-glow pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" style={{ background: "radial-gradient(120% 100% at 50% 100%,rgba(255,224,150,0.9) 0%,rgba(255,200,120,0.4) 34%,transparent 66%)" }} />
        {/* the horizon line */}
        <div className="arr-horizon absolute bottom-[26%] left-1/2 h-px w-[70%] -translate-x-1/2 origin-center bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        {/* the settling aircraft */}
        <div className="arr-plane pointer-events-none absolute left-1/2 top-[34%] w-[clamp(280px,42vw,720px)] -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PLANE} alt="" className="w-full -scale-x-100 drop-shadow-[0_30px_60px_rgba(60,30,10,0.4)]" />
        </div>

        {/* closing */}
        <div className="arr-close relative z-10 flex flex-col items-center px-gutter text-center">
          <p className="arr-reveal mb-6 text-fluid-xs uppercase tracking-[0.32em] text-white/80 drop-shadow-[0_1px_14px_rgba(30,20,10,0.5)]">
            Chapter Seven — Arrival
          </p>
          <h2 className="arr-title font-display text-fluid-display font-light leading-[0.9] tracking-tightest text-white drop-shadow-[0_3px_30px_rgba(30,20,10,0.45)]">
            <span className="reveal-mask block">
              <span className="reveal-line block">Welcome to</span>
            </span>
            <span className="reveal-mask block">
              <span className="reveal-line block italic text-white">the dream.</span>
            </span>
          </h2>
          <p className="arr-reveal mt-8 max-w-md text-fluid-body font-light leading-relaxed text-white/80 drop-shadow-[0_1px_14px_rgba(30,20,10,0.5)]">
            Every mile of it was real. The next one is yours to book.
          </p>
          <div className="arr-reveal mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/#book" variant="primary" className="!bg-white !px-8 !text-ink hover:!bg-white/90">
              Book a flight
            </Button>
            <Button href="/destinations" variant="ghost" className="!text-white hover:!text-white/70">
              Explore destinations →
            </Button>
          </div>
        </div>

        {/* handoff cue to the rest of the site */}
        <div className="arr-reveal pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.3em]">Continue</span>
          <span aria-hidden className="animate-bounce text-sm">↓</span>
        </div>
      </div>
    </section>
  );
}
