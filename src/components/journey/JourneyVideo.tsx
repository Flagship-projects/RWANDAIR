"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A RwandAir film, presented as a designed plate that becomes a real player.
 *
 * At rest it's a cinematic poster — rounded like every other plate on the page,
 * graded for legibility, carrying its chapter caption and a quiet play badge.
 * One click swaps in the actual YouTube player (privacy-enhanced host) with its
 * native controls: play/pause, volume, scrubbing, fullscreen. The caption gets
 * out of the way the moment the film starts.
 *
 * `journey-player` re-enables pointer events under Lenis (globals.css), since
 * Lenis's recommended styles disable them on iframes during smooth scroll.
 */
export function JourneyFilm({
  id,
  kicker,
  line,
  className,
}: {
  id: string;
  kicker: string;
  line: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-[24px] bg-[#041c3f]",
        "shadow-[0_40px_100px_-30px_rgba(2,14,36,0.8)] ring-1 ring-inset ring-white/10",
        className
      )}
    >
      {playing ? (
        <iframe
          className="journey-player absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
          title={line}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${line}`}
          className="focus-ring absolute inset-0 block h-full w-full cursor-pointer text-left"
        >
          {/* poster */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-premium group-hover:scale-[1.03]"
          />
          {/* legibility grade */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041c3f]/85 via-[#041c3f]/15 to-[#041c3f]/30" />

          {/* play badge */}
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-white/30 transition-transform duration-700 ease-premium group-hover:scale-110" />
            <span className="absolute inset-2 rounded-full bg-white/15 backdrop-blur-md transition-colors duration-500 group-hover:bg-white/25" />
            <svg viewBox="0 0 24 24" className="relative ml-1 h-7 w-7 text-white" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>

          {/* caption */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 block p-7 sm:p-10">
            <span className="mb-4 block text-fluid-xs uppercase tracking-[0.3em] text-gold-300/90">{kicker}</span>
            <span className="block max-w-md font-display text-fluid-h3 font-light leading-[1.1] tracking-tight text-white">
              {line}
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-fluid-xs uppercase tracking-[0.22em] text-white/60">
              Watch the film
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
