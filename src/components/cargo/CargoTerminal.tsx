"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * "Camera dive" into the home hub: the terminal image starts small and framed,
 * then scales up to fill the screen as you scroll — as if the camera is flying
 * down into Kigali — before settling into a full-bleed parallax panel with
 * caption cards that drift at a different speed than the background.
 */
export function CargoTerminal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(frameRef.current, { borderRadius: 0, width: "100%", height: "100%" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "+=140%", scrub: 1, pin: true },
      });
      tl.fromTo(
        frameRef.current,
        { width: "62%", height: "48%", borderRadius: 28 },
        { width: "100%", height: "100%", borderRadius: 0, ease: "power2.inOut" },
        0
      );
      tl.fromTo(imgRef.current, { scale: 1.3 }, { scale: 1.05, ease: "power2.inOut" }, 0);
      tl.fromTo(cardsRef.current, { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, ease: "power2.out" }, 0.6);

      // background drifts slower than the caption cards (parallax depth)
      gsap.to(imgRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-[100svh] overflow-hidden bg-blue-900">
      <div className="flex h-full items-center justify-center">
        <div ref={frameRef} className="relative overflow-hidden shadow-2xl shadow-blue-900/40">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/assets/cargo/kigali-terminal.png"
              alt="RwandAir Cargo terminal at Kigali International Airport at dusk"
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-blue-900/20" />
        </div>
      </div>

      <div ref={cardsRef} className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-gutter pb-16 opacity-0">
        <div className="mx-auto max-w-shell">
          <p className="mb-3 text-fluid-xs uppercase tracking-wideish text-gold-400">Our home hub</p>
          <h2 className="max-w-2xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white">
            Built at the centre of the continent.
          </h2>
        </div>
      </div>
    </div>
  );
}
