"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { fleet } from "@/lib/data";

export function ExperienceFleet() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".fleet-item", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".fleet-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        ".fleet-plate",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="fleet" className="relative overflow-hidden bg-blue-900 py-section-lg text-white">
      <div className="absolute inset-0 opacity-25">
        <div className="fleet-plate absolute inset-0 will-change-transform">
          <Image src="/assets/aircraft/a330-livery-02.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-900/85 to-blue-900" />

      <div className="relative z-10 mx-auto max-w-shell px-gutter">
        <p className="fleet-item text-fluid-xs uppercase tracking-wideish text-gold-400">The fleet</p>
        <h2 className="fleet-item mt-4 max-w-2xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-white">
          The aircraft that carry <span className="italic">the dream</span>
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {fleet.map((a) => (
            <div key={a.name} className="fleet-item border-t border-white/20 pt-8">
              <p className="text-fluid-xs uppercase tracking-wideish text-white/50">{a.role}</p>
              <h3 className="mt-3 font-display text-fluid-h3 font-light tracking-tightest text-white">{a.name}</h3>
              <p className="mt-4 max-w-md text-fluid-body text-white/65">{a.detail}</p>
            </div>
          ))}
        </div>

        <p className="fleet-item mt-16 max-w-xl text-fluid-sm text-white/45">
          Alongside the long-haul A330s, a fleet of Boeing 737-800s and Bombardier CRJ900s and Q400s works the regional
          network across East, West, Central and Southern Africa.
        </p>
      </div>
    </section>
  );
}
