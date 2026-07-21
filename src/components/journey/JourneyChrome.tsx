"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/** The seven chapters of the journey, in order — shared by the rail and the counter. */
export const JOURNEY_CHAPTERS = [
  "The Dream",
  "Anticipation",
  "The Climb",
  "Life On Board",
  "First Light",
  "Where Journeys Lead",
  "Arrival",
];

/**
 * Journey's own minimal dark chrome. It never uses the light site Nav: a hairline
 * progress bar across the very top, the reversed logo, a live chapter counter,
 * a vertical chapter rail (desktop), and a quiet way back to the site. Everything
 * reads scroll directly — nothing re-renders on scroll except the active index,
 * which only changes seven times across the whole journey.
 */
export function JourneyChrome() {
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // progress bar — cheap scroll read, rAF-throttled
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const p = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // active chapter + chrome tint, driven by whichever chapter owns the middle band
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-chapter]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number(e.target.getAttribute("data-journey-chapter"));
          setActive(i);
          setDark(e.target.getAttribute("data-journey-light") !== "true");
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const fg = dark ? "text-white" : "text-ink";

  return (
    <>
      {/* progress hairline */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/10">
        <div
          ref={barRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-sky-300 via-gold-300 to-gold-400"
        />
      </div>

      {/* top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[65]">
        <div className="mx-auto flex max-w-shell items-center justify-between px-gutter py-5">
          <a href="/" className="focus-ring pointer-events-auto flex items-center gap-3">
            <Image
              src={dark ? "/assets/brand/logotype-dark.png" : "/assets/brand/logotype.png"}
              alt="RwandAir"
              width={150}
              height={35}
              priority
              className="h-6 w-auto transition-opacity duration-500 sm:h-7"
            />
          </a>

          <div className={cn("flex items-center gap-6 transition-colors duration-700", fg)}>
            <div className="hidden items-baseline gap-2 sm:flex">
              <span className="font-display text-fluid-sm tabular-nums">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="text-fluid-xs opacity-40">/</span>
              <span className="text-fluid-xs opacity-40 tabular-nums">07</span>
              <span className="ml-3 hidden text-fluid-xs uppercase tracking-wideish opacity-70 lg:inline">
                {JOURNEY_CHAPTERS[active]}
              </span>
            </div>
            <a
              href="/"
              className={cn(
                "focus-ring pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-fluid-xs uppercase tracking-wideish backdrop-blur-md transition-colors duration-300",
                dark
                  ? "border-white/20 text-white/80 hover:border-white/50 hover:text-white"
                  : "border-line-strong text-ink/70 hover:border-blue-500 hover:text-blue-500"
              )}
            >
              Exit
              <span aria-hidden>✕</span>
            </a>
          </div>
        </div>
      </header>

      {/* vertical chapter rail — desktop only */}
      <nav
        aria-label="Chapters"
        className="pointer-events-none fixed right-gutter top-1/2 z-[65] hidden -translate-y-1/2 flex-col items-end gap-3.5 xl:flex"
      >
        {JOURNEY_CHAPTERS.map((label, i) => (
          <a
            key={label}
            href={`#journey-${i}`}
            className="group pointer-events-auto flex items-center gap-3"
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-wideish opacity-0 transition-all duration-300 group-hover:opacity-100",
                dark ? "text-white/80" : "text-ink/70",
                i === active && "!opacity-100"
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "block h-px transition-all duration-500 ease-premium",
                i === active
                  ? "w-8 bg-gold-400"
                  : cn("w-4", dark ? "bg-white/30 group-hover:bg-white/60" : "bg-ink/25 group-hover:bg-ink/50")
              )}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
