"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { setPageScrollLocked } from "@/lib/motion";
import { FlightSearchCard } from "./FlightSearch";

/**
 * The floating booking dock — booking stays one tap away for the whole scroll,
 * without ever sitting on top of the design.
 *
 * Three rules keep it lightweight rather than intrusive:
 *
 *  1. It stays out of the hero. The hero already offers "Book a flight", and the
 *     search panel is the very next thing on the page — a floating duplicate
 *     over either of those is noise. The dock only arrives once the booking
 *     section has scrolled away, and it retreats again whenever `#book` is back
 *     on screen.
 *  2. It opens in place. The pill sits at the bottom centre and the panel rises
 *     from the same edge, so the button reads as the panel's own handle rather
 *     than as a trigger for a modal that appears from nowhere.
 *  3. Dismissal is obvious and plural: a labelled circular close floating on the
 *     panel's top edge, the scrim, and Escape.
 */
export function BookingDock() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  /* -- reveal: past the fold, and never while the booking section is in view -- */
  useEffect(() => {
    // Places the dock has no business covering: the booking panel itself, and
    // the footer / closing brand lockup that end the page.
    const quiet = ["book", "holidays"]
      .map((id) => document.getElementById(id))
      .concat(document.querySelector<HTMLElement>("[aria-label^='RwandAir —']"))
      .filter(Boolean) as HTMLElement[];

    const covering = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? covering.add(e.target) : covering.delete(e.target)));
        evaluate();
      },
      { rootMargin: "-10% 0px -10% 0px" }
    );
    quiet.forEach((el) => io.observe(el));

    function evaluate() {
      setVisible(window.scrollY > window.innerHeight * 0.9 && covering.size === 0);
    }

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      window.removeEventListener("scroll", evaluate);
      io.disconnect();
    };
  }, []);

  /* --------- open state: freeze the page, trap Escape, restore focus -------- */
  useEffect(() => {
    if (!open) return;
    setPageScrollLocked(true);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    // move focus into the panel so a keyboard user lands on the form, not
    // wherever they happened to be down the page
    panelRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      setPageScrollLocked(false);
      pillRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      {/* ------------------------------- the pill ------------------------------ */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-gutter",
          "pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        )}
      >
        <button
          ref={pillRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className={cn(
            // deliberately small on a phone: it floats over the design for the
            // whole page, so it has to be legible without becoming furniture
            "focus-ring pointer-events-auto group flex items-center gap-2.5 rounded-full bg-ink/95 py-2.5 pl-5 pr-2.5 text-white shadow-[0_18px_45px_-12px_rgba(11,31,58,0.65)] backdrop-blur-md sm:gap-3 sm:py-3.5 sm:pl-6 sm:pr-3.5",
            "transition-[opacity,transform] duration-500 ease-premium",
            "hover:bg-blue-600",
            visible && !open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-[140%] opacity-0"
          )}
        >
          <span className="text-fluid-xs font-semibold uppercase tracking-[0.18em]">
            Book a flight
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 sm:h-8 sm:w-8">
            <PlaneMark />
          </span>
        </button>
      </div>

      {/* ------------------------------- the panel ----------------------------- */}
      <div
        className={cn(
          "fixed inset-0 z-[80]",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {/* scrim */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close booking"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 w-full cursor-default bg-ink/45 backdrop-blur-[3px] transition-opacity duration-500 ease-premium",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        {/* the sheet — rises from the same edge the pill sits on */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Book a flight"
          className={cn(
            "absolute inset-x-0 bottom-0 mx-auto max-h-[92svh] w-full max-w-shell overflow-y-auto px-gutter",
            "pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-14",
            "transition-transform duration-[650ms] ease-premium",
            open ? "translate-y-0" : "translate-y-full"
          )}
        >
          {/* close, floating clear of the card on its top edge */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              "focus-ring absolute left-1/2 top-2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_-8px_rgba(11,31,58,0.5)]",
              "transition-[transform,background-color,color] duration-300 ease-premium hover:rotate-90 hover:bg-ink hover:text-white"
            )}
          >
            <span className="sr-only">Close</span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>
          </button>

          <FlightSearchCard />
        </div>
      </div>
    </>
  );
}

function PlaneMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8L9 11l-2 2H4l-1 1 3 2 2 3 1-1v-3l2-2 3.5 4.7a.5.5 0 0 0 .8-.5Z" />
    </svg>
  );
}
