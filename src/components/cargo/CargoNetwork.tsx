"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { cargoStats, cargoFacts } from "@/lib/cargo";

/**
 * Freighter + network chapter: a clip-path "hangar door" reveal on the image
 * (distinct from every other reveal on the site), stat counters that spin up,
 * and a two-column editorial block.
 */
export function CargoNetwork() {
  const rootRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(imgWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(".cargo-stat-num", { opacity: 1 });
        return;
      }

      // hangar-door clip reveal, scrubbed
      gsap.fromTo(
        imgWrapRef.current,
        { clipPath: "inset(12% 42% 12% 42%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: imgWrapRef.current, start: "top 85%", end: "top 30%", scrub: 1 },
        }
      );
      // slow drift inside the frame
      gsap.fromTo(
        imgWrapRef.current!.querySelector("img"),
        { scale: 1.15, yPercent: -4 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: imgWrapRef.current, start: "top 85%", end: "bottom 20%", scrub: 1 },
        }
      );

      // counters spin up once
      root.querySelectorAll<HTMLElement>(".cargo-stat-num").forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const suffix = el.dataset.suffix ?? "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        {/* hangar-door image reveal */}
        <div ref={imgWrapRef} className="relative aspect-[16/8] overflow-hidden rounded-2xl will-change-[clip-path]">
          <Image
            src="/assets/cargo/freighter.jpg"
            alt="RwandAir freighter loading at Kigali"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
          <p className="absolute bottom-6 left-6 text-fluid-xs uppercase tracking-wideish text-white/80">
            Boeing 737-800F · Kigali International Airport
          </p>
        </div>

        {/* editorial block */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">The network</p>
            <h2 className="mt-4 font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
              {cargoFacts.freighter.title}
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="max-w-lg text-fluid-body text-ink/60">{cargoFacts.freighter.body}</p>
            <p className="mt-4 max-w-lg text-fluid-body text-ink/60">
              Every passenger departure is cargo capacity too — belly-hold space on {""}
              <span className="text-ink">31 routes</span> across Africa, Europe and the Middle East.
            </p>
          </div>
        </div>

        {/* stats */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {cargoStats.map((s) => (
            <div key={s.label} className="bg-paper-bright px-8 py-10">
              <p
                className="cargo-stat-num font-display text-fluid-h2 font-light leading-none text-blue-500"
                data-value={s.value}
                data-suffix={s.suffix}
              >
                0
              </p>
              <p className="mt-3 text-fluid-xs uppercase tracking-wideish text-ink/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
