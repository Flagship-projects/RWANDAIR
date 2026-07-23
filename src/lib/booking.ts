"use client";

/**
 * A tiny channel between the "Book a flight" calls to action scattered around
 * the chrome (the nav, the floating dock's pill) and whichever booking dock is
 * mounted on the current page.
 *
 * `openBooking()` reports whether anything actually handled it, so a caller can
 * fall back to navigating to the in-page `#book` section on the pages that have
 * no dock rather than silently doing nothing.
 */
type Opener = () => void;

const openers = new Set<Opener>();

export function registerBookingDock(open: Opener) {
  openers.add(open);
  return () => {
    openers.delete(open);
  };
}

export function openBooking(): boolean {
  if (openers.size === 0) return false;
  openers.forEach((open) => open());
  return true;
}
