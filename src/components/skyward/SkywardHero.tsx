"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

const CLOUD = "/assets/Rwandair new assets/cloud asset.png";
const PLANE = "/assets/aircraft/takeoff-cutout.png";

/**
 * Chapter 1 — The Invitation.
 *
 * A breathing dawn sky the visitor drops into on arrival. Cloud plates drift
 * at layered depths (parallax to both scroll and cursor), the aircraft banks
 * quietly in from the horizon, and a single line masks up. On scroll the whole
 * frame lifts and dissolves into the pre-departure dark of Chapter 2 — no cut,
 * a fade through the atmosphere.
 */
export function SkywardHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      // ---------- entrance ----------
      if (!reduced) {
        gsap.set(root, { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".sky-sun", { opacity: 0, scale: 0.8, duration: 2.2 }, 0)
          .from(".sky-cloud", { opacity: 0, duration: 2, stagger: 0.18 }, 0.2)
          .from(
            ".sky-plane",
            { xPercent: -34, yPercent: 22, opacity: 0, rotate: 8, duration: 2.6, ease: "power2.out" },
            0.4
          )
          .from(".sky-line", { yPercent: 120, duration: 1.2, ease: "power4.out", stagger: 0.12 }, 0.9)
          .from(".sky-eyebrow, .sky-sub, .sky-cue", { opacity: 0, y: 16, duration: 1, stagger: 0.14 }, 1.5);

        // idle drift on the aircraft — never quite still
        gsap.to(".sky-plane", {
          yPercent: "+=2.5",
          rotate: "+=1.2",
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
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
          ctx.add(() => window.removeEventListener("mousemove", onMove));
        }
      } else {
        gsap.set(root, { autoAlpha: 1 });
      }

      // ---------- scroll parallax + exit ----------
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 },
      });
      tl.to(".sky-farclouds", { yPercent: -14, ease: "none" }, 0)
        .to(".sky-nearclouds", { yPercent: -42, ease: "none" }, 0)
        .to(".sky-plane", { yPercent: -60, xPercent: 26, scale: 1.15, ease: "none" }, 0)
        .to(".sky-copy", { yPercent: -40, opacity: 0, ease: "none" }, 0)
        .to(".sky-dawn", { opacity: 0, ease: "none" }, 0.2)
        .to(".sky-dusk", { opacity: 1, ease: "none" }, 0.4);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="skyward-0"
      data-skyward-chapter="0"
      className="relative h-[130svh] overflow-hidden opacity-0"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* dawn sky */}
        <div
          className="sky-dawn absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,#0a1a3f 0%,#183a6d 34%,#3f6ea6 56%,#a9c6e0 76%,#f4d3ad 92%,#f7c78e 100%)",
          }}
        />
        {/* the dark that Chapter 2 opens in — fades up as we leave */}
        <div
          className="sky-dusk absolute inset-0 opacity-0"
          style={{ background: "linear-gradient(180deg,#050b18 0%,#0a1a3f 60%,#122c52 100%)" }}
        />

        {/* the sun bloom low on the horizon */}
        <div
          className="sky-sun pointer-events-none absolute left-1/2 top-[70%] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          data-depth="0.4"
          style={{
            background:
              "radial-gradient(circle,rgba(255,235,200,0.95) 0%,rgba(255,210,150,0.45) 26%,rgba(255,200,140,0.12) 48%,transparent 66%)",
          }}
          aria-hidden
        />

        {/* far cloud band */}
        <div className="sky-farclouds absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="0.7"
            className="sky-cloud absolute left-[-8%] top-[52%] w-[70%] opacity-40 mix-blend-screen"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="1"
            className="sky-cloud absolute right-[-10%] top-[38%] w-[64%] opacity-30 mix-blend-screen"
          />
        </div>

        {/* the aircraft */}
        <div className="sky-plane absolute left-[50%] top-[46%] w-[clamp(320px,52vw,880px)] -translate-x-1/2 -translate-y-1/2" data-depth="1.6" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PLANE}
            alt="A RwandAir Airbus A330 banking into a dawn sky"
            className="w-full drop-shadow-[0_40px_80px_rgba(4,12,30,0.45)]"
          />
        </div>

        {/* near cloud band — sweeps the lens, sits above the aircraft */}
        <div className="sky-nearclouds pointer-events-none absolute inset-0 z-[6]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="2.2"
            className="sky-cloud absolute left-[-16%] bottom-[-8%] w-[85%] opacity-55 mix-blend-screen"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOUD}
            alt=""
            data-depth="2.6"
            className="sky-cloud absolute right-[-20%] bottom-[-14%] w-[80%] opacity-45 mix-blend-screen"
          />
        </div>

        {/* soft vignette for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[8]"
          style={{ background: "radial-gradient(120% 80% at 50% 30%,transparent 40%,rgba(5,11,24,0.28) 100%)" }}
          aria-hidden
        />

        {/* copy */}
        <div className="sky-copy absolute inset-0 z-[10] flex flex-col items-center justify-center px-gutter text-center">
          <p className="sky-eyebrow mb-6 text-fluid-xs uppercase tracking-[0.32em] text-white/80 drop-shadow-[0_1px_16px_rgba(4,12,30,0.6)]">
            RwandAir · An invitation
          </p>
          <h1 className="font-display text-fluid-display font-light leading-[0.92] tracking-tightest text-white drop-shadow-[0_4px_40px_rgba(4,12,30,0.5)]">
            <span className="reveal-mask block">
              <span className="sky-line block">Come with us,</span>
            </span>
            <span className="reveal-mask block">
              <span className="sky-line block italic text-gold-300">skyward.</span>
            </span>
          </h1>
          <p className="sky-sub mt-8 max-w-md text-fluid-body font-light leading-relaxed text-white/75 drop-shadow-[0_1px_16px_rgba(4,12,30,0.6)]">
            A journey above Africa, told in seven chapters. Take your time — this
            one is meant to be felt, not skimmed.
          </p>
        </div>

        {/* scroll cue */}
        <div className="sky-cue pointer-events-none absolute inset-x-0 bottom-9 z-[10] flex flex-col items-center gap-3 text-white/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Begin</span>
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
