"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { milesEarn, milesRedeem } from "@/lib/data";

function Column({ label, title, items }: { label: string; title: string; items: { label: string; detail: string }[] }) {
  return (
    <div>
      <p className="er-item text-fluid-xs uppercase tracking-wideish text-blue-500">{label}</p>
      <h3 className="er-item mt-4 font-display text-fluid-h3 font-light leading-[1.05] tracking-tightest text-ink">
        {title}
      </h3>
      <dl className="mt-10 border-t border-line">
        {items.map((item) => (
          <div key={item.label} className="er-item border-b border-line py-6">
            <dt className="font-display text-fluid-lg text-ink">{item.label}</dt>
            <dd className="mt-2 max-w-md text-fluid-sm text-ink/60">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EarnAndRedeem() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".er-item", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".er-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="earn" className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Column label="Earning" title="Miles add up faster than you'd think" items={milesEarn} />
          <Column label="Redeeming" title="Spend them on what you actually want" items={milesRedeem} />
        </div>
      </div>
    </section>
  );
}
