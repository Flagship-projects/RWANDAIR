"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/lib/motion";

const services = [
  {
    title: "e-SIM",
    detail: "Stay connected the moment you land with a travel data eSIM.",
    icon: "M8 3h5l4 4v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z M13 3v4h4 M10 12h4 M10 15h4",
  },
  {
    title: "Hotels",
    detail: "Book your stay at the destination as you plan your flight.",
    icon: "M3 20V9l7-4 7 4v11 M3 20h18 M9 20v-4h4v4 M9 10h.01 M13 10h.01 M9 13h.01 M13 13h.01",
  },
  {
    title: "Car Rentals",
    detail: "Pick up a car and explore on your own schedule.",
    icon: "M5 15h14 M6.5 15l1-4a2 2 0 0 1 1.9-1.4h5.2A2 2 0 0 1 16.5 11l1 4 M4.5 15v2.5 M19.5 15v2.5 M8 12.5h8",
  },
  {
    title: "Tours",
    detail: "Curated experiences and day trips across our network.",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M15 9l-1.6 4.4L9 15l1.6-4.4L15 9Z",
  },
  {
    title: "Duty Free",
    detail: "Pre-order duty free and collect it on board.",
    icon: "M6 8h12l-1 11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 8Z M9 8V6a3 3 0 0 1 6 0v2",
  },
  {
    title: "Dream Upgrade",
    detail: "Bid for an upgrade to Business Class on eligible flights.",
    icon: "M6 14l6-6 6 6 M6 19l6-6 6 6",
  },
];

export function AdditionalServices() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 82%" });

  return (
    <section id="services" className="border-t border-line py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <SectionHeading
          eyebrow="Additional services"
          title="Everything for the journey"
          className="reveal-item"
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <a
              key={s.title}
              href="#"
              className="reveal-item group flex flex-col gap-5 bg-paper-bright px-8 py-9 transition-colors duration-300 hover:bg-blue-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-blue-500 transition-transform duration-500 ease-premium group-hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d={s.icon} />
                </svg>
              </span>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-fluid-lg text-ink">{s.title}</h3>
                  <span className="text-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">→</span>
                </div>
                <p className="mt-2 text-fluid-sm text-ink/55">{s.detail}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
