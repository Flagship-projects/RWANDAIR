"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useScrollReveal } from "@/lib/motion";

const services = [
  { title: "eSIM", detail: "Stay connected worldwide", emoji: "📱" },
  { title: "Hotels", detail: "Book your perfect stay", emoji: "🏨" },
  { title: "Car Rentals", detail: "Freedom at your destination", emoji: "🚗" },
  { title: "Tours", detail: "Discover Africa your way", emoji: "🌍" },
  { title: "Duty Free", detail: "Shop at 30,000 feet", emoji: "🛍️" },
  { title: "Dream Upgrade", detail: "Bid for your Business Class", emoji: "⬆️" },
];

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdditionalServices() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 82%", stagger: 0.09 });
  const trackRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ start: false, end: false });

  // Track how far the rail can still travel, so the arrows only offer a
  // direction that actually has more cards to reveal.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () =>
      setMore({
        start: el.scrollLeft > 4,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function nudge(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section id="services" className="border-t border-line py-section-lg" ref={ref}>
      {/* centered header */}
      <div className="mx-auto max-w-shell px-gutter">
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
      </div>

      {/* slider — one rail on every screen, touch-swipe native, arrow-driven on
          a desktop where there is no swipe. Cards are sized so the next one
          always peeks past the edge, which is what reads as "there is more". */}
      <div className="reveal-item relative mt-10 sm:mt-16">
        <div className="mx-auto max-w-shell">
          <div
            ref={trackRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-gutter px-gutter pb-2 sm:gap-4 lg:gap-5"
          >
            {services.map((s, i) => (
              <a
                key={s.title}
                href="#"
                className="group flex w-[44%] shrink-0 snap-start flex-col items-center rounded-2xl border border-line bg-paper-bright px-4 py-6 text-center transition-all duration-300 ease-premium hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-900/5 xs:w-[38%] sm:w-[31%] sm:px-5 sm:py-9 md:w-[23%] lg:w-[18.5%]"
              >
                <span className="svc-float mb-4 inline-block sm:mb-6" style={{ animationDelay: `${i * 0.28}s` }}>
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

        {/* desktop arrows — a mouse has no swipe, so hand it a control. They fade
            in only on the side that still has cards to show. */}
        <button
          type="button"
          aria-label="Previous services"
          onClick={() => nudge(-1)}
          className={cn(
            "absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper-bright text-ink shadow-lg shadow-blue-900/5 transition-all duration-300 ease-premium hover:border-blue-500 hover:text-blue-600 lg:flex",
            more.start ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <Chevron className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="More services"
          onClick={() => nudge(1)}
          className={cn(
            "absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper-bright text-ink shadow-lg shadow-blue-900/5 transition-all duration-300 ease-premium hover:border-blue-500 hover:text-blue-600 lg:flex",
            more.end ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <Chevron />
        </button>

        {/* touch hint — the swipe affordance for phones, mirrors the other rails */}
        <p className="mt-4 flex items-center gap-3 px-gutter text-fluid-xs uppercase tracking-wideish text-ink/40 lg:hidden">
          <span className="h-px w-8 bg-ink/25" /> Swipe to explore
        </p>
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
