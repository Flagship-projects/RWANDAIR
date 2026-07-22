"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * The taxi scene — a studio-white floor with the A330 rolling across it at
 * scroll speed: gear down, wheels on the ground, its own real contact shadow
 * travelling with it. One slow constant move, nothing else — the weight comes
 * from the scale of the thing and the honesty of the shadow, not from effects.
 *
 * Shared, because it is used twice with different copy: as the homepage hero
 * and as the standalone "Stand" scene on the Journey page. Only the type and
 * the actions differ; the visual and the mechanic are deliberately identical.
 *
 * Compositing note: the source plate is an OPAQUE studio shot (white cyc, baked
 * floor shadow), not a cut-out. Rather than key it — which would cost the
 * shadow, the only thing making it sit on the floor — the plate is blended with
 * `mix-blend-mode: multiply` over a gradient matched to its own backdrop.
 * Multiply leaves white untouched and keeps everything darker than it, so the
 * backdrop dissolves into the section while the livery and the shadow survive
 * intact. It also means the featureless floor can carry the plane across it
 * with no parallax tell.
 *
 * Asset: derived from `ASSETS/Rwandair High res.png` (3168×1344), processed once
 * (in-browser, canvas) and committed — cropped to y 160–1150 (dropping the empty
 * cyc above the tail and the dead floor below the shadow), then flat-fielded:
 * the backdrop is modelled per column as a vertical lerp between the crop's two
 * clean rows and divided out, so the cyc becomes pure #fff while the livery and
 * shadow keep their relative values. Pure white is what makes multiply seamless.
 * Delivered at 2400×750 as JPEG (146KB) — the plate is opaque by design, so
 * PNG's lossless cost buys nothing (the same frame as PNG is 1.6MB).
 */
const PLANE = "/assets/aircraft/side-view-floor-clean.jpg";

/** The processed asset is 2400×750. Its rendered width lives in the `--plate-w`
 *  custom property (set responsively below) so the width and the two calc()
 *  offsets that centre it can never drift apart. */
const PLATE_RATIO = 750 / 2400;

/** Sampled from the plate itself so the composite has nothing to seam against. */
const STUDIO_TOP = "#fcfcfe";
const STUDIO_MID = "#f4f5f7";
const STUDIO_FLOOR = "#e6e7eb";

type TaxiSceneProps = {
  id: string;
  eyebrow: ReactNode;
  heading: ReactNode;
  /** Optional supporting paragraph — the homepage hero uses it, the Journey scene doesn't. */
  body?: ReactNode;
  /** Optional calls to action, rendered under the copy. */
  actions?: ReactNode;
  /** h1 for the homepage hero, h2 everywhere else. */
  as?: "h1" | "h2";
  /**
   * "hero" lifts the aircraft and trims the plate. The homepage stacks eyebrow +
   * headline + paragraph + two buttons — roughly triple the Journey scene's two
   * lines — and at the default centreline that block lands on the fuselage.
   */
  variant?: "scene" | "hero";
  /** Extra attributes for the section (e.g. data-journey-light). */
  sectionProps?: Record<string, string>;
};

