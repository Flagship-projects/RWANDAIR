"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { ensureGsapRegistered, useScrollReveal } from "@/lib/motion";

const facts = [
  { value: "1 night", label: "Complimentary hotel" },
  { value: "8–24h", label: "Eligible layover" },
  { value: "Free", label: "Airport transfers*" },
];

export function StopoverStrip() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const el = imgRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector("img"),
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stopover" className="relative overflow-hidden border-t border-line" ref={ref}>
      <div className="relative grid lg:grid-cols-2">
        <div ref={imgRef} className="relative min-h-[300px] overflow-hidden sm:min-h-[440px]">
          <Image
            src="/assets/stopover/kigali.jpg"
            alt="Kigali, Rwanda"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 via-blue-900/10 to-blue-900/25" />
          <div className="reveal-item absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span className="text-fluid-xs uppercase tracking-wideish text-ink">Complimentary one-night hotel stay</span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 bg-paper-bright px-gutter py-section-md sm:gap-8">
          <div className="reveal-item">
            <p className="flex items-center gap-2.5 text-fluid-xs uppercase tracking-wideish text-blue-500">
              <span className="h-px w-8 bg-blue-500/50" /> Kigali Stopover
            </p>
            <h2 className="mt-5 max-w-lg font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-ink">
              A night in <span className="italic text-blue-500">Kigali</span>, on us.
            </h2>
          </div>
          <p className="reveal-item max-w-xl text-fluid-body text-ink/60">
            Turn your layover into an experience. Eligible transit passengers connecting through Kigali can enjoy a
            complimentary one-night hotel stay — a chance to relax, recharge, or discover the charm of Rwanda&rsquo;s
            vibrant capital.
          </p>

          <div className="reveal-item grid grid-cols-3 gap-4 border-y border-line py-6">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="font-display text-fluid-lg text-blue-500">{f.value}</p>
                <p className="mt-1 text-fluid-xs uppercase tracking-wideish text-ink/45">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="reveal-item">
            <ArrowButton href="/stopover">Learn more</ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
