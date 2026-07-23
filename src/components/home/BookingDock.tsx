"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { setPageScrollLocked } from "@/lib/motion";
import { registerBookingDock } from "@/lib/booking";
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
    // Places the dock has no business covering: the booking panel itself, the
    // full-bleed cloud corridor (a cinematic pause — booking chrome sitting on
    // it reads as a banner ad), and the footer / closing brand lockup.
    const quiet = ["book", "corridor", "holidays"]
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

  /* Every "Book a flight" in the chrome opens this same panel, not just the
     floating pill — the one in the nav used to jump to the #book anchor, which
     on a long page reads as the button doing nothing. */
  useEffect(() => registerBookingDock(() => setOpen(true)), []);

  /* --------- open state: freeze the page, trap Escape, restore focus -------- */
  useEffect(() => {
    if (!open) return;
    setPageScrollLocked(true);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    // Move focus to the panel itself — NOT to the first input. Focusing an
    // input raises the soft keyboard and the autofill toolbar the instant the
    // sheet opens, which covers the trip-type controls and collapses the
    // visual viewport out from under the panel. The visitor should see the
    // form first and summon the keyboard by tapping a field themselves.
    panelRef.current?.focus({ preventScroll: true });

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
            "absolute inset-0 w-full cursor-default bg-ink/45 transition-opacity duration-500 ease-premium",
            // the blur is gated on `open` too — a backdrop-filter left mounted
            // over the whole page is a compositing cost with nothing to show
            open ? "opacity-100 backdrop-blur-[3px]" : "opacity-0"
          )}
        />

        {/* the sheet — rises from the same edge the pill sits on */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Book a flight"
          tabIndex={-1}
          // Lenis intercepts wheel and touch globally, so an overflow container
          // inside it never receives the gesture — the panel looked frozen on a
          // phone. `data-lenis-prevent` is Lenis's own opt-out for exactly this.
          data-lenis-prevent
          // Anchored just under the header, not to the bottom edge. Bottom
          // anchoring meant a short panel opened halfway down the screen,
          // disconnected from the top of the page; from here it always starts
          // in the same place and simply grows downward. The top offset clears
          // the header and leaves the close button its own row above the card.
          //
          // The closed state must NOT be a percentage translate. A percentage
          // resolves against the element's own height, so it only hides a panel
          // that is already about as tall as the viewport — on a desktop, where
          // the card is wide and the form is short, 130% of ~410px left the
          // whole thing sitting on screen. `visibility` is height-independent
          // and genuinely removes it; it is in the transition list on purpose,
          // because visibility steps to hidden only at the END of a transition
          // (any interpolation involving `visible` stays visible), so the exit
          // animation gets to play out in full and only then does the panel go
          // away. The fixed wrapper means it never occupies layout either way.
          className={cn(
            "absolute inset-x-0 top-[4.25rem] mx-auto max-h-[calc(100svh-5rem)] w-full max-w-shell overflow-y-auto overscroll-contain px-3 focus:outline-none sm:top-[4.75rem] sm:px-gutter",
            "pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1",
            "transition-[opacity,transform,visibility] duration-500 ease-premium",
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-8 opacity-0"
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Close, floating clear of the card on its top edge. Sticky, not
              absolute: the panel scrolls when the form is taller than the
              screen, and a close that scrolls away with it is a trap. */}
          <div className="sticky top-0 z-20 flex justify-center pb-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(
                // ring, because once the panel scrolls this floats over the
                // white card and a shadow alone leaves it edgeless
                "focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink ring-1 ring-line shadow-[0_10px_30px_-8px_rgba(11,31,58,0.5)]",
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
          </div>

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
