"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { ArrowButton } from "@/components/ui/ArrowButton";

/**
 * Closing chapter: the cold-chain image sits behind a circular aperture that
 * irises open as you scroll — the "lens" opening onto the next step.
 */
export function CargoCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(apertureRef.current, { clipPath: "circle(75% at 50% 50%)" });
        return;
      }
      gsap.fromTo(
        apertureRef.current,
        { clipPath: "circle(8% at 50% 50%)" },
        {
          clipPath: "circle(75% at 50% 50%)",
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 80%", end: "center 45%", scrub: 1 },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="border-t border-line bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="relative overflow-hidden rounded-3xl">
          <div ref={apertureRef} className="relative aspect-[16/9] will-change-[clip-path] sm:aspect-[21/9]">
            <Image
              src="/assets/cargo/cold-chain.png"
              alt="Roses and vegetables packed for export in RwandAir Cargo cartons"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/55" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-gutter text-center">
            <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-gold-400">Ship with us</p>
            <h2 className="max-w-2xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white">
              Ready when your cargo is.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ArrowButton href="#" tone="light">
                Get a quote
              </ArrowButton>
              <ArrowButton href="#" tone="light">
                Track a shipment
              </ArrowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
