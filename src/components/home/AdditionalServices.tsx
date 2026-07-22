"use client";

import { useScrollReveal } from "@/lib/motion";

const services = [
  { title: "eSIM", detail: "Stay connected worldwide", emoji: "📱" },
  { title: "Hotels", detail: "Book your perfect stay", emoji: "🏨" },
  { title: "Car Rentals", detail: "Freedom at your destination", emoji: "🚗" },
  { title: "Tours", detail: "Discover Africa your way", emoji: "🌍" },
  { title: "Duty Free", detail: "Shop at 30,000 feet", emoji: "🛍️" },
  { title: "Dream Upgrade", detail: "Bid for your Business Class", emoji: "⬆️" },
];

export function AdditionalServices() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 82%", stagger: 0.09 });

  return (
    <section id="services" className="border-t border-line py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        {/* centered header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="reveal-item text-fluid-xs uppercase tracking-wideish text-gold-400">Travel services</p>
          <h2 className="reveal-item mt-5 font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
            Everything You Need,
            <br />
            <span className="italic text-gold-400">All in One Place</span>
          </h2>
          <p className="reveal-item mx-auto mt-6 max-w-md text-fluid-body text-ink/55">
            Beyond flights — your complete travel companion from departure to destination.
          </p>
        </div>

        {/* cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {services.map((s, i) => (
            <a
              key={s.title}
              href="#"
              className="reveal-item group flex flex-col items-center rounded-2xl border border-line bg-paper-bright px-4 py-6 text-center transition-all duration-300 ease-premium hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-900/5 sm:px-5 sm:py-9"
            >
              <span
                className="svc-float mb-4 inline-block sm:mb-6"
                style={{ animationDelay: `${i * 0.28}s` }}
              >
                <span className="block text-4xl transition-transform duration-300 ease-premium group-hover:-rotate-6 group-hover:scale-125 sm:text-5xl">
                  {s.emoji}
                </span>
              </span>
              <h3 className="font-display text-fluid-lg font-medium text-ink transition-colors duration-300 group-hover:text-blue-600">
                {s.title}
              </h3>
              <p className="mt-2 text-fluid-sm text-ink/55">{s.detail}</p>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes svc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .svc-float { animation: svc-float 3.6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
