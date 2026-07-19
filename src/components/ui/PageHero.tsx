"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Shared hero for the interior IA pages (/experience, /dreammiles, /services).
 * Mirrors the StopoverHero language — masked line-rise for the title, parallax
 * push on the plate — but takes its content as props so each page reads as part
 * of one system rather than three separate builds.
 */
export function PageHero({
  eyebrow,
  lines,
  description,
  image,
  imageAlt,
  chip,
}: {
  eyebrow: string;
  /** Each entry is its own masked line; wrap in <em> for the italic accent. */
  lines: React.ReactNode[];
  description: string;
  image: string;
  imageAlt: string;
  chip?: { value: string; label: string };
}) {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ph-line",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.15 }
      );
      gsap.to(".ph-fade", { opacity: 1, duration: 1, ease: "power2.out", delay: 0.7, stagger: 0.1 });

      if (reduced) return;
      gsap.to(imgRef.current, {
        scale: 1.18,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      if (chipRef.current) {
        gsap.to(chipRef.current, { y: -14, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[92svh] items-end overflow-hidden bg-blue-900">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/45 to-blue-900/30" />

      <a
        href="/"
        className="focus-ring absolute left-gutter top-28 z-10 flex items-center gap-2 text-fluid-xs uppercase tracking-wideish text-white/70 transition-colors hover:text-white"
      >
        ← Back home
      </a>

      {chip && (
        <div
          ref={chipRef}
          className="ph-fade pointer-events-none absolute right-gutter top-1/3 z-10 hidden rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-right opacity-0 backdrop-blur-md lg:block"
        >
          <p className="font-display text-fluid-h3 text-white">{chip.value}</p>
          <p className="text-fluid-xs uppercase tracking-wideish text-white/60">{chip.label}</p>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-20 pt-40 sm:pb-28">
        <p className="ph-fade mb-6 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">{eyebrow}</p>
        <h1 className="max-w-4xl font-display text-fluid-display font-light leading-[0.95] tracking-tightest text-white">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="ph-line block">{line}</span>
            </span>
          ))}
        </h1>
        <p className="ph-fade mt-8 max-w-xl text-fluid-body text-white/70 opacity-0">{description}</p>
      </div>
    </section>
  );
}
