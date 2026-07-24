"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

const activities = [
  { title: "Fazenda Break", note: "Scenic dining just outside the city.", image: "/assets/stopover/act-fazenda.webp" },
  { title: "Market Buzz", note: "The colour and culture of Kimironko Market.", image: "/assets/stopover/act-market.jpg" },
  { title: "Memory & Legacy", note: "The Kigali Genocide Memorial.", image: "/assets/stopover/act-memorial.jpg" },
  { title: "Taste Rwanda", note: "Local dishes and world-class coffee.", image: "/assets/stopover/act-taste.jpg" },
];

export function StopoverThingsToDo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".td-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } }
        );
        if (reduced) return;
        // gentle vertical parallax inside each frame
        const img = card.querySelector("img");
        gsap.fromTo(
          img,
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="border-t border-line bg-paper-dim py-section-lg">
      <div ref={rootRef} className="mx-auto max-w-shell px-gutter">
        <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">While you&rsquo;re here</p>
        <h2 className="mt-4 max-w-xl font-display text-fluid-h2 font-light leading-[1.04] tracking-tightest text-ink">
          A day is enough to fall for Kigali
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a, i) => (
            <a
              key={a.title}
              href="#book"
              className={`td-card group relative block aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-line transition-shadow duration-500 ease-premium hover:shadow-2xl hover:shadow-blue-900/15 ${i % 2 === 1 ? "lg:mt-12" : ""}`}
            >
              <div className="absolute inset-0 will-change-transform">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                  className="scale-110 object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-125"
                />
              </div>
              {/* deeper, cleaner scrim so the type always sits on ink */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/25 to-blue-900/5" />

              {/* index, top-left — an editorial tell that these are a set */}
              <span className="absolute left-5 top-4 font-display text-fluid-sm text-white/60">
                0{i + 1}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-fluid-h3 font-light leading-tight tracking-tight text-white">
                  {a.title}
                </h3>
                <p className="mt-2 text-fluid-sm text-white/75">{a.note}</p>
                {/* an explore affordance that rises in on hover */}
                <span className="mt-3 flex translate-y-1 items-center gap-1.5 text-fluid-xs uppercase tracking-wideish text-gold-300 opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                  Explore <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
