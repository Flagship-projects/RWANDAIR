"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { loyaltyTiers } from "@/lib/data";

/**
 * The full four-tier ladder. The homepage Loyalty section keeps only the
 * headline and a single card; the complete progression lives here.
 */
export function TierLadder() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(lineRef.current, { scaleY: 1 });
        gsap.set(".tier-row", { opacity: 1, y: 0 });
        return;
      }
      // the ladder rail draws down as you climb through the tiers
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".tier-rows", start: "top 70%", end: "bottom 80%", scrub: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".tier-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="tiers" className="bg-ink py-section-lg text-white">
      <div className="mx-auto max-w-shell px-gutter">
        <p className="text-fluid-xs uppercase tracking-wideish text-gold-400">The ladder</p>
        <h2 className="mt-4 max-w-2xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white">
          Four tiers. Each one <span className="italic">opens further.</span>
        </h2>

        <div className="tier-rows relative mt-20 pl-10 sm:pl-16">
          <span className="absolute left-[7px] top-2 h-[calc(100%-4rem)] w-px bg-white/15 sm:left-[15px]" />
          <span
            ref={lineRef}
            className="absolute left-[7px] top-2 h-[calc(100%-4rem)] w-px origin-top bg-gold-400 sm:left-[15px]"
          />

          <div className="space-y-20 lg:space-y-28">
            {loyaltyTiers.map((tier) => (
              <div key={tier.name} className="tier-row relative">
                <span
                  className="absolute -left-10 flex h-4 w-4 items-center justify-center rounded-full border sm:-left-16"
                  style={{ borderColor: tier.accent, backgroundColor: `${tier.accent}33` }}
                />

                <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-fluid-sm text-white/35">{tier.index}</span>
                      <h3
                        className="font-display text-fluid-h2 font-light tracking-tightest"
                        style={{ color: tier.accent }}
                      >
                        {tier.name}
                      </h3>
                    </div>
                    <p className="mt-3 font-display text-fluid-h3 font-light leading-[1.05] tracking-tightest text-white">
                      {tier.headline}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-fluid-xs uppercase tracking-wideish text-white/45">
                      <span>{tier.threshold}</span>
                      <span style={{ color: tier.accent }}>{tier.bonus}</span>
                    </div>

                    <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                      {tier.benefits.map((b) => (
                        <li key={b} className="flex gap-2.5 text-fluid-sm text-white/65">
                          <span style={{ color: tier.accent }}>—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative aspect-[16/10] w-full max-w-sm justify-self-end overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={tier.material}
                      alt={`${tier.name} membership card`}
                      fill
                      sizes="(min-width:1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{ background: `radial-gradient(120% 90% at 20% 10%, ${tier.accent}55, transparent 60%)` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
