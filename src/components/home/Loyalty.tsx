"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { loyaltyTiers } from "@/lib/data";
import { useScrollReveal } from "@/lib/motion";

export function Loyalty() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });

  return (
    <section id="loyalty" className="border-t border-line py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
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

          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {loyaltyTiers.map((tier) => (
              <div key={tier.tier} className="reveal-item bg-paper-bright px-8 py-8">
                <p className="font-display text-fluid-lg text-ink">{tier.tier}</p>
                <p className="mt-2 text-fluid-sm text-ink/60">{tier.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
