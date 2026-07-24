"use client";

import { destinations } from "@/lib/data";
import { useScrollReveal } from "@/lib/motion";

/**
 * "Popular flights" — a where-we-fly links block that leads into the footer,
 * built entirely from the real route data grouped by region. Each region is a
 * "Flights to …" heading over its cities, the way an airline lists its network:
 * scannable, useful, and good for the links a real site would want here.
 */
const REGION_ORDER = [
  "East Africa",
  "West Africa",
  "Central Africa",
  "Southern Africa",
  "Europe",
  "Middle East",
] as const;

// "Flights to Middle East" needs the article to read right.
const regionLabel: Record<string, string> = { "Middle East": "the Middle East" };

export function PopularFlights() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 85%" });

  const groups = REGION_ORDER.map((region) => ({
    region,
    cities: destinations.filter((d) => d.region === region && !d.hub),
  })).filter((g) => g.cities.length > 0);

  return (
    <section id="popular-flights" className="border-t border-line bg-paper-bright py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="max-w-2xl">
          <p className="reveal-item text-fluid-xs uppercase tracking-wideish text-blue-500">Popular flights</p>
          <h2 className="reveal-item mt-4 font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
            Fly RwandAir across <span className="italic text-blue-500">the world</span>
          </h2>
          <p className="reveal-item mt-5 max-w-xl text-fluid-body text-ink/55">
            From the hub in Kigali to {destinations.length} cities across Africa, Europe and the Middle East — the
            whole network, one search away.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-11 sm:mt-16 sm:grid-cols-3 lg:grid-cols-6">
          {groups.map(({ region, cities }) => (
            <div key={region} className="reveal-item">
              <a
                href="/destinations"
                className="focus-ring group inline-flex items-center gap-1.5 font-display text-fluid-lg leading-tight text-ink transition-colors hover:text-blue-500"
              >
                Flights to {regionLabel[region] ?? region}
                <span aria-hidden className="text-blue-500 transition-transform duration-300 ease-premium group-hover:translate-x-1">
                  →
                </span>
              </a>
              <ul className="mt-4 space-y-2.5">
                {cities.map((c) => (
                  <li key={c.code}>
                    <a
                      href="/#book"
                      className="focus-ring text-fluid-sm text-ink/55 transition-colors hover:text-blue-500"
                    >
                      {c.city}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
