"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 1 — The Dream.
 *
 * A centred, symmetrical opening: eyebrow, headline, one line of copy and a
 * single quiet pill, with the A330 laid broadside across the full width of the
 * frame beneath them and mirrored into a soft reflection. Clean brand-blue sky
 * falling to a warm horizon; one real cumulus deck for depth. The moment you
 * start scrolling the aircraft leaves — it accelerates to the right, lifts and
 * grows past the lens while the copy sinks away and the frame dissolves into
 * the deep blue of Chapter 2.
 */
const CLOUD = "/assets/sky/cloud-real.png";
const PLANE = "/assets/aircraft/rwandair-transparent.png";

export function JourneyHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = gsap.utils.selector(root);

      if (!reduced) {
        gsap.set(root, { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".dream-sun", { opacity: 0, scale: 0.85, duration: 2.2 }, 0)
          .from(".dream-cloud", { opacity: 0, yPercent: 24, duration: 2.4, stagger: 0.2, ease: "power2.out" }, 0.1)
          .from(".dream-line", { yPercent: 120, duration: 1.2, ease: "power4.out", stagger: 0.12 }, 0.45)
          .from(".dream-eyebrow", { opacity: 0, y: 16, duration: 1 }, 0.3)
          .from(".dream-sub, .dream-cta", { opacity: 0, y: 16, duration: 1, stagger: 0.14 }, 1.05)
          // the aircraft taxis in broadside, low and unhurried
          .from(
            ".dream-plane",
            { xPercent: -22, opacity: 0, duration: 2.8, ease: "power2.out" },
            0.9
          )
          .from(".dream-cue", { opacity: 0, y: 16, duration: 1 }, 2.1);

        // idle life — the aircraft breathes on its own axis, not the scroll axis
        gsap.to(".dream-plane-float", { yPercent: -1.6, duration: 6.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        q<HTMLElement>(".dream-cloud").forEach((el, i) => {
          gsap.to(el, { xPercent: i % 2 ? 3 : -2.4, duration: 30 + i * 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });

        // cursor parallax
        const layers = q<HTMLElement>("[data-depth]");
        const onMove = (e: MouseEvent) => {
          const rx = e.clientX / window.innerWidth - 0.5;
          const ry = e.clientY / window.innerHeight - 0.5;
          layers.forEach((el) => {
            const d = Number(el.dataset.depth);
            gsap.to(el, { x: -rx * d * 46, y: -ry * d * 26, duration: 1.2, ease: "power3.out" });
          });
        };
        if (!window.matchMedia("(pointer: coarse)").matches) {
          window.addEventListener("mousemove", onMove);
          self.add(() => window.removeEventListener("mousemove", onMove));
        }
      } else {
        gsap.set(root, { autoAlpha: 1 });
      }

      // scroll parallax + exit
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 } });
      tl.to(".dream-deck", { yPercent: 26, ease: "none" }, 0)
        .to(".dream-near", { yPercent: 60, ease: "none" }, 0)
        // the departure: it rolls, rotates, lifts away to the right and past the lens
        .to(".dream-plane", { xPercent: 46, yPercent: -34, scale: 1.22, duration: 0.85, ease: "power1.in" }, 0)
        .to(".dream-plane-tilt", { rotate: -7, duration: 0.85, ease: "power2.in" }, 0)
        .to(".dream-reflection", { opacity: 0, ease: "none" }, 0)
        .to(".dream-copy", { yPercent: -32, opacity: 0, ease: "none" }, 0)
        .to(".dream-dawn", { opacity: 0, ease: "none" }, 0.3)
        .to(".dream-dusk", { opacity: 1, ease: "none" }, 0.5);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-0"
      data-journey-chapter="0"
      className="relative h-[130svh] overflow-hidden opacity-0"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* clean brand-blue sky → warm horizon */}
        <div
          className="dream-dawn absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#0b3d84 0%,#1559a6 30%,#3f83c4 52%,#89b6de 72%,#d9e4ee 86%,#f4ddc0 100%)",
          }}
        />
        {/* the deeper blue Chapter 2 opens in */}
        <div
          className="dream-dusk absolute inset-0 opacity-0"
          style={{ background: "linear-gradient(180deg,#07306a 0%,#0a3d7c 60%,#12509b 100%)" }}
        />

        {/* sun glow low on the horizon */}
        <div
          className="dream-sun pointer-events-none absolute left-[62%] top-[82%] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          data-depth="0.35"
          style={{
            background:
              "radial-gradient(circle,rgba(255,241,214,0.9) 0%,rgba(255,216,160,0.36) 26%,rgba(255,205,150,0.08) 48%,transparent 66%)",
          }}
          aria-hidden
        />

        {/* the aircraft — broadside across the full width, sitting under the type */}
        {/* anchor carries the centring translate; GSAP only ever touches the
            inner layers, since an xPercent tween would overwrite it */}
        <div
          className="absolute left-1/2 top-[72%] z-[7] w-[min(1180px,104vw)] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          <div className="dream-plane" data-depth="1.2">
            <div className="dream-plane-float">
              <div className="dream-plane-tilt relative origin-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLANE}
                  alt="A RwandAir Airbus A330 in profile"
                  className="w-full drop-shadow-[0_60px_90px_rgba(6,26,58,0.38)]"
                />
                {/* mirrored reflection, dissolving downward */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLANE}
                  alt=""
                  className="dream-reflection absolute inset-x-0 top-[92%] w-full -scale-y-100 opacity-20 blur-[2px]"
                  style={{
                    maskImage: "linear-gradient(to top,transparent 10%,rgba(0,0,0,0.5) 60%,#000 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top,transparent 10%,rgba(0,0,0,0.5) 60%,#000 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* real cumulus deck banked along the bottom (photographic alpha) */}
        <div className="dream-deck pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="0.9"
            className="dream-cloud absolute bottom-[8%] left-[-14%] w-[62%] opacity-80"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="1.1"
            className="dream-cloud absolute bottom-[-4%] right-[-12%] w-[66%] opacity-90"
          />
        </div>

        {/* one near cloud sweeping the very bottom of the lens */}
        <div className="dream-near pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[40%]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="2.1"
            className="dream-cloud absolute bottom-[-42%] left-[8%] w-[90%] opacity-70"
          />
        </div>

        {/* legibility vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[8]"
          style={{ background: "radial-gradient(115% 78% at 42% 42%,rgba(7,34,72,0.34) 0%,transparent 52%)" }}
          aria-hidden
        />

        {/* copy — centred, sitting above the aircraft */}
        <div className="dream-copy absolute inset-x-0 top-[7%] z-[10] mx-auto flex max-w-shell flex-col items-center px-gutter text-center">
          <p className="dream-eyebrow mb-6 text-fluid-xs uppercase tracking-[0.34em] text-white/85 drop-shadow-[0_1px_16px_rgba(7,34,72,0.55)]">
            RwandAir — one journey, seven chapters
          </p>
          <h1 className="max-w-5xl font-display text-fluid-h1 font-light leading-[0.92] tracking-tightest text-white drop-shadow-[0_4px_44px_rgba(7,34,72,0.45)]">
            <span className="reveal-mask block">
              <span className="dream-line block">Every journey</span>
            </span>
            <span className="reveal-mask block">
              <span className="dream-line block">
                begins with a <span className="italic text-gold-300">dream.</span>
              </span>
            </span>
          </h1>
          <p className="dream-sub mt-7 max-w-lg text-fluid-lg font-light leading-relaxed text-white/85 drop-shadow-[0_1px_16px_rgba(7,34,72,0.55)]">
            Come travel one with us — from the first flutter of anticipation to
            the moment the wheels touch home.
          </p>
          <a
            href="#journey-1"
            className="dream-cta mt-9 inline-flex items-center rounded-full border border-white/45 px-8 py-3 text-fluid-sm uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-500 ease-premium hover:border-white hover:bg-white hover:text-blue-700"
          >
            Begin the journey
          </a>
        </div>

        {/* scroll cue */}
        <div className="dream-cue pointer-events-none absolute inset-x-0 bottom-9 z-[10] flex flex-col items-center gap-3 text-white/75">
          <span className="text-[10px] uppercase tracking-[0.3em]">The journey begins</span>
          <span className="relative block h-9 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cueDrop_1.8s_ease-in-out_infinite] bg-white" />
          </span>
        </div>
      </div>

      <style jsx>{`
        /* Landscape phones / short windows: the centred title stack is taller
           than the viewport and the CTA lands on top of the scroll cue. Tighten
           the rhythm, lift the block, drop the cue. */
        @media (max-height: 560px) {
          .dream-copy {
            top: 3% !important;
          }
          .dream-eyebrow {
            margin-bottom: 0.6rem !important;
          }
          .dream-sub {
            margin-top: 0.9rem !important;
          }
          .dream-cta {
            margin-top: 1rem !important;
            padding-top: 0.55rem !important;
            padding-bottom: 0.55rem !important;
          }
          .dream-cue {
            display: none !important;
          }
        }

        @keyframes cueDrop {
          0% {
            transform: translateY(-100%);
          }
          60%,
          100% {
            transform: translateY(300%);
          }
        }
      `}</style>
    </section>
  );
}
