"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { cargoFacts } from "@/lib/cargo";

/**
 * Cold-chain "time freeze": the message holds perfectly still while frost
 * particles drift, a light sweep passes and a temperature readout ticks. A cold
 * blue world — deliberately unlike the warm cloud time-freeze on the home page.
 */
export function ColdChain() {
  const rootRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const drifts: gsap.core.Tween[] = [];
      if (!reduced) {
        const dots = particlesRef.current?.children;
        if (dots)
          Array.from(dots).forEach((d, i) => {
            drifts.push(
              gsap.to(d, {
                y: gsap.utils.random(-60, 60),
                x: gsap.utils.random(-30, 30),
                duration: gsap.utils.random(7, 14),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: i * 0.1,
              })
            );
          });
        drifts.push(
          gsap.fromTo(
            sweepRef.current,
            { xPercent: -120 },
            { xPercent: 220, duration: 9, ease: "sine.inOut", repeat: -1 }
          )
        );
      }

      if (reduced) {
        gsap.set(msgRef.current, { opacity: 1 });
        return () => drifts.forEach((t) => t.kill());
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      // message holds still (tiny drift) while world moves around it
      tl.fromTo(msgRef.current, { opacity: 0, yPercent: 4 }, { opacity: 1, yPercent: 0, duration: 0.22 }, 0.1);
      tl.to(msgRef.current, { opacity: 1, duration: 0.4 }, 0.32); // hold
      tl.to(msgRef.current, { opacity: 0, yPercent: -4, duration: 0.2 }, 0.75);

      // temperature readout ticks toward -4°C then back
      const t = { v: 6 };
      tl.to(t, {
        v: -4,
        duration: 0.5,
        onUpdate: () => {
          if (tempRef.current) tempRef.current.textContent = `${t.v.toFixed(1)}°C`;
        },
      }, 0.12);

      return () => drifts.forEach((t) => t.kill());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-[220vh] bg-blue-900">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-blue-900 via-blue-700 to-sky-600">
        {/* frost particles */}
        <div ref={particlesRef} className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                left: `${(i * 53) % 100}%`,
                top: `${(i * 29) % 100}%`,
                opacity: 0.25 + (i % 4) * 0.15,
              }}
            />
          ))}
        </div>

        {/* light sweep */}
        <div ref={sweepRef} className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />

        {/* temperature readout */}
        <div className="absolute left-gutter top-28 z-10 font-display text-white/60">
          <p className="text-fluid-xs uppercase tracking-wideish text-white/40">Hold temperature</p>
          <span ref={tempRef} className="text-fluid-h3">6.0°C</span>
        </div>

        {/* still message */}
        <div ref={msgRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-gutter text-center opacity-0">
          <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-sky-300">Cold chain</p>
          <h2 className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
            {cargoFacts.coldChain}
          </h2>
        </div>
      </div>
    </div>
  );
}
