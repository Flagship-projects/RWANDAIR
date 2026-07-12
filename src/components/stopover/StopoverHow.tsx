"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

const steps = [
  {
    n: "01",
    title: "Connect through Kigali",
    body: "Fly a RwandAir-operated flight with a layover between 8 and 24 hours in Kigali.",
  },
  {
    n: "02",
    title: "Travel beyond Kigali",
    body: "Your final destination must be past Kigali — passengers to or from Kigali aren't eligible.",
  },
  {
    n: "03",
    title: "Book your stopover",
    body: "Email stopover@rwandair.com before you fly, or speak to our Transit & Stopover team on arrival.",
  },
];

const included = [
  "One complimentary hotel night",
  "Hotel taxes & standard amenities",
  "Breakfast & airport transfers*",
];
const excluded = ["Meals beyond the hotel", "Visa fees & personal expenses", "Room service & laundry"];

export function StopoverHow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(lineRef.current, { scaleY: 1 });
        gsap.set(".how-step", { opacity: 1, y: 0 });
        return;
      }
      // the connecting line draws downward as you scroll through the steps
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".how-steps", start: "top 65%", end: "bottom 75%", scrub: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".how-step").forEach((s) => {
        gsap.fromTo(
          s,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: s, start: "top 80%", once: true } }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
          {/* steps with a drawing line */}
          <div>
            <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">How it works</p>
            <h2 className="mt-4 max-w-md font-display text-fluid-h2 font-light leading-[1.04] tracking-tightest text-ink">
              Three steps to a night in Kigali
            </h2>

            <div className="how-steps relative mt-14 pl-12">
              <span className="absolute left-[15px] top-2 h-[calc(100%-3rem)] w-px bg-line" />
              <span
                ref={lineRef}
                className="absolute left-[15px] top-2 h-[calc(100%-3rem)] w-px origin-top bg-blue-500"
              />
              <div className="space-y-12">
                {steps.map((s) => (
                  <div key={s.n} className="how-step relative">
                    <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper-bright font-display text-fluid-xs text-blue-500">
                      {s.n}
                    </span>
                    <h3 className="font-display text-fluid-lg text-ink">{s.title}</h3>
                    <p className="mt-2 max-w-md text-fluid-body text-ink/60">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-10 pl-12 text-fluid-xs uppercase tracking-wideish text-ink/40">Offer valid through 30 July 2026</p>
          </div>

          {/* what's included / image */}
          <div className="flex flex-col gap-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/assets/stopover/hotel.jpg" alt="Hotel comfort in Kigali" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-fluid-xs uppercase tracking-wideish text-green-600">Included</p>
                <ul className="space-y-2.5">
                  {included.map((x) => (
                    <li key={x} className="flex gap-2 text-fluid-sm text-ink/70">
                      <span className="text-green-600">✓</span> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-fluid-xs uppercase tracking-wideish text-ink/40">Not included</p>
                <ul className="space-y-2.5">
                  {excluded.map((x) => (
                    <li key={x} className="flex gap-2 text-fluid-sm text-ink/45">
                      <span>—</span> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-fluid-xs text-ink/40">*Breakfast &amp; transfers depend on the participating hotel.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