export function TaxiScene({
  id,
  eyebrow,
  heading,
  body,
  actions,
  as = "h2",
  variant = "scene",
  sectionProps,
}: TaxiSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const Heading = as;
  const hero = variant === "hero";

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

      // A hero must be legible the instant the page arrives, so its type plays
      // an intro on load and then simply holds. (The Journey scene instead
      // reveals its line mid-roll, which is a narrative beat, not a headline.)
      if (hero) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          // The intro must NOT touch xPercent: that channel belongs to the
          // scroll tween, and writing to it here parks the plate somewhere the
          // scrub does not start from — which is exactly what made the aircraft
          // snap back the moment you scrolled. It arrives on scale + opacity
          // instead: different components of the same transform, which GSAP
          // composes in one matrix, so the two tweens never fight and the
          // hand-off into the scroll is pixel-exact.
          //
          // (The standalone `translate` property is not an escape hatch either —
          // GSAP folds it into its transform baseline on first write and it then
          // sticks as a permanent offset.)
          .fromTo(
            ".taxi-plane",
            { opacity: 0, scale: 1.07 },
            { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" },
            0
          )
          .from(".taxi-rule", { scaleX: 0, duration: 1.1 }, 0.25)
          .from(".taxi-eyebrow", { opacity: 0, y: 12, duration: 0.9 }, 0.3)
          .from(".taxi-head-line", { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: 0.09 }, 0.4)
          .from(".taxi-body", { opacity: 0, y: 16, duration: 0.9 }, 0.85)
          .from(".taxi-actions", { opacity: 0, y: 16, duration: 0.9 }, 1);
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
      //
      // The hero uses the SAME sweep as the scene (user's call, 2026-07-22):
      // the page lands on roughly the front third of the aircraft entering at
      // the left, and scrolling walks the whole airframe across the frame and
      // out. Centring it on load instead left it clipped on both edges with no
      // travel to explain the crop — this reads as an aircraft arriving.
      tl.fromTo(".taxi-plane", { xPercent: -62 }, { xPercent: 62, duration: 1 }, 0);

      if (hero) {
        // The booking panel rises over the still-pinned stage, so the two blocks
        // leave at different times: the lower one clears out as the card reaches
        // it, while the headline holds above — for a beat you see the title card
        // and the search panel together, which is the association we want.
        tl.to(".taxi-copy-bottom", { opacity: 0, y: -16, duration: 0.12, ease: "power2.in" }, 0.46);
        tl.to(".taxi-copy-top", { opacity: 0, y: -20, duration: 0.14, ease: "power2.in" }, 0.78);
      } else {
        // the Journey scene: the line arrives mid-roll and clears out
        tl.fromTo(".taxi-copy", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.16);
        tl.to(".taxi-copy", { opacity: 0, y: -18, duration: 0.12, ease: "power2.in" }, 0.72);
      }
    }, root);

    return () => ctx.revert();
  }, [hero]);

  return (
    <section
      ref={rootRef}
      id={id}
      data-taxi-variant={variant}
      className="relative"
      // The hero runs a shorter roll: its job is to hand over to the booking
      // panel quickly, not to hold the screen for three viewports.
      style={{ height: hero ? "190svh" : "300svh" }}
      {...sectionProps}
    >
      <div
        className="taxi-stage stage-vh relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg,${STUDIO_TOP} 0%,${STUDIO_MID} 52%,${STUDIO_FLOOR} 100%)`,
        }}
      >
        {/* One element carries the centring, the blend AND the scroll transform.
            It cannot be split into wrapper + inner: a transform on the wrapper
            opens a stacking context, which isolates mix-blend-mode so the child
            has nothing to multiply against and the plate renders as a white box.
            So centring uses NO transform at all — plain calc() offsets, leaving
            the transform channel exclusively to GSAP's scroll tween. (Tailwind's
            -translate-x-1/2 gets wiped by an xPercent tween; the standalone
            `translate` property survives it but only ships in Chrome 104+ /
            Safari 14.1+, and this scene shouldn't need that.) */}
        <div
          className="taxi-plane absolute will-change-transform"
          style={{
            width: "var(--plate-w)",
            left: "calc(50% - var(--plate-w) / 2)",
            // --plate-y is where the aircraft's centreline sits; both it and
            // --plate-w are retuned per breakpoint below, and this calc follows
            top: `calc(var(--plate-y) - var(--plate-w) * ${PLATE_RATIO / 2})`,
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
          <img
            src={PLANE}
            alt=""
            className="w-full"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* a soft pool of light on the floor, so the white never reads as flat */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
          style={{ background: "radial-gradient(70% 100% at 50% 100%,rgba(255,255,255,0.75) 0%,transparent 70%)" }}
          aria-hidden
        />

        {hero ? (
          /* The hero composition is built AROUND the aircraft: title card above
             it, supporting line and actions below, both centred on the same
             axis, so the plane is the middle of a symmetrical stack rather than
             a backdrop behind a corner of type. */
          <>
            <div className="taxi-copy taxi-copy-top absolute inset-x-0 top-[8%] z-10 mx-auto max-w-shell px-gutter text-center">
              <span className="taxi-rule mx-auto mb-6 block h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <p className="taxi-eyebrow mb-5 text-fluid-xs uppercase tracking-[0.34em] text-ink-muted">
                {eyebrow}
              </p>
              <Heading className="taxi-head mx-auto max-w-4xl font-display font-light leading-[0.98] tracking-tightest text-ink">
                {heading}
              </Heading>
            </div>

            <div className="taxi-copy taxi-copy-bottom absolute inset-x-0 bottom-[8%] z-10 mx-auto max-w-shell px-gutter text-center">
              {body ? (
                <p className="taxi-body mx-auto max-w-xl text-fluid-lg font-light leading-relaxed text-ink-soft">
                  {body}
                </p>
              ) : null}
              {actions ? (
                <div className="taxi-actions mt-7 flex flex-wrap items-center justify-center gap-4">
                  {actions}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          /* the Journey scene — ink on white, low and out of the aircraft's line */
          <div className="taxi-copy absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-shell px-gutter">
            <p className="mb-5 text-fluid-xs uppercase tracking-[0.34em] text-ink-muted">{eyebrow}</p>
            <Heading className="max-w-3xl font-display text-fluid-h2 font-light leading-[0.95] tracking-tightest text-ink">
              {heading}
            </Heading>
          </div>
        )}
      </div>

      <style jsx>{`
        .taxi-plane {
          --plate-w: min(1240px, 124vw);
          --plate-y: 47%;
        }
        /* the hero puts the aircraft dead centre and lets the type sit above and
           below it, at the same presence as the Journey scene — it is the first
           thing the site says, so it is sized to be the loudest */
        [data-taxi-variant="hero"] .taxi-plane {
          --plate-w: min(1200px, 120vw);
          --plate-y: 50%;
        }
        /* a touch smaller than the section scale — the hero has more to say, and
           the aircraft, not the type, is meant to be the loudest thing here */
        .taxi-head {
          font-size: clamp(2.1rem, 1.2rem + 3.1vw, 4rem);
        }
        /* on a narrow portrait screen a frame-width aircraft reads as a toy in a
           big empty room — go past the edges instead, so what crosses the screen
           is fuselage at scale */
        @media (max-width: 767px) {
          .taxi-plane {
            --plate-w: 215vw;
          }
          /* the hero keeps the whole aircraft in frame (it is the subject of a
             symmetrical stack, not a passing detail) but at full width it reads
             small between the two copy blocks — so push it well past the frame,
             matching the scene's mobile presence */
          [data-taxi-variant="hero"] .taxi-plane {
            --plate-w: 200vw;
            /* lifted off the true centre: the copy block below is the taller of
               the two, and at this scale a dead-centre plate leaves a visible
               band of empty floor between the headline and the fuselage */
            --plate-y: 46%;
          }
          /* the eyebrow is a long line; at the desktop tracking it wraps to two
             and the title card loses its top edge */
          [data-taxi-variant="hero"] .taxi-eyebrow {
            letter-spacing: 0.2em;
          }
          [data-taxi-variant="hero"] .taxi-copy-bottom {
            bottom: 6%;
          }
          [data-taxi-variant="hero"] .taxi-copy-top {
            top: 6%;
          }
        }
        /* landscape phones / short windows: at full width the plate fills the
           frame top to bottom and the type ends up on the fuselage. Shrink it
           and lift the centreline so the floor — and the copy — keep their air. */
        @media (max-height: 560px) {
          .taxi-plane {
            --plate-w: 86vw;
            --plate-y: 40%;
          }
          .taxi-copy {
            bottom: 5% !important;
          }
          /* the hero's paragraph is the first thing to go on a landscape phone:
             headline + buttons are what the visitor actually needs there */
          [data-taxi-variant="hero"] .taxi-plane {
            --plate-w: 84vw;
            --plate-y: 26%;
          }
          [data-taxi-variant="hero"] .taxi-body {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
