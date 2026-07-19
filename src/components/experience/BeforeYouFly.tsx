"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { beforeYouFly } from "@/lib/data";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="byf-item border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="focus-ring flex w-full items-start justify-between gap-8 py-7 text-left"
      >
        <span className="font-display text-fluid-lg leading-tight text-ink">{q}</span>
        <span className="relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
          <span className="absolute h-px w-4 bg-ink/50" />
          <span
            className={`absolute h-4 w-px bg-ink/50 transition-transform duration-500 ease-premium ${
              open ? "rotate-90 opacity-0" : ""
            }`}
          />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-premium"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-8 pr-12 text-fluid-body text-ink/60">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function BeforeYouFly() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".byf-item", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".byf-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".byf-list", start: "top 75%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="before-you-fly" className="bg-paper-dim py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">Before you fly</p>
            <h2 className="mt-4 max-w-sm font-display text-fluid-h2 font-light leading-[1.04] tracking-tightest text-ink">
              The practical things, answered
            </h2>
            <p className="mt-6 max-w-sm text-fluid-body text-ink/60">
              Baggage, check-in, documents and everything else worth knowing before you reach the airport.
            </p>
          </div>

          <div className="byf-list border-t border-line">
            {beforeYouFly.map((item, i) => (
              <Item
                key={item.q}
                q={item.q}
                a={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
