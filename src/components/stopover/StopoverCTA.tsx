"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { ArrowButton } from "@/components/ui/ArrowButton";

export function StopoverCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.2, yPercent: -6 },
        { scale: 1.05, yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[70svh] items-center overflow-hidden bg-blue-900">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src="/assets/stopover/kigali.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
      </div>
      <div className="absolute inset-0 bg-blue-900/70" />

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter text-center">
        <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-gold-400">Ready to stop over?</p>
        <h2 className="mx-auto max-w-3xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
          Book your journey, discover Kigali on the way.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ArrowButton href="/#book">Book a flight</ArrowButton>
          <a
            href="mailto:stopover@rwandair.com"
            className="focus-ring text-fluid-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            stopover@rwandair.com
          </a>
        </div>
      </div>
    </section>
  );
}
