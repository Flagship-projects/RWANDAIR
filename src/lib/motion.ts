"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

let registered = false;
export function ensureGsapRegistered() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Dev-only: expose gsap so animations can be paused for screenshot capture.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { gsap: typeof gsap }).gsap = gsap;
    }
    registered = true;
  }
}

/** Drives Lenis smooth scroll and keeps GSAP's ScrollTrigger in sync with it. */
export function useSmoothScroll() {
  useEffect(() => {
    ensureGsapRegistered();

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (!location.hash) {
      window.scrollTo(0, 0);
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's own ticker (rather than a separate rAF loop) so
    // ScrollTrigger's pin setup and Lenis's virtual scroll target never desync.
    function update(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Late-loading images (the fleet sequence, hero photo, fonts) can shift
    // section heights after ScrollTrigger's first measurement pass, which
    // nudges scroll position during its pin/refresh recalculation. Re-assert
    // top-of-page once everything has actually finished loading.
    function settle() {
      ScrollTrigger.refresh();
      if (!location.hash) {
        lenis.scrollTo(0, { immediate: true });
      }
    }
    if (document.readyState === "complete") {
      settle();
    } else {
      window.addEventListener("load", settle, { once: true });
    }

    return () => {
      window.removeEventListener("load", settle);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
}

/** Fades + rises children of a container into view as it scrolls in, staggered. */
export function useScrollReveal<T extends HTMLElement>(options?: {
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (!ref.current) return;
    const targets = options?.selector
      ? ref.current.querySelectorAll<HTMLElement>(options.selector)
      : [ref.current];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: options?.y ?? 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: options?.stagger ?? 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: options?.start ?? "top 82%",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [options?.selector, options?.stagger, options?.start, options?.y]);

  return ref;
}

/** Subtle magnetic pull for buttons/links toward the cursor within a radius. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    function handleLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
