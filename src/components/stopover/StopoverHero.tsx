"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

export function StopoverHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(".sh-line", { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.15 });
      gsap.to(".sh-fade", { opacity: 1, duration: 1, ease: "power2.out", delay: 0.7, stagger: 0.1 });

      if (reduced) return;
      gsap.to(imgRef.current, {
        scale: 1.18,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(chipRef.current, {
        y: -14,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-blue-900">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src="/assets/stopover/kigali.jpg" alt="Kigali, Rwanda" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-blue-900/30" />

      <a
        href="/"
        className="focus-ring absolute left-gutter top-28 z-10 flex items-center gap-2 text-fluid-xs uppercase tracking-wideish text-white/70 transition-colors hover:text-white"
      >
        ← Back home
      </a>

      <div
        ref={chipRef}
        className="sh-fade pointer-events-none absolute right-gutter top-1/3 z-10 hidden rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-right opacity-0 backdrop-blur-md lg:block"
      >
        <p className="font-display text-fluid-h3 text-white">8–24h</p>
        <p className="text-fluid-xs uppercase tracking-wideish text-white/60">layover, one free night</p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-20 pt-40 sm:pb-28">
        <p className="sh-fade mb-6 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">Kigali Stopover</p>
        <h1 className="max-w-4xl font-display text-fluid-display font-light leading-[0.95] tracking-tightest text-white">
          <span className="block overflow-hidden"><span className="sh-line block">Turn your layover</span></span>
          <span className="block overflow-hidden"><span className="sh-line block italic">into an experience.</span></span>
        </h1>
        <p className="sh-fade mt-8 max-w-xl text-fluid-body text-white/70 opacity-0">
          A long connection through Kigali becomes a night in Rwanda&rsquo;s vibrant capital — hotel on us, so you can
          relax, recharge, or explore before your onward flight.
        </p>
      </div>
    </section>
  );
}
