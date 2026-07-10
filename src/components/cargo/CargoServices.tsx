"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { cargoServices } from "@/lib/cargo";

const icons = [
  // box
  "M3 7l9-4 9 4v10l-9 4-9-4V7Zm9-4v18M3 7l9 4 9-4",
  // leaf
  "M5 21c0-8 6-14 14-16 0 10-6 16-14 16Zm2-4c4-4 6-7 8-11",
  // cross / pharma
  "M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z",
  // paw / live animals
  "M12 13c3 0 5 2.5 5 4.5S15 20 12 20s-5-.5-5-2.5S9 13 12 13ZM6 9a1.6 1.6 0 1 1 0-3.2A1.6 1.6 0 0 1 6 9Zm12 0a1.6 1.6 0 1 1 0-3.2A1.6 1.6 0 0 1 18 9ZM9.5 7A1.4 1.4 0 1 1 9.5 4a1.4 1.4 0 0 1 0 3Zm5 0A1.4 1.4 0 1 1 14.5 4a1.4 1.4 0 0 1 0 3Z",
  // hazard triangle
  "M12 3l9 16H3L12 3Zm0 6v5m0 3h.01",
  // shield
  "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z",
];

export function CargoServices() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-svc]"));

    const ctx = gsap.context(() => {
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const current = cargoServices[active];

  return (
    <section className="border-t border-line bg-paper py-section-lg">
      <div ref={rootRef} className="mx-auto grid max-w-shell gap-12 px-gutter lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* sticky active display */}
        <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
          <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">What we carry</p>
          <div className="mt-6 flex items-baseline gap-4">
            <span key={`n-${active}`} className="animate-[fadeUp_.5s_ease] font-display text-fluid-h1 font-light leading-none text-blue-500/25">
              {current.code}
            </span>
          </div>
          <h2 key={`t-${active}`} className="mt-2 animate-[fadeUp_.5s_ease] font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
            {current.title}
          </h2>
          <div className="mt-8 flex gap-1.5">
            {cargoServices.map((s, i) => (
              <span
                key={s.code}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${i === active ? "bg-blue-500" : "bg-line"}`}
              />
            ))}
          </div>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>

        {/* scrolling list */}
        <div>
          {cargoServices.map((s, i) => (
            <div
              key={s.code}
              data-svc
              className={`flex min-h-[62vh] flex-col justify-center border-b border-line py-10 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-40"}`}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-line text-blue-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d={icons[i]} />
                </svg>
              </div>
              <h3 className="font-display text-fluid-h3 font-light leading-none tracking-tightest text-ink">{s.title}</h3>
              <p className="mt-5 max-w-md text-fluid-body text-ink/60">{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
