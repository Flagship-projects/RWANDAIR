"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

const text =
  "Kigali sits at the centre of the continent — the shortest path between where things grow and where the world needs them.";

/**
 * A statement that "develops" word by word as you scroll: each word lifts from
 * dim to ink, scrubbed to scroll. Distinct from any fade/slide reveal.
 */
export function CargoStatement() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const words = root.querySelectorAll(".stmt-word");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 60%", scrub: 1 },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <p className="mb-8 text-fluid-xs uppercase tracking-wideish text-blue-500">Why Kigali</p>
        <p className="max-w-5xl font-display text-fluid-h2 font-light leading-[1.08] tracking-tightest text-ink">
          {text.split(" ").map((w, i) => (
            <span key={i} className="stmt-word inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
