"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { loyaltyTiers } from "@/lib/data";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Gravity-shift moment: the DreamMiles tiers detach from the grid and drift
 * like objects in low gravity — floating, gently rotating, tilting toward the
 * cursor, while the whole cluster rolls a few degrees as it scrolls past.
 */
export function Loyalty() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const section = sectionRef.current;
    const cluster = clusterRef.current;
    if (!section || !cluster) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = Array.from(cluster.querySelectorAll<HTMLElement>(".tier-card"));

    const ctx = gsap.context(() => {
      // Head content rises in normally.
      if (headRef.current) {
        gsap.from(headRef.current.querySelectorAll(".reveal-item"), {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
      }

      if (reduced) {
        gsap.set(cards, { opacity: 1, clearProps: "transform" });
        return;
      }

      // Cards drift in from scattered positions, then settle.
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        rotation: () => gsap.utils.random(-8, 8),
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 72%", once: true },
      });

      // Continuous zero-gravity float (independent of scroll).
      const floats = cards.map((card, i) =>
        gsap.to(card, {
          y: `+=${gsap.utils.random(-16, 16)}`,
          rotation: gsap.utils.random(-2.5, 2.5),
          duration: gsap.utils.random(4.5, 7.5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.3,
        })
      );

      // Camera roll: the whole cluster rotates slightly as it scrolls through.
      gsap.fromTo(
        cluster,
        { rotate: -4 },
        {
          rotate: 4,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );

      // Cursor tilt: cards parallax toward the pointer at different depths.
      const quickX = cards.map((c) => gsap.quickTo(c, "x", { duration: 0.8, ease: "power3.out" }));
      const quickRY = cards.map((c) => gsap.quickTo(c, "rotationY", { duration: 0.8, ease: "power3.out" }));
      function onMove(e: MouseEvent) {
        const rect = section!.getBoundingClientRect();
        const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
        cards.forEach((_, i) => {
          const depth = 1 + (i % 3) * 0.6;
          quickX[i](nx * 26 * depth);
          quickRY[i](nx * 6 * depth);
        });
      }
      if (!window.matchMedia("(pointer: coarse)").matches) {
        section.addEventListener("mousemove", onMove);
      }

      return () => {
        floats.forEach((t) => t.kill());
        section.removeEventListener("mousemove", onMove);
      };
    }, section);

    return () => ctx.revert();
  }, []);

  const offsets = ["lg:ml-0", "lg:ml-16", "lg:ml-6"];

  return (
    <section ref={sectionRef} id="loyalty" className="overflow-hidden border-t border-line py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div ref={headRef}>
            <SectionHeading
              eyebrow="DreamMiles"
              title="Miles that go the distance"
              description="RwandAir's loyalty program rewards every journey — from your first flight to lounge access, upgrades and free tickets across our partner network."
              className="reveal-item"
            />
            <Button href="#" variant="outline" className="reveal-item mt-8">
              Join DreamMiles
            </Button>
          </div>

          <div ref={clusterRef} className="relative flex flex-col gap-6 [perspective:1000px]">
            {loyaltyTiers.map((tier, i) => (
              <div
                key={tier.tier}
                className={`tier-card will-change-transform rounded-2xl border border-line bg-paper-bright px-8 py-8 shadow-xl shadow-blue-900/5 ${offsets[i] ?? ""}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-fluid-lg text-ink">{tier.tier}</p>
                  <span className="font-display text-fluid-sm text-blue-500/50">0{i + 1}</span>
                </div>
                <p className="mt-2 text-fluid-sm text-ink/60">{tier.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
