"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { ArrowButton } from "@/components/ui/ArrowButton";

/**
 * Closing CTA shared by the interior IA pages — a parallaxed photographic plate
 * under a flat colour wash, so every page lands on the same note before the footer.
 */
export function PageCTA({
  eyebrow,
  title,
  image,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: React.ReactNode;
  image: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
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
        {
          scale: 1.05,
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[70svh] items-center overflow-hidden bg-blue-900">
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" aria-hidden />
      </div>
      <div className="absolute inset-0 bg-blue-900/70" />

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter text-center">
        <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-gold-400">{eyebrow}</p>
        <h2 className="mx-auto max-w-3xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
          {title}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ArrowButton href={primary.href}>{primary.label}</ArrowButton>
          {secondary && (
            <a
              href={secondary.href}
              className="focus-ring text-fluid-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {secondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
