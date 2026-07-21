"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * The Stand — EXPERIMENTAL standalone scene (outside the seven chapters).
 *
 * A studio-white floor, and the aircraft taxiing across it at scroll speed:
 * gear down, wheels on the ground, its own real contact shadow travelling with
 * it. One slow constant move, nothing else — the weight comes from the scale of
 * the thing and the honesty of the shadow, not from effects.
 *
 * Compositing note: the source plate is an OPAQUE studio shot (white cyc, baked
 * floor shadow), not a cut-out. Rather than key it — which would cost the
 * shadow, the only thing making it sit on the floor — the plate is blended with
 * `mix-blend-mode: multiply` over a gradient matched to its own backdrop
 * (sampled: #fcfcfe at the top → #e6e7eb at the floor). Multiply leaves white
 * untouched and keeps everything darker than it, so the backdrop dissolves into
 * the section while the livery and the shadow survive intact. It also means the
 * featureless floor can carry the plane across it with no parallax tell.
 */
/**
 * Derived from the supplied `side view plane.png`, processed once (in-browser,
 * canvas) and committed as an asset:
 *  - cropped to y 180–600 of the original, which drops the empty cyc above the
 *    tail AND the decorative sparkle sitting in the source's bottom-right
 *    corner (it was visible in the composite);
 *  - flat-fielded — the studio backdrop is modelled per column as a vertical
 *    lerp between the crop's top and bottom rows (both clean backdrop) and
 *    divided out, so the cyc becomes pure #fff while the livery and the contact
 *    shadow keep their relative values.
 * Pure white is what makes `multiply` seamless: white leaves the section's own
 * gradient untouched, so the plate has no edge left to give itself away.
 */
const PLANE = "/assets/aircraft/side-view-floor-clean.png";

/** Sampled from the plate itself so the composite has nothing to seam against. */
const STUDIO_TOP = "#fcfcfe";
const STUDIO_MID = "#f4f5f7";
const STUDIO_FLOOR = "#e6e7eb";

export function JourneyTaxi() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".taxi-plane", { xPercent: 0 });
        gsap.set(".taxi-copy", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".taxi-stage",
          pinSpacing: false, // the section's own height reserves the travel
          anticipatePin: 1,
        },
      });

      // the taxi itself: one constant, unhurried roll across the floor.
      // linear on purpose — an eased taxi reads as a slide, not as weight.
      tl.fromTo(".taxi-plane", { xPercent: -62 }, { xPercent: 62, duration: 1 }, 0);

      // the type holds the middle of the move, then clears out
      tl.fromTo(".taxi-copy", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.16);
      tl.to(".taxi-copy", { opacity: 0, y: -18, duration: 0.12, ease: "power2.in" }, 0.72);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-taxi"
      // no data-journey-chapter: this scene sits outside the seven-chapter
      // system. data-journey-light flips the chrome to dark ink — white-on-white
      // would be invisible here.
      data-journey-light="true"
      className="relative"
      style={{ height: "300svh" }}
    >
      <div
        className="taxi-stage relative h-[100svh] overflow-hidden"
        style={{
          background: `linear-gradient(180deg,${STUDIO_TOP} 0%,${STUDIO_MID} 52%,${STUDIO_FLOOR} 100%)`,
        }}
      >
        {/* the aircraft, rolling. Sized so the plate is always wider than the
            viewport across its whole travel — its edges never enter frame. */}
        {/* One element carries the centring, the blend AND the scroll transform.
            It cannot be split into wrapper + inner: a transform on the wrapper
            opens a stacking context, which isolates mix-blend-mode so the child
            has nothing to multiply against and the plate renders as a white box.
            Centring therefore uses the standalone `translate` property: GSAP
            folds it into its own matrix baseline on first write (then sets
            `translate:none`), so the -50%/-50% survives instead of being wiped
            the way Tailwind's `-translate-x-1/2` transform utility would be. */}
        <div
            className="taxi-plane absolute left-1/2 top-[54%] w-[min(1240px,124vw)] will-change-transform"
            style={{
              translate: "-50% -50%",
              mixBlendMode: "multiply",
              // a 1% feather on the outer columns — cheap insurance against any
              // residual edge from the flat-field, without touching the tail or
              // nose tips (which start at ~2.5% of the plate's width)
              maskImage: "linear-gradient(90deg,transparent 0%,#000 1%,#000 99%,transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg,transparent 0%,#000 1%,#000 99%,transparent 100%)",
            }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PLANE} alt="" className="w-full" />
        </div>

        {/* a soft pool of light on the floor, so the white never reads as flat */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
          style={{ background: "radial-gradient(70% 100% at 50% 100%,rgba(255,255,255,0.75) 0%,transparent 70%)" }}
          aria-hidden
        />

        {/* type — ink on white, low and out of the aircraft's line */}
        <div className="taxi-copy absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-shell px-gutter">
          <p className="mb-5 text-fluid-xs uppercase tracking-[0.34em] text-ink-muted">
            Airbus A330-300 · 9XR-WP
          </p>
          <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[0.95] tracking-tightest text-ink">
            Sixty metres of Rwanda,
            <span className="italic text-blue-500"> moving.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
