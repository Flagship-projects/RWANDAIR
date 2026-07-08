"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/lib/motion";

const featured = [
  { city: "Nairobi", country: "Kenya", note: "East Africa's business gateway" },
  { city: "Lagos", country: "Nigeria", note: "West Africa's commercial hub" },
  { city: "Johannesburg", country: "South Africa", note: "Southern Africa connector" },
  { city: "Dubai", country: "United Arab Emirates", note: "Long-haul link to the Gulf" },
  { city: "London", country: "United Kingdom", note: "RwandAir's European gateway" },
  { city: "Accra", country: "Ghana", note: "West African coastal capital" },
];

export function FeaturedDestinations() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });

  return (
    <section className="border-t border-line py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <SectionHeading
          eyebrow="Featured routes"
          title="Where the dream takes you"
          className="reveal-item"
        />

        <div className="mt-16 grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
          {featured.map((f, i) => (
            <a
              key={f.city}
              href="#book"
              className="reveal-item group relative flex flex-col justify-between gap-10 border-b border-line px-2 py-10 transition-colors duration-300 hover:bg-blue-50 sm:border-b-0 sm:px-8"
            >
              <span className="font-display text-fluid-lg text-ink/25">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-fluid-h3 font-light leading-none tracking-tightest text-ink transition-transform duration-500 ease-premium group-hover:-translate-y-1 group-hover:text-blue-500">
                  {f.city}
                </h3>
                <p className="mt-3 text-fluid-sm text-ink/55">{f.country} — {f.note}</p>
              </div>
              <span className="text-fluid-xs uppercase tracking-wideish text-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Search flights →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
