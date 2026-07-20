"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 1 — The Dream.
 *
 * Every journey begins long before the airport — it begins the moment you let
 * yourself imagine it. A breathing dawn sky the visitor drops into: true-alpha
 * cloud plates (no visible bounding boxes) composed as one weather system — a
 * soft deck low on the horizon, a far drifting bank near the sun, one near wisp
 * sweeping the lens. The aircraft banks quietly in, a single line masks up, and
 * on scroll the whole frame lifts into the pre-departure blue of Chapter 2.
 */
const CLOUD_SOFT = "/assets/sky/cloud-alpha-hero.png"; // dense, feathered
const CLOUD_BANK = "/assets/sky/clouds-1-a.png"; // wide bank, true alpha
const CLOUD_FAR = "/assets/sky/clouds-2-a.png"; // faint, distant
const PLANE = "/assets/aircraft/takeoff-cutout.png";

export function JourneyHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = gsap.utils.selector(root);

      // ---------- entrance ----------
      if (!reduced) {
        gsap.set(root, { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".dream-sun", { opacity: 0, scale: 0.8, duration: 2.2 }, 0)
          .from(".dream-cloud", { opacity: 0, duration: 2.2, stagger: 0.16 }, 0.2)
          .from(
            ".dream-plane",
            { xPercent: -34, yPercent: 22, opacity: 0, rotate: 8, duration: 2.6, ease: "power2.out" },
            0.4
          )
          .from(".dream-line", { yPercent: 120, duration: 1.2, ease: "power4.out", stagger: 0.12 }, 0.9)
          .from(".dream-eyebrow, .dream-sub, .dream-cue", { opacity: 0, y: 16, duration: 1, stagger: 0.14 }, 1.5);

        // idle life: the aircraft never quite still, the weather always moving
        gsap.to(".dream-plane", {
          yPercent: "+=2.5",
          rotate: "+=1.2",
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        q<HTMLElement>(".dream-cloud").forEach((el, i) => {
          gsap.to(el, {
            xPercent: i % 2 ? 3.5 : -3,
            duration: 26 + i * 7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        // ---------- cursor parallax ----------
        const layers = q<HTMLElement>("[data-depth]");
        const onMove = (e: MouseEvent) => {
          const rx = e.clientX / window.innerWidth - 0.5;
          const ry = e.clientY / window.innerHeight - 0.5;
          layers.forEach((el) => {
            const d = Number(el.dataset.depth);
            gsap.to(el, { x: -rx * d * 55, y: -ry * d * 32, duration: 1.1, ease: "power3.out" });
          });
        };
        if (!window.matchMedia("(pointer: coarse)").matches) {
          window.addEventListener("mousemove", onMove);
          self.add(() => window.removeEventListener("mousemove", onMove));
        }
      } else {
        gsap.set(root, { autoAlpha: 1 });
      }

      // ---------- scroll parallax + exit ----------
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 },
      });
      tl.to(".dream-far", { yPercent: -12, ease: "none" }, 0)
        .to(".dream-mid", { yPercent: -30, ease: "none" }, 0)
        .to(".dream-near", { yPercent: -55, ease: "none" }, 0)
        .to(".dream-plane", { yPercent: -60, xPercent: 26, scale: 1.15, ease: "none" }, 0)
        .to(".dream-copy", { yPercent: -40, opacity: 0, ease: "none" }, 0)
        .to(".dream-dawn", { opacity: 0, ease: "none" }, 0.25)
        .to(".dream-dusk", { opacity: 1, ease: "none" }, 0.45);
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
        {/* dawn sky — clean RwandAir blue falling to a warm horizon */}
        <div
          className="dream-dawn absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#0d3f86 0%,#1a5cab 32%,#4f8fcd 56%,#a8cbe8 76%,#f3d5ae 92%,#f7c78e 100%)",
          }}
        />
        {/* the deeper blue Chapter 2 opens in — fades up as we leave */}
        <div
          className="dream-dusk absolute inset-0 opacity-0"
          style={{ background: "linear-gradient(180deg,#07306a 0%,#0a3d7c 60%,#12509b 100%)" }}
        />

        {/* the sun, low on the horizon */}
        <div
          className="dream-sun pointer-events-none absolute left-1/2 top-[70%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          data-depth="0.4"
          style={{
            background:
              "radial-gradient(circle,rgba(255,238,205,0.95) 0%,rgba(255,212,152,0.42) 26%,rgba(255,200,140,0.1) 48%,transparent 66%)",
          }}
          aria-hidden
        />

        {/* ── the weather system — three believable altitudes ────────────── */}

        {/* far: a faint bank drifting near the sun, softened by distance */}
        <div className="dream-far absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD_FAR}
            alt=""
            data-depth="0.6"
            className="dream-cloud absolute left-[32%] top-[46%] w-[58%] opacity-60 blur-[2px]"
          />
        </div>

        {/* mid: the main deck resting on the horizon, bottoms out of frame */}
        <div className="dream-mid absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD_BANK}
            alt=""
            data-depth="1.1"
            className="dream-cloud absolute bottom-[-6%] left-[-12%] w-[78%] opacity-90"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD_SOFT}
            alt=""
            data-depth="1.3"
            className="dream-cloud absolute bottom-[-14%] right-[-14%] w-[74%] opacity-80"
          />
        </div>

        {/* the aircraft, banking through the deck */}
        <div
          className="dream-plane absolute left-[54%] top-[40%] w-[clamp(320px,52vw,880px)] -translate-x-1/2 -translate-y-1/2"
          data-depth="1.6"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PLANE}
            alt="A RwandAir Airbus A330 banking into a dawn sky"
            className="w-full drop-shadow-[0_40px_80px_rgba(6,26,58,0.45)]"
          />
        </div>

        {/* near: one wisp sweeping the bottom of the lens, above the aircraft */}
        <div className="dream-near pointer-events-none absolute inset-0 z-[6]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD_SOFT}
            alt=""
            data-depth="2.4"
            className="dream-cloud absolute bottom-[-44%] left-[2%] w-[115%] opacity-55"
          />
        </div>

        {/* soft vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[8]"
          style={{ background: "radial-gradient(120% 80% at 50% 30%,transparent 42%,rgba(7,34,72,0.3) 100%)" }}
          aria-hidden
        />

        {/* copy */}
        <div className="dream-copy absolute inset-0 z-[10] flex flex-col items-center justify-center px-gutter text-center">
          <p className="dream-eyebrow mb-6 text-fluid-xs uppercase tracking-[0.32em] text-white/85 drop-shadow-[0_1px_16px_rgba(7,34,72,0.6)]">
            RwandAir — one journey, seven chapters
          </p>
          <h1 className="font-display text-fluid-display font-light leading-[0.92] tracking-tightest text-white drop-shadow-[0_4px_40px_rgba(7,34,72,0.5)]">
            <span className="reveal-mask block">
              <span className="dream-line block">Every journey</span>
            </span>
            <span className="reveal-mask block">
              <span className="dream-line block">
                begins with a <span className="italic text-gold-300">dream.</span>
              </span>
            </span>
          </h1>
          <p className="dream-sub mt-8 max-w-md text-fluid-body font-light leading-relaxed text-white/80 drop-shadow-[0_1px_16px_rgba(7,34,72,0.6)]">
            Come travel one with us — from the first flutter of anticipation to
            the moment the wheels touch home.
          </p>
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
