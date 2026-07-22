"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { fleet, cabins } from "@/lib/data";

/**
 * "Built for the long haul" — a dark, cinematic chapter between two light
 * sections. Two acts:
 *
 *  1. The fleet — a full-bleed A330 exterior that parallaxes as it scrolls,
 *     with the two variants revealed as editorial entries.
 *  2. The cabins — an Apple-style pinned experience: a sticky full-bleed cabin
 *     photo cross-fades Business → Economy (each with a slow Ken-Burns push)
 *     while the copy swaps beneath a legibility scrim.
 *
 * Everything is driven by scrubbed ScrollTriggers over CSS `position: sticky`
 * (never a JS pin) so it never touches the global pin/scroll bookkeeping the
 * globe and route map rely on.
 */

const business = cabins.find((c) => c.name === "Business Class")!;
const economy = cabins.find((c) => c.name === "Economy Class")!;

export function FleetCabin() {
  const aircraftRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const cabinsRef = useRef<HTMLDivElement>(null);
  const bizMediaRef = useRef<HTMLDivElement>(null);
  const ecoMediaRef = useRef<HTMLDivElement>(null);
  const bizCopyRef = useRef<HTMLDivElement>(null);
  const ecoCopyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // 0 = Business, 1 = Economy
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    ensureGsapRegistered();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    const ctx = gsap.context(() => {
      /* ---- Act 1: aircraft exterior parallax + entry reveals ---- */
      gsap.fromTo(
        planeRef.current,
        { yPercent: -12, scale: 1.12 },
        {
          yPercent: 12,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: aircraftRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".fleet-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      /* ---- Act 2: pinned cabin cross-fade ---- */
      gsap.set(ecoMediaRef.current, { opacity: 0 });
      gsap.set(ecoCopyRef.current, { opacity: 0, yPercent: 8 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: cabinsRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            setActive(self.progress < 0.5 ? 0 : 1);
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        },
      });

      // Slow Ken-Burns push on the Business image while it holds.
      tl.fromTo(
        bizMediaRef.current!.firstElementChild,
        { scale: 1.18 },
        { scale: 1.04, duration: 0.5 },
        0
      );
      // Cross-fade Business → Economy at the midpoint.
      tl.to(bizMediaRef.current, { opacity: 0, duration: 0.16 }, 0.42);
      tl.to(ecoMediaRef.current, { opacity: 1, duration: 0.16 }, 0.42);
      // Economy Ken-Burns push through the second half.
      tl.fromTo(
        ecoMediaRef.current!.firstElementChild,
        { scale: 1.18 },
        { scale: 1.04, duration: 0.5 },
        0.5
      );

      // Copy swap, offset slightly from the image so it reads as a beat.
      tl.to(bizCopyRef.current, { opacity: 0, yPercent: -8, duration: 0.12 }, 0.4);
      tl.to(ecoCopyRef.current, { opacity: 1, yPercent: 0, duration: 0.14 }, 0.48);
    });

    return () => ctx.revert();
  }, []);

  /* ---------------- reduced-motion / no-JS fallback ---------------- */
  if (reduced) {
    return (
      <section id="experience" className="bg-ink py-section-lg text-paper">
        <div className="mx-auto max-w-shell px-gutter">
          <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-gold-400">The fleet</p>
          <h2 className="max-w-2xl font-display text-fluid-h2 font-light tracking-tightest">Built for the long haul</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {fleet.map((f) => (
              <div key={f.name} className="border-t border-white/15 pt-5">
                <p className="font-display text-fluid-lg">{f.name}</p>
                <p className="text-fluid-xs uppercase tracking-wideish text-sky-300">{f.role}</p>
                <p className="mt-3 text-fluid-sm text-white/60">{f.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[{ c: business, img: "/assets/fleet/business-cabin.jpg" }, { c: economy, img: "/assets/fleet/economy-cabin.jpg" }].map(({ c, img }) => (
              <div key={c.name} className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <Image src={img} alt={c.name} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="font-display text-fluid-lg">{c.name}</p>
                  <ul className="mt-3 space-y-1.5 text-fluid-sm text-white/60">
                    {c.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="relative bg-ink text-paper">
      {/* ============================ ACT 1 — THE FLEET ============================ */}
      <div ref={aircraftRef} className="relative overflow-hidden">
        {/* full-bleed exterior render, parallaxing */}
        <div className="absolute inset-0 overflow-hidden">
          <div ref={planeRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/assets/aircraft/a330-200.jpg"
              alt="RwandAir Airbus A330 in flight"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={false}
            />
          </div>
          {/* scrims: darken top for nav legibility, deep floor for the copy */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/25 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-shell flex-col justify-between px-gutter py-section-md">
          {/* intro */}
          <div className="max-w-2xl pt-10 sm:pt-16">
            <p className="fleet-reveal mb-5 text-fluid-xs uppercase tracking-wideish text-gold-400">The fleet</p>
            <h2 className="fleet-reveal font-display text-fluid-h1 font-light leading-[0.95] tracking-tightest">
              Built for the <span className="italic">long haul</span>.
            </h2>
            <p className="fleet-reveal mt-6 max-w-lg text-fluid-body text-white/70">
              Wide-body Airbus A330s form the backbone of RwandAir&apos;s intercontinental network —
              carrying the dream of Africa to Europe, the Gulf and beyond.
            </p>
          </div>

          {/* the two variants, as editorial entries */}
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-sm sm:mt-16 sm:grid-cols-2">
            {fleet.map((f, i) => (
              <div key={f.name} className="fleet-reveal group relative p-6 sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-fluid-lg text-gold-400/80">0{i + 1}</span>
                  <span className="text-fluid-xs uppercase tracking-wideish text-sky-300">{f.role}</span>
                </div>
                <p className="mt-6 font-display text-fluid-h3 font-light tracking-tightest">{f.name}</p>
                <p className="mt-3 max-w-sm text-fluid-sm leading-relaxed text-white/60">{f.detail}</p>
                {/* hairline that grows on hover */}
                <span className="mt-6 block h-px w-12 origin-left bg-gold-400/60 transition-transform duration-500 ease-premium group-hover:scale-x-[3.2]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================ ACT 2 — THE CABINS ============================ */}
      <div ref={cabinsRef} className="relative h-[210svh] md:h-[300vh]">
        <div className="sticky top-0 stage-vh overflow-hidden">
          {/* cross-fading media */}
          <div ref={bizMediaRef} className="absolute inset-0">
            <div className="absolute inset-0 will-change-transform">
              <Image src="/assets/fleet/business-cabin.jpg" alt="RwandAir Business Class cabin" fill sizes="100vw" className="object-cover" />
            </div>
          </div>
          <div ref={ecoMediaRef} className="absolute inset-0">
            <div className="absolute inset-0 will-change-transform">
              <Image src="/assets/fleet/economy-cabin.jpg" alt="RwandAir Economy Class cabin" fill sizes="100vw" className="object-cover" />
            </div>
          </div>

          {/* legibility scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/10 to-transparent" />

          {/* content */}
          <div className="relative z-10 flex h-full items-end">
            <div className="mx-auto w-full max-w-shell px-gutter pb-16 sm:pb-24">
              <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                {/* stacked copy — only the active cabin is visible */}
                {/* the two cabins are stacked absolutely, so this reserves the
                    taller of them — on a narrow column the benefit list wraps
                    and needs noticeably more room than it does on a desktop */}
                <div className="relative min-h-[23rem] sm:min-h-[16rem]">
                  <div ref={bizCopyRef} className="absolute inset-0">
                    <CabinCopy index="01" label="Business Class" accent="text-green-300" points={business.points} note="Lie-flat, forward-facing and quietly generous." />
                  </div>
                  <div ref={ecoCopyRef} className="absolute inset-0">
                    <CabinCopy index="02" label="Economy Class" accent="text-sky-300" points={economy.points} note="Thoughtful comfort across the whole network." />
                  </div>
                </div>

                {/* cabin index rail */}
                <div className="hidden items-center gap-6 justify-self-end lg:flex">
                  <div className="flex flex-col gap-5 text-right">
                    {["Business", "Economy"].map((name, i) => (
                      <div key={name} className={`transition-all duration-500 ${active === i ? "opacity-100" : "opacity-35"}`}>
                        <span className="font-display text-fluid-xs text-white/50">0{i + 1}</span>
                        <p className={`font-display text-fluid-lg ${active === i ? "text-paper" : "text-white/50"}`}>{name}</p>
                      </div>
                    ))}
                  </div>
                  {/* vertical scroll progress */}
                  <div className="relative h-40 w-px bg-white/15">
                    <div ref={progressRef} className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-gold-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* corner label */}
          <div className="pointer-events-none absolute left-gutter top-16 z-10">
            <p className="text-fluid-xs uppercase tracking-wideish text-white/45">On board · A330</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- sub-copy -------------------------------- */

function CabinCopy({
  index,
  label,
  accent,
  points,
  note,
}: {
  index: string;
  label: string;
  accent: string;
  points: string[];
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`text-fluid-xs uppercase tracking-wideish ${accent}`}>Cabin {index}</span>
        <span className="h-px w-8 bg-white/25" />
      </div>
      <h3 className="mt-4 font-display text-fluid-h2 font-light leading-[0.98] tracking-tightest">{label}</h3>
      <p className="mt-3 max-w-md text-fluid-body text-white/70">{note}</p>
      <ul className="mt-7 max-w-md">
        {points.map((p, i) => (
          <li key={p} className="flex items-baseline gap-4 border-t border-white/12 py-3.5">
            <span className="font-display text-fluid-xs text-white/35">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-fluid-sm text-white/80">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
