"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";
import { WINDOW_EXIT_SKY } from "./JourneyWindow";

/**
 * Chapter 6 — Africa From Above.
 *
 * The continent revealed like weather, not a brochure. A pinned atlas cross-
 * fades full-bleed places with a slow ken-burns push; over each, a place name
 * builds letter by letter while its coordinates tick and a single line lands.
 * The region label at the foot sweeps as you move across the map.
 *
 * Swap point: PLACES[].img — drop wildlife / coastline / city footage here.
 */
const PLACES = [
  { name: "Kigali", country: "Rwanda", coord: "1.9°S 30.1°E", line: "A thousand hills, and the calm that lives between them.", img: "/assets/destinations/kigali.jpg" },
  { name: "Nairobi", country: "Kenya", coord: "1.3°S 36.9°E", line: "Where the city gives way to the wild without asking.", img: "/assets/destinations/nairobi.jpg" },
  { name: "Lagos", country: "Nigeria", coord: "6.6°N 3.3°E", line: "The pulse of the west, felt from the air.", img: "/assets/destinations/lagos.jpg" },
  { name: "Accra", country: "Ghana", coord: "5.6°N 0.2°W", line: "A gold coast, catching the last of the light.", img: "/assets/destinations/accra.jpg" },
  { name: "Johannesburg", country: "South Africa", coord: "26.1°S 28.2°E", line: "The city of gold, laid out below like a circuit.", img: "/assets/destinations/johannesburg.jpg" },
];

export function JourneyAfrica() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".atlas-slide", root);

      if (reduced) {
        slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));
        gsap.set(".atlas-veil", { opacity: 0 });
        return;
      }
      gsap.set(slides, { opacity: 0 });
      gsap.set(slides[0], { opacity: 1 });

      const step = 1 / slides.length;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".atlas-stage",
          pinSpacing: false, // the section's own height reserves the travel
          anticipatePin: 1,
        },
      });

      // the sky inherited from the window fly-through dissolves into the first
      // destination — the landing of one continuous camera move, not a cut
      tl.to(".atlas-veil", { opacity: 0, duration: step * 0.55 }, 0.01);

      slides.forEach((slide, i) => {
        const img = slide.querySelector(".atlas-img");
        // ken-burns push across this slide's active window
        gsap.set(img, { scale: 1.08 });
        // cross-fade in (except first)
        if (i > 0) {
          tl.to(slides[i - 1], { opacity: 0, duration: step * 0.4 }, i * step - step * 0.2);
          tl.to(slide, { opacity: 1, duration: step * 0.4 }, i * step - step * 0.2);
        }
        // continuous slow zoom while the section scrubs
        tl.to(img, { scale: 1.2, duration: step }, i * step);

        // type build per slide, tied to its entry
        ScrollTrigger.create({
          trigger: root,
          start: () => `top+=${i * step * root.offsetHeight} top`,
          end: () => `top+=${(i + 0.5) * step * root.offsetHeight} top`,
          onEnter: () => buildIn(slide),
          onEnterBack: () => buildIn(slide),
        });
      });

      function buildIn(slide: HTMLElement) {
        const chars = slide.querySelectorAll(".atlas-char");
        const meta = slide.querySelectorAll(".atlas-meta");
        gsap.fromTo(chars, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out", stagger: 0.03, overwrite: true });
        gsap.fromTo(meta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1, delay: 0.2, overwrite: true });
      }
      buildIn(slides[0]);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-5"
      data-journey-chapter="5"
      className="relative"
      style={{ height: `${PLACES.length * 100}vh`, background: WINDOW_EXIT_SKY }}
    >
      <div className="atlas-stage relative h-[100svh] overflow-hidden">
        {PLACES.map((p) => (
          <div key={p.name} className="atlas-slide absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={`${p.name}, ${p.country}`} className="atlas-img absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            <div className="absolute inset-0 flex flex-col justify-end px-gutter pb-[14vh]">
              <p className="atlas-meta mb-4 text-fluid-xs uppercase tracking-[0.32em] text-gold-300/90">
                {p.country} · {p.coord}
              </p>
              <h2 className="font-display text-fluid-display font-light leading-[0.9] tracking-tightest text-white">
                <span className="reveal-mask block overflow-hidden">
                  {p.name.split("").map((ch, i) => (
                    <span key={i} className="atlas-char inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              </h2>
              <p className="atlas-meta mt-6 max-w-lg font-display text-fluid-lg font-light italic leading-relaxed text-white/75">
                {p.line}
              </p>
            </div>
          </div>
        ))}

        {/* the sky carried over from the window — fades as the first place appears */}
        <div className="atlas-veil pointer-events-none absolute inset-0 z-[15]" style={{ background: WINDOW_EXIT_SKY }} aria-hidden />

        {/* fixed chapter marker + region rail */}
        <p className="pointer-events-none absolute left-gutter top-[13%] z-10 text-fluid-xs uppercase tracking-[0.32em] text-white/50">
          Chapter Six — Where journeys lead
        </p>
      </div>
    </section>
  );
}
