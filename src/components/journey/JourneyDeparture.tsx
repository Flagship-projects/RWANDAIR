"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { JourneyVideo } from "./JourneyVideo";

/**
 * Chapter 2 — Every Journey Begins.
 *
 * The charged quiet of the hours before a flight, told as three unhurried
 * moments rather than a list of amenities. A lead line holds, then image plates
 * rise through a clip-reveal with their own inner parallax, each carrying a
 * single felt caption. Deliberately dark and slow — the calm before the climb.
 */
const MOMENTS = [
  {
    img: "/assets/Rwandair new assets/Serving In Business class.jpg",
    kicker: "The welcome",
    line: "Before you have gone anywhere, someone already knows your name.",
    align: "left",
  },
  {
    img: "/assets/aircraft/crew-service.jpg",
    kicker: "The care",
    line: "A thousand small things, arranged so you never have to think of one.",
    align: "right",
  },
  {
    img: "/assets/aircraft/press-cabin.jpg",
    kicker: "The threshold",
    line: "You settle in. The doors close. The world narrows to this quiet.",
    align: "left",
  },
];

export function JourneyDeparture() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // lead statement
      gsap.from(q(".dep-lead .reveal-line"), {
        yPercent: 120,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q(".dep-lead"), start: "top 78%" },
      });

      // each moment plate: clip-reveal, caption fade, inner image parallax
      q<HTMLElement>(".dep-plate").forEach((plate) => {
        const img = plate.querySelector<HTMLElement>(".dep-img");
        const cap = plate.querySelectorAll<HTMLElement>(".dep-cap > *");

        if (!reduced) {
          gsap.fromTo(
            plate,
            { clipPath: "inset(14% 8% 14% 8% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              ease: "power3.out",
              duration: 1.4,
              scrollTrigger: { trigger: plate, start: "top 82%" },
            }
          );
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -12, scale: 1.18 },
              {
                yPercent: 12,
                scale: 1.18,
                ease: "none",
                scrollTrigger: { trigger: plate, start: "top bottom", end: "bottom top", scrub: 1 },
              }
            );
          }
        }
        gsap.from(cap, {
          y: 26,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: plate, start: "top 68%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-1"
      data-journey-chapter="1"
      className="relative bg-[#07306a] px-gutter pb-section-lg pt-section-md"
    >
      {/* lead */}
      <div className="dep-lead mx-auto max-w-shell">
        <p className="mb-6 text-fluid-xs uppercase tracking-[0.32em] text-sky-300/80">
          Chapter Two — Anticipation
        </p>
        <h2 className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
          <span className="reveal-mask block">
            <span className="reveal-line block">Long before the wheels lift,</span>
          </span>
          <span className="reveal-mask block">
            <span className="reveal-line block italic text-white/70">the journey has already begun.</span>
          </span>
        </h2>
      </div>

      {/* moments */}
      <div className="mx-auto mt-section-md flex max-w-shell flex-col gap-section-md">
        {MOMENTS.map((m, i) => (
          <figure
            key={m.kicker}
            className={
              "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 " +
              (m.align === "right" ? "lg:flex-row-reverse" : "")
            }
          >
            <div className="dep-plate relative aspect-[4/3] w-full overflow-hidden rounded-[24px] lg:w-[58%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt="" className="dep-img absolute inset-0 h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07306a]/60 via-transparent to-transparent" />
            </div>
            <figcaption className="dep-cap lg:w-[42%]">
              <span className="mb-5 block text-fluid-xs uppercase tracking-[0.3em] text-gold-300/90">
                0{i + 1} — {m.kicker}
              </span>
              <p className="font-display text-fluid-h3 font-light leading-[1.12] tracking-tight text-white/90">
                {m.line}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* the film — real RwandAir footage, ambient and muted */}
      <figure className="mx-auto mt-section-md max-w-shell">
        <div className="dep-plate relative aspect-video w-full overflow-hidden rounded-[24px]">
          <JourneyVideo id="fuU80ktVTFQ" />
          {/* legibility grade + caption */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07306a]/70 via-transparent to-[#07306a]/20" />
          <figcaption className="pointer-events-none absolute bottom-0 left-0 p-7 sm:p-10">
            <span className="mb-4 block text-fluid-xs uppercase tracking-[0.3em] text-gold-300/90">
              The film — welcome on board
            </span>
            <p className="max-w-md font-display text-fluid-h3 font-light leading-[1.1] tracking-tight text-white">
              Watch the doors open on the real thing.
            </p>
          </figcaption>
        </div>
      </figure>

      {/* bridge into the sky */}
      <p className="mx-auto mt-section-md max-w-xl text-center font-display text-fluid-lg font-light italic leading-relaxed text-white/45">
        Then the engines gather their breath —
      </p>
    </section>
  );
}
