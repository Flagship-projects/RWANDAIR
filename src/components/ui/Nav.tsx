"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/data";
import { Button } from "./Button";

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
        <a href="#top" className="focus-ring flex items-center gap-2">
          <Image
            src="/assets/brand/logotype.png"
            alt="RwandAir"
            width={140}
            height={33}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="focus-ring text-fluid-xs uppercase tracking-wideish text-ink/70 transition-colors duration-300 hover:text-blue-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#book" variant="outline" className="!px-6 !py-2.5">
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

      <div
        className={cn(
          "grid overflow-hidden bg-paper/97 backdrop-blur-md transition-[grid-template-rows] duration-500 ease-premium lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 px-gutter pb-8 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring border-b border-line py-4 text-fluid-lg font-display text-ink"
              >
                {link.label}
              </a>
            ))}
            <Button href="#book" variant="primary" className="mt-6 w-full">
              Book a flight
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
