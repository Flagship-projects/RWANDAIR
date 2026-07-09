"use client";

import Image from "next/image";
import { useSmoothScroll, useScrollReveal } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { destinations, type Destination } from "@/lib/data";

const photos: Record<string, { image: string; note: string }> = {
  NBO: { image: "/assets/destinations/nairobi.jpg", note: "East Africa's business gateway" },
  LOS: { image: "/assets/destinations/lagos.jpg", note: "West Africa's commercial hub" },
  JNB: { image: "/assets/destinations/johannesburg.jpg", note: "The Southern Africa connector" },
  DXB: { image: "/assets/destinations/dubai.jpg", note: "Long-haul link to the Gulf" },
  LHR: { image: "/assets/destinations/london.jpg", note: "RwandAir's European gateway" },
  ACC: { image: "/assets/destinations/accra.jpg", note: "West African coastal capital" },
  DOH: { image: "/assets/destinations/doha.jpg", note: "Gateway to the Arabian Gulf" },
};

const regionOrder: Destination["region"][] = [
  "East Africa",
  "Central Africa",
  "West Africa",
  "Southern Africa",
  "Europe",
  "Middle East",
];

const featuredCities = destinations.filter((d) => photos[d.code]);

export default function DestinationsPage() {
  useSmoothScroll();
  const gridRef = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 85%" });
  const listRef = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 85%" });

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        {/* hero — Kigali, home */}
        <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-blue-900">
          <Image
            src="/assets/destinations/kigali.jpg"
            alt="The mountains of Rwanda"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/25 to-blue-900/40" />

          <a
            href="/"
            className="focus-ring absolute left-gutter top-28 z-10 flex items-center gap-2 text-fluid-xs uppercase tracking-wideish text-white/70 transition-colors hover:text-white"
          >
            ← Back home
          </a>

          <div className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-16 sm:pb-24">
            <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-gold-400">Where we fly</p>
            <h1 className="max-w-4xl font-display text-fluid-display font-light leading-[0.95] tracking-tightest text-white">
              A network that begins <span className="italic">at home</span>.
            </h1>
            <p className="mt-6 max-w-xl text-fluid-body text-white/70">
              From our hub in Kigali, RwandAir connects {destinations.length} cities across Africa, Europe and the
              Middle East — every one of them a door to the continent.
            </p>
          </div>
        </section>

        {/* featured cities with photography */}
        <section className="py-section-lg">
          <div className="mx-auto max-w-shell px-gutter">
            <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">Featured cities</p>
            <h2 className="max-w-2xl text-fluid-h2 font-display font-light leading-[1.02] tracking-tightest text-ink">
              Seven of the places the dream takes you
            </h2>

            <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCities.map((d) => (
                <a
                  key={d.code}
                  href="/#book"
                  className="reveal-item group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3]"
                >
                  <Image
                    src={photos[d.code].image}
                    alt={`${d.city}, ${d.country}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/85 via-blue-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                      <h3 className="font-display text-fluid-h3 font-light leading-none tracking-tightest text-white">
                        {d.city}
                      </h3>
                      <p className="mt-2 text-fluid-sm text-white/70">{d.country} — {photos[d.code].note}</p>
                    </div>
                    <span className="font-display text-fluid-lg text-white/40">{d.code}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* full network by region */}
        <section className="border-t border-line bg-paper-dim py-section-lg">
          <div className="mx-auto max-w-shell px-gutter">
            <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">The full map</p>
            <h2 className="max-w-2xl text-fluid-h2 font-display font-light leading-[1.02] tracking-tightest text-ink">
              Every city on the network
            </h2>

            <div ref={listRef} className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {regionOrder.map((region) => {
                const cities = destinations.filter((d) => d.region === region);
                return (
                  <div key={region} className="reveal-item">
                    <div className="flex items-baseline justify-between border-b border-line pb-3">
                      <h3 className="text-fluid-xs uppercase tracking-wideish text-ink/50">{region}</h3>
                      <span className="font-display text-fluid-sm text-blue-500">{cities.length}</span>
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {cities.map((d) => (
                        <li key={d.code} className="flex items-baseline justify-between gap-4">
                          <span className="text-fluid-body text-ink">
                            {d.city}
                            {d.hub && <span className="ml-2 text-fluid-xs uppercase tracking-wideish text-gold-500">Hub</span>}
                          </span>
                          <span className="font-display text-fluid-sm text-ink/40">{d.code}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-16">
              <ArrowButton href="/#book">Book your flight</ArrowButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
