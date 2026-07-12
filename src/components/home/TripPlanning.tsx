"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useScrollReveal } from "@/lib/motion";

const trending = [
  { city: "Dubai", country: "United Arab Emirates", image: "/assets/destinations/dubai.jpg" },
  { city: "London", country: "United Kingdom", image: "/assets/destinations/london.jpg" },
  { city: "Johannesburg", country: "South Africa", image: "/assets/destinations/johannesburg.jpg" },
  { city: "Nairobi", country: "Kenya", image: "/assets/destinations/nairobi.jpg" },
];

export function TripPlanning() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 82%" });

  return (
    <section id="trip-planning" className="border-t border-line bg-paper-dim py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Trip planning"
            title="Trending right now"
            className="reveal-item"
          />
          <div className="reveal-item">
            <ArrowButton href="/destinations">See all destinations</ArrowButton>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {trending.map((t, i) => (
            <a
              key={t.city}
              href="/#book"
              className="reveal-item group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={t.image}
                alt={`${t.city}, ${t.country}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/85 via-blue-900/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wideish text-blue-600">
                #{i + 1} Trending
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-fluid-h3 font-light leading-none tracking-tightest text-white">{t.city}</h3>
                <p className="mt-1.5 text-fluid-sm text-white/70">{t.country}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
