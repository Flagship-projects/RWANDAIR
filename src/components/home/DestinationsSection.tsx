"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { destinations } from "@/lib/data";
import { useScrollReveal } from "@/lib/motion";

const DestinationGlobe = dynamic(
  () => import("@/components/three/DestinationGlobe").then((m) => m.DestinationGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center lg:aspect-auto lg:h-[520px]">
        <div className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
      </div>
    ),
  }
);

const regions = Array.from(new Set(destinations.map((d) => d.region)));

export function DestinationsSection() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 78%" });

  return (
    <section id="destinations" className="py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        {/* On a phone the globe is the point of this section, so it comes second
            — straight after the heading, before the numbers — instead of being
            stranded at the bottom under a wall of type. On two columns it sits
            beside everything, as before. */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="contents lg:block">
            <SectionHeading
              eyebrow="Route network"
              title="One hub. A continent, and beyond."
              description={`From Kigali, RwandAir connects ${destinations.length} cities across East, West, Central and Southern Africa, plus long-haul links to Europe and the Middle East — every route traced live from the hub.`}
            />
            <div className="reveal-item order-3 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:mt-10">
              {regions.map((region) => (
                <div key={region}>
                  <p className="text-fluid-xs uppercase tracking-wideish text-ink/45">{region}</p>
                  <p className="mt-1 font-display text-fluid-lg text-blue-500">
                    {destinations.filter((d) => d.region === region).length}
                  </p>
                </div>
              ))}
            </div>
            <div className="reveal-item order-4 lg:mt-12">
              <ArrowButton href="/destinations">Explore all destinations</ArrowButton>
            </div>
          </div>
          <div className="reveal-item order-2">
            <DestinationGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
