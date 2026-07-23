"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/data";
import { openBooking } from "@/lib/booking";
import { Button } from "./Button";

/**
 * "Book a flight" opens the booking dock wherever one is mounted. It keeps its
 * `#book` href so it still works as a real link — for keyboard/middle-click, and
 * on the pages that have no dock, where falling through to the in-page booking
 * section is the right outcome.
 */
function bookingClick(after?: () => void) {
  return (e: React.MouseEvent) => {
    if (openBooking()) e.preventDefault();
    after?.();
  };
}

function Caret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 6" fill="none" className={cn("h-1.5 w-2.5", className)} aria-hidden>
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Play glyph — signals "The Journey" is an experience to enter, not a page. */
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-3 w-3", className)} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * "The Journey" as a first-class action, not a buried nav link. It sits in the
 * right-hand action zone beside "Book a flight" with equal weight but a distinct
 * role: a soft blue pill with a play glyph reads as "enter the experience",
 * where the neutral outline of Book a flight reads as the transactional CTA.
 */
function JourneyAction({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <a
      href="/journey"
      onClick={onClick}
      className={cn(
        "focus-ring group/journey inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 text-fluid-sm font-medium text-blue-600 transition-colors duration-300 ease-premium hover:border-blue-500 hover:bg-blue-500 hover:text-white",
        className
      )}
    >
      <PlayIcon className="transition-transform duration-300 ease-premium group-hover/journey:scale-110" />
      The Journey
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // "The Journey" is promoted to a dedicated action (right side / mobile CTA),
  // so it comes out of the inline link row to avoid saying it twice.
  const menuLinks = navLinks.filter((l) => l.href !== "/journey");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-premium",
        scrolled ? "bg-paper/85 backdrop-blur-md border-b border-line" : "bg-transparent"
      )}
    >
      {/* Soft light scrim when transparent, so the full-colour logo and dark nav
          read cleanly over the bright daytime hero sky. */}
      {!scrolled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-white/70 via-white/35 to-transparent lg:from-white/60 lg:via-white/25"
        />
      )}

      <div className="mx-auto flex max-w-shell items-center justify-between px-gutter py-4">
        <a href="/" className="focus-ring flex items-center gap-2">
          <Image
            src="/assets/brand/logotype.png"
            alt="RwandAir"
            width={140}
            height={33}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </a>

        {/* ============ desktop: real IA with hover dropdowns ============ */}
        <nav className="hidden items-center gap-7 lg:flex">
          {menuLinks.map((link) => (
            <div key={link.label} className="group relative">
              <a
                href={link.href}
                className="focus-ring flex items-center gap-1.5 py-2 text-fluid-xs uppercase tracking-wideish text-ink/70 transition-colors duration-300 hover:text-blue-500"
              >
                {link.label}
                {link.children && (
                  <Caret className="text-ink/40 transition-transform duration-300 group-hover:rotate-180 group-hover:text-blue-500" />
                )}
              </a>

              {link.children && (
                <div
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0",
                    "translate-y-1 transition-all duration-300 ease-premium",
                    "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
                    "group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  )}
                >
                  {/* bg-paper/95 (not /97): the /97 opacity class was never
                      emitted by Tailwind, so the panel rendered fully
                      transparent and the page bled through. /95 is a real
                      generated step — near-opaque and legible, with the blur and
                      a stronger border keeping the glass feel. */}
                  <div className="min-w-[230px] rounded-2xl border border-line-strong bg-paper/95 p-2 shadow-[0_28px_64px_-18px_rgba(3,26,58,0.4)] backdrop-blur-xl">
                    {link.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring flex items-center justify-between gap-6 rounded-xl px-4 py-2.5 text-fluid-sm text-ink/70 transition-colors duration-200 hover:bg-paper-dim hover:text-blue-500"
                        >
                          {child.label}
                          <span aria-hidden className="text-fluid-xs text-ink/35">↗</span>
                        </a>
                      ) : (
                        <a
                          key={child.label}
                          href={child.href}
                          className="focus-ring flex items-center rounded-xl px-4 py-2.5 text-fluid-sm text-ink/70 transition-colors duration-200 hover:bg-paper-dim hover:text-blue-500"
                        >
                          {child.label}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <JourneyAction className="px-5 py-2.5" />
          <Button href="/#book" variant="outline" className="!px-6 !py-2.5" onClick={bookingClick()}>
            Book a flight
          </Button>
        </div>

        <button
          className="focus-ring flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-6 bg-ink transition-transform duration-300",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 bottom-0 h-px w-6 bg-ink transition-transform duration-300",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {/* ============ mobile: grouped accordion of the same IA ============ */}
      <div
        className={cn(
          "grid overflow-hidden bg-paper/95 backdrop-blur-xl transition-[grid-template-rows] duration-500 ease-premium lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex max-h-[calc(100svh-72px)] flex-col overflow-y-auto px-gutter pb-8 pt-2">
            {menuLinks.map((link) => (
              <div key={link.label} className="border-b border-line py-4">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring font-display text-fluid-lg text-ink"
                >
                  {link.label}
                </a>
                {link.children && (
                  <div className="mt-3 flex flex-col gap-2.5">
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="focus-ring text-fluid-sm text-ink/60 transition-colors hover:text-blue-500"
                      >
                        {child.label}
                        {child.external && <span aria-hidden className="ml-1.5 text-ink/35">↗</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <JourneyAction onClick={() => setOpen(false)} className="mt-6 w-full px-7 py-3.5" />
            <Button
              href="/#book"
              variant="primary"
              className="mt-3 w-full"
              onClick={bookingClick(() => setOpen(false))}
            >
              Book a flight
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
