"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Cargo hero — a slow dolly-in on the ramp image, headline lines that unmask,
 * and a foreground coordinate HUD that drifts with the cursor (depth).
 */
export function CargoHero() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cargo-hero-line",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.15 }
      );
      gsap.to(".cargo-hero-fade", { opacity: 1, duration: 1, ease: "power2.out", delay: 0.7, stagger: 0.1 });

      if (reduced) return;

      // slow dolly-in as the hero scrolls away
      gsap.to(imgRef.current, {
        scale: 1.18,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // cursor-parallax HUD
      const xTo = gsap.quickTo(hudRef.current, "x", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(hudRef.current, "y", { duration: 0.9, ease: "power3.out" });
      function onMove(e: MouseEvent) {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        xTo(nx * 40);
        yTo(ny * 30);
      }
      if (!window.matchMedia("(pointer: coarse)").matches) window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-blue-900">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src="/assets/cargo/hero-ramp.jpg" alt="RwandAir Cargo aircraft on the ramp" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/45 to-blue-900/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />

      <a
        href="/"
        className="focus-ring absolute left-gutter top-28 z-10 flex items-center gap-2 text-fluid-xs uppercase tracking-wideish text-white/70 transition-colors hover:text-white"
      >
        ← Back home
      </a>

      {/* drifting coordinate HUD */}
      <div ref={hudRef} className="cargo-hero-fade pointer-events-none absolute right-gutter top-1/3 z-10 hidden text-right opacity-0 lg:block">
        <p className="font-display text-fluid-sm text-white/50">S 1.9686°</p>
        <p className="font-display text-fluid-sm text-white/50">E 30.1395°</p>
        <p className="mt-2 text-fluid-xs uppercase tracking-wideish text-gold-400">KGL · Kigali hub</p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-20 pt-40 sm:pb-28">
        <p className="cargo-hero-fade mb-6 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">RwandAir Cargo</p>
        <h1 className="max-w-4xl font-display text-fluid-display font-light leading-[0.95] tracking-tightest text-white">
          <span className="block overflow-hidden"><span className="cargo-hero-line block">The heart of Africa,</span></span>
          <span className="block overflow-hidden"><span className="cargo-hero-line block italic">in motion.</span></span>
        </h1>
        <p className="cargo-hero-fade mt-8 max-w-xl text-fluid-body text-white/70 opacity-0">
          Belly-hold and freighter capacity connecting Rwandan farms and factories to Europe, the Middle East and the
          Gulf — through one of the best-placed hubs on the continent.
        </p>
      </div>
    </section>
  );
}
