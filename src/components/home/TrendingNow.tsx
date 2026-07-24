"use client";

import { JourneyFilm } from "@/components/journey/JourneyVideo";
import { useScrollReveal } from "@/lib/motion";

/**
 * "Trending right now" — one cinematic RwandAir film, framed dark so the play
 * moment lands between two lighter sections. It reuses the JourneyFilm plate
 * (designed poster that swaps to the real YouTube player on click), so there is
 * only ever one definition of what a film looks like on the site.
 */
export function TrendingNow() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });

  return (
    <section id="trending" className="border-t border-white/10 bg-ink py-section-lg text-paper" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal-item flex items-center gap-2.5 text-fluid-xs uppercase tracking-wideish text-gold-400">
              {/* a live "on air" dot, so the label reads as genuinely current */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
              Trending right now
            </p>
            <h2 className="reveal-item mt-5 max-w-2xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest">
              The dream, <span className="italic text-gold-300">in motion</span>.
            </h2>
          </div>
          <p className="reveal-item max-w-sm text-fluid-body text-paper/55">
            Step on board before you ever fly. A minute of RwandAir, from the welcome at the door to the view from the window.
          </p>
        </div>

        <div className="reveal-item mt-10 sm:mt-14">
          <JourneyFilm
            id="fuU80ktVTFQ"
            kicker="RwandAir · The film"
            line="Watch the doors open on the real thing."
          />
        </div>
      </div>
    </section>
  );
}
