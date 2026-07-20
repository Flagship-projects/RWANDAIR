"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 5 — The Window.
 *
 * One held, wordless moment. The visitor sits at the glass while the world
 * outside turns: sunrise, golden hour, a storm cell far off, then night and the
 * lights of a city below. The section pins and a single scrubbed timeline cross-
 * fades four "views" inside the window while the cabin stays dim around it.
 *
 * The views are art-directed in pure CSS/canvas so they read as one graded
 * world — the prime candidates for swapping in real (or AI-generated) over-Africa
 * footage later, view-by-view, without touching the frame or the pinning.
 */
const VIEWS = [
  { key: "sunrise", caption: "First light, somewhere over the Rift.", in: 0.0 },
  { key: "golden", caption: "Gold pours across the cloud tops.", in: 0.28 },
  { key: "storm", caption: "A storm keeps its distance, and its beauty.", in: 0.55 },
  { key: "night", caption: "Then night, and a city breathing below.", in: 0.8 },
];

export function SkywardWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  // scattered city lights for the night view
  const lights = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * 100,
        y: 55 + Math.random() * 42,
        s: 0.5 + Math.random() * 1.6,
        d: Math.random() * 3,
      })),
    []
  );

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const views = gsap.utils.toArray<HTMLElement>(".win-view", root);

      if (reduced) {
        views.forEach((v, i) => gsap.set(v, { opacity: i === 0 ? 1 : 0 }));
        return;
      }
      gsap.set(views, { opacity: 0 });
      gsap.set(views[0], { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".win-stage",
          anticipatePin: 1,
          onUpdate: (self) => {
            // caption follows the active view
            const p = self.progress;
            let idx = 0;
            for (let i = 0; i < VIEWS.length; i++) if (p >= VIEWS[i].in) idx = i;
            if (captionRef.current && captionRef.current.dataset.i !== String(idx)) {
              captionRef.current.dataset.i = String(idx);
              gsap.fromTo(
                captionRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", overwrite: true }
              );
              captionRef.current.textContent = VIEWS[idx].caption;
            }
          },
        },
      });

      // cross-fade the four views across the scroll
      for (let i = 1; i < views.length; i++) {
        const at = VIEWS[i].in;
        tl.to(views[i - 1], { opacity: 0, duration: 0.12 }, at - 0.06);
        tl.to(views[i], { opacity: 1, duration: 0.12 }, at - 0.06);
      }

      // slow parallax drift of the outside world within the glass
      tl.fromTo(".win-parallax", { yPercent: -6 }, { yPercent: 6 }, 0);
      // the window frame breathes in on entry
      gsap.from(".win-frame", {
        scale: 0.92,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="skyward-4"
      data-skyward-chapter="4"
      className="relative h-[420vh] bg-[#050810]"
    >
      <div className="win-stage relative flex h-[100svh] items-center justify-center overflow-hidden">
        {/* dim cabin wall */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 40%,#0e141f 0%,#070a12 60%,#04060c 100%)" }} />

        {/* the window */}
        <div className="win-frame relative z-10 aspect-[10/16] h-[74vh] max-h-[820px]">
          {/* glass + views clipped to the rounded shape */}
          <div
            className="win-parallax absolute inset-0 overflow-hidden"
            style={{ borderRadius: "46% 46% 46% 46% / 30% 30% 30% 30%" }}
          >
            {/* sunrise */}
            <div className="win-view absolute inset-0" style={{ background: "linear-gradient(180deg,#1a2a52 0%,#4a5a8f 34%,#c98a6a 62%,#f2b070 80%,#ffd9a0 100%)" }}>
              <div className="absolute left-1/2 top-[74%] h-40 w-40 -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle,#fff2d8 0%,rgba(255,220,160,0.5) 40%,transparent 70%)" }} />
              <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg,transparent,rgba(255,235,210,0.35))" }} />
            </div>

            {/* golden hour */}
            <div className="win-view absolute inset-0" style={{ background: "linear-gradient(180deg,#2a2f5a 0%,#8a6a9a 30%,#e08a5a 58%,#f7b24a 78%,#ffe08a 100%)" }}>
              <div className="absolute inset-x-0 bottom-[8%] h-1/4 opacity-80" style={{ background: "radial-gradient(80% 100% at 50% 100%,#fff0c8 0%,transparent 70%)" }} />
              <div className="absolute inset-x-[-10%] bottom-[18%] h-16 rounded-full bg-white/40 blur-2xl" />
            </div>

            {/* distant storm */}
            <div className="win-view absolute inset-0" style={{ background: "linear-gradient(180deg,#0a1428 0%,#1a2c4a 40%,#2a3f5e 66%,#3a506e 100%)" }}>
              <div className="absolute right-[14%] top-[40%] h-40 w-32 rounded-full bg-[#0a1220] blur-2xl opacity-80" />
              <div className="win-lightning absolute right-[22%] top-[46%] h-24 w-px bg-white/0" />
              <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(180deg,transparent,rgba(20,40,70,0.6))" }} />
            </div>

            {/* night + city lights */}
            <div className="win-view absolute inset-0" style={{ background: "linear-gradient(180deg,#03040a 0%,#070b18 45%,#0a1020 72%,#0c1424 100%)" }}>
              {lights.map((l, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-[#ffdca0]"
                  style={{
                    left: `${l.x}%`,
                    top: `${l.y}%`,
                    width: l.s,
                    height: l.s,
                    boxShadow: "0 0 4px rgba(255,220,160,0.9)",
                    animation: `winTwinkle ${2 + l.d}s ease-in-out ${l.d}s infinite`,
                  }}
                />
              ))}
              <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: "radial-gradient(60% 60% at 30% 10%,rgba(120,160,220,0.15),transparent)" }} />
            </div>
          </div>

          {/* window frame bezel */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: "46% 46% 46% 46% / 30% 30% 30% 30%",
              boxShadow:
                "inset 0 0 0 14px #d9dde3, inset 0 0 0 20px #b7bcc4, inset 0 0 44px 20px rgba(0,0,0,0.35), 0 40px 90px rgba(0,0,0,0.6)",
            }}
          />
          {/* glass reflection */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
            style={{
              borderRadius: "46% 46% 46% 46% / 30% 30% 30% 30%",
              background: "linear-gradient(125deg,rgba(255,255,255,0.35) 0%,transparent 30%,transparent 70%,rgba(255,255,255,0.12) 100%)",
            }}
          />
        </div>

        {/* the single, evolving line */}
        <p
          ref={captionRef}
          data-i="0"
          className="absolute inset-x-0 bottom-[9%] z-10 mx-auto max-w-md px-gutter text-center font-display text-fluid-lg font-light italic text-white/80"
        >
          {VIEWS[0].caption}
        </p>

        {/* chapter marker */}
        <p className="absolute left-gutter top-[14%] z-10 text-fluid-xs uppercase tracking-[0.32em] text-white/40">
          Chapter Five — The Window
        </p>
      </div>

      <style jsx>{`
        @keyframes winTwinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .win-lightning {
          animation: winFlash 6s steps(1) 1s infinite;
        }
        @keyframes winFlash {
          0%,
          92%,
          100% {
            background: rgba(255, 255, 255, 0);
            box-shadow: none;
          }
          93%,
          95% {
            background: rgba(226, 240, 255, 0.9);
            box-shadow: 0 0 30px 6px rgba(200, 224, 255, 0.7);
          }
        }
      `}</style>
    </section>
  );
}
