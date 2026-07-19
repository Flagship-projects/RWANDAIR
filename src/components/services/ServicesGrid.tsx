"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { travelServices } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicesGrid() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".svc-card", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".svc-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".svc-grid", start: "top 78%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionHeading
          eyebrow="Travel services"
          title={<>Everything around <span className="italic">the flight</span></>}
          description="The ticket is one part of the journey. These are the things that make the rest of it work — arranged before you fly, or added to a booking you already hold."
        />

        <div className="svc-grid mt-16 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {travelServices.map((s, i) => {
            const Wrapper = s.href ? "a" : "div";
            return (
              <Wrapper
                key={s.name}
                {...(s.href ? { href: s.href } : {})}
                className={`svc-card group flex flex-col justify-between gap-10 bg-paper p-8 transition-colors duration-500 ${
                  s.href ? "focus-ring hover:bg-paper-bright" : ""
                }`}
              >
                <div>
                  <span className="font-display text-fluid-xs text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-fluid-lg leading-tight text-ink">{s.name}</h3>
                  <p className="mt-3 text-fluid-sm text-ink/60">{s.detail}</p>
                </div>

                {s.href ? (
                  <span className="flex items-center gap-2 text-fluid-xs uppercase tracking-wideish text-blue-500">
                    {s.cta}
                    <span className="transition-transform duration-500 ease-premium group-hover:translate-x-1">→</span>
                  </span>
                ) : (
                  <span className="text-fluid-xs uppercase tracking-wideish text-ink/30">Add at booking</span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
