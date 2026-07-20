"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/data";
import { Button } from "./Button";

function Caret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 6" fill="none" className={cn("h-1.5 w-2.5", className)} aria-hidden>
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          {navLinks.map((link) => (
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
                  <div className="min-w-[230px] rounded-2xl border border-line bg-paper/97 p-2 shadow-[0_24px_60px_-20px_rgba(3,26,58,0.25)] backdrop-blur-md">
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

        <div className="hidden lg:block">
          <Button href="/#book" variant="outline" className="!px-6 !py-2.5">
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
          "grid overflow-hidden bg-paper/97 backdrop-blur-md transition-[grid-template-rows] duration-500 ease-premium lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex max-h-[calc(100svh-72px)] flex-col overflow-y-auto px-gutter pb-8 pt-2">
            {navLinks.map((link) => (
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
            <Button href="/#book" variant="primary" className="mt-6 w-full">
              Book a flight
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
