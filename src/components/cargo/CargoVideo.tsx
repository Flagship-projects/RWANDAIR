"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/lib/motion";

const YOUTUBE_ID = "MU8ur5dy3CM";

/**
 * A lite YouTube facade: shows our own poster image and a play control, and
 * only loads the actual YouTube iframe after the user clicks — so nothing
 * heavy downloads, nothing autoplays, and no sound starts unexpectedly.
 */
export function CargoVideo() {
  const [playing, setPlaying] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 78%" });

  return (
    <section className="border-t border-line bg-paper-dim py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="reveal-item max-w-2xl">
          <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">Watch</p>
          <h2 className="font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
            The RwandAir Cargo story
          </h2>
        </div>

        <div className="reveal-item relative mt-14 aspect-video overflow-hidden rounded-2xl bg-blue-900 shadow-xl shadow-blue-900/10">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
              title="The RwandAir Cargo story"
              allow="accelerate-motion; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play: The RwandAir Cargo story"
              className="focus-ring group absolute inset-0 h-full w-full"
            >
              <Image
                src="/assets/cargo/Cargo.jpeg"
                alt="RwandAir Cargo Boeing 737 freighter on the ramp"
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-900/25 transition-colors duration-500 group-hover:bg-blue-900/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform duration-500 ease-premium group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7 text-blue-600">
                    <path d="M8 5v14l11-7Z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
