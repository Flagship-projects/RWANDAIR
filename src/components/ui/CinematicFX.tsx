"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Always-on cinematic polish that sits above the whole page without capturing
 * pointer events: a soft light that trails the cursor and a fine film grain.
 * Both are disabled for coarse pointers and reduced-motion users.
 */
export function CinematicFX() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lightRef.current;
    if (!el) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) {
      el.style.display = "none";
      return;
    }

    gsap.set(el, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    let visible = false;
    function onMove(e: MouseEvent) {
      if (!visible) {
        gsap.to(el, { opacity: 1, duration: 0.6 });
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* cursor light */}
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[460px] w-[460px] rounded-full opacity-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(circle, rgba(120,180,240,0.9) 0%, rgba(120,180,240,0.35) 35%, rgba(120,180,240,0) 70%)",
        }}
      />
      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[61] opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
    </>
  );
}
