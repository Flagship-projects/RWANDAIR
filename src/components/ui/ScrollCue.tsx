"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { scrollPageBy } from "@/lib/motion";

/**
 * The "there is more" cue.
 *
 * Every section on this site fills the viewport and resolves into a composed
 * frame, so a visitor who stops scrolling can easily read the frame as the end
 * of the page. This is the site-wide answer: a small "Keep scrolling" mark with
 * the bead-on-a-rail motif the hero already uses. It only ever appears when the
 * visitor has been still for a moment with real content left below, and it
 * leaves the instant they move again, so it never competes with the design and
 * never nags. Clicking it takes the page down one frame, so the hint is also
 * the action.
 *
 * It sits bottom-left in the gutter: the booking pill owns bottom-centre on
 * the home page and the Journey's chapter rail owns the right edge.
 *
 * It is drawn in white with `mix-blend-mode: difference`, so it takes its ink
 * from whatever is actually painted beneath it: near-black on the white home
 * page, warm sand on the deep-blue journey, and still legible across the
 * gradients and photography in between, which no colour sampling could read.
 */
const IDLE_MS = 2600; // stillness before the cue appears
const FIRST_MS = 3800; // a little longer on landing, so it never races the intro
const REMAINING = 0.6; // viewport heights of content that must remain below

export function ScrollCue() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let timer = 0;
    let first = true;

    function hasRoomBelow() {
      const doc = document.documentElement;
      return doc.scrollHeight - (window.scrollY + window.innerHeight) > window.innerHeight * REMAINING;
    }

    /** True while something else already owns the moment: a locked page
        (loader, booking dock, modal); a hero that carries its own scroll cue
        and is still on screen (that one is the first-run hint and manages its
        own timing); or a control already painted where this would land, like
        the booking pill on a phone or a CTA row that reaches the gutter. */
    function somethingElseOwnsIt(el: HTMLElement) {
      if (document.documentElement.style.overflow === "hidden") return true;
      const own = document.querySelector<HTMLElement>("[data-scroll-cue]");
      if (own) {
        const r = own.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) return true;
      }
      // hidden, the cue has pointer-events: none, so elementFromPoint sees
      // straight through it to whatever it would sit on
      const r = el.getBoundingClientRect();
      const probes: [number, number][] = [
        [r.left + 2, r.top + 2],
        [r.right - 2, r.top + 2],
        [r.right - 2, r.bottom - 2],
      ];
      return probes.some((p) => document.elementFromPoint(...p)?.closest("a, button, input, [role='dialog']"));
    }

    function arm() {
      window.clearTimeout(timer);
      setShown(false);
      timer = window.setTimeout(() => {
        first = false;
        const el = rootRef.current;
        if (!el || !hasRoomBelow() || somethingElseOwnsIt(el)) {
          arm();
          return;
        }
        setShown(true);
      }, first ? FIRST_MS : IDLE_MS);
    }

    const events: (keyof WindowEventMap)[] = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={() => scrollPageBy(window.innerHeight * 0.85)}
      aria-label="Scroll down to continue"
      tabIndex={shown ? 0 : -1}
      className={cn(
        // phones get the hero's compact form (the word over the rail, ~60px wide,
        // so it clears the centred booking pill); wider screens get the full line
        "scroll-cue focus-ring group fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-gutter z-[60] flex flex-col items-center gap-1.5 text-white mix-blend-difference transition-all duration-700 ease-out sm:flex-row sm:items-end sm:gap-3",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <span className="flex flex-col items-center gap-1 text-left sm:order-2 sm:items-start">
        <span className="text-[10px] uppercase tracking-[0.32em] opacity-90">
          <span className="sm:hidden">Scroll</span>
          <span className="hidden sm:inline">Keep scrolling</span>
        </span>
        <span className="hidden font-display text-[13px] italic leading-none text-white/60 sm:block">
          the story continues below
        </span>
      </span>

      {/* the rail: a bead falls down it, over and over, saying "this way" */}
      <span className="relative block h-5 w-px overflow-hidden rounded-full bg-white/25 sm:order-1 sm:h-9" aria-hidden>
        <span className="scroll-cue-bead absolute left-0 top-0 block h-3 w-px rounded-full bg-white" />
      </span>

      <style jsx>{`
        .scroll-cue-bead {
          animation: scroll-cue-fall 1.9s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes scroll-cue-fall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(300%);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-cue-bead {
            animation: none;
            top: 40%;
          }
        }
      `}</style>
    </button>
  );
}
