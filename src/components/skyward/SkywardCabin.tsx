"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 4 — The Cabin.
 *
 * Opens with the signature reveal: the aircraft as an engineer's blueprint,
 * self-drawing in wireframe, that dissolves into the real machine as a wipe
 * follows the cursor (or, on scroll, sweeps once). Then the visitor walks the
 * length of the aircraft — Business, Premium, Economy — as a horizontal track
 * whose lighting warms and cools between cabins, close-up details surfacing.
 *
 * ── Asset swap points (single source of truth per surface) ──────────────────
 * REAL renders live here; drop higher-res or video by replacing one constant.
 */
const TOPVIEW_REAL = "/assets/Rwandair new assets/rwandair topview.png";
const TOPVIEW_WIRE = "/assets/Rwandair new assets/Rwandair topview wireframe.png";

const CABINS = [
  {
    id: "business",
    name: "Business Class",
    tagline: "Quiet luxury, lie-flat",
    img: "/assets/Rwandair new assets/images (2).jpg",
    detail: "/assets/Rwandair new assets/Serving In Business class.jpg",
    note: "Green leather, direct aisle access, and a bed at thirty-nine thousand feet.",
    light: "linear-gradient(180deg,#0b1a12 0%,#12241a 50%,#0a1410 100%)",
    accent: "#8bbf3c",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The considered middle",
    img: "/assets/Rwandair new assets/rwandair premium inside.jpg",
    detail: "/assets/Rwandair new assets/rwandair premium inside..jpg",
    note: "More room to think, more room to breathe, on the routes that run long.",
    light: "linear-gradient(180deg,#0a1420 0%,#122236 50%,#0a1420 100%)",
    accent: "#20a0e0",
  },
  {
    id: "economy",
    name: "Economy Class",
    tagline: "Comfort, every seat",
    img: "/assets/Rwandair new assets/Rwandair Inside.png",
    detail: "/assets/Rwandair new assets/RWANDAIR economy.jpg",
    note: "Considered from the first row to the last — nobody rides in the back here.",
    light: "linear-gradient(180deg,#0a1018 0%,#141c28 50%,#0a1018 100%)",
    accent: "#7fccef",
  },
];

/* ── the blueprint → real reveal ──────────────────────────────────────────── */
function BlueprintReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const realRef = useRef<HTMLDivElement>(null);
  const [wipe, setWipe] = useState(0); // 0..1, how much "real" is shown from the top

  // cursor-follow wipe (desktop) — the plane materialises where you point
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    function onMove(e: MouseEvent) {
      const r = wrap!.getBoundingClientRect();
      const y = (e.clientY - r.top) / r.height;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setWipe(Math.max(0, Math.min(1, y)));
      });
    }
    function onLeave() {
      gsap.to({ v: wipe }, { v: 0, duration: 0.6, ease: "power2.out", onUpdate() {} });
      setWipe(0);
    }
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on scroll into view, sweep the reveal once and draw the label lines
  useEffect(() => {
    ensureGsapRegistered();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ctx = gsap.context(() => {
      gsap.from(".bp-label", {
        opacity: 0,
        x: (i) => (i % 2 ? 30 : -30),
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: wrap, start: "top 62%" },
      });
      gsap.from(".bp-title > *", {
        yPercent: 120,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: wrap, start: "top 80%" },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (realRef.current) realRef.current.style.clipPath = `inset(0 0 ${(1 - wipe) * 100}% 0)`;
  }, [wipe]);

  const HOTSPOTS = [
    { x: "50%", y: "20%", label: "Flight deck", side: "left" },
    { x: "50%", y: "40%", label: "Business · lie-flat", side: "right" },
    { x: "31%", y: "50%", label: "GE / RR turbofans", side: "left" },
    { x: "50%", y: "66%", label: "Economy · 3-3-3", side: "right" },
    { x: "50%", y: "86%", label: "60m wingspan", side: "left" },
  ];

  return (
    <div className="mx-auto grid max-w-shell items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      {/* copy */}
      <div>
        <p className="mb-6 text-fluid-xs uppercase tracking-[0.32em] text-sky-300/80">
          Chapter Four — The Cabin
        </p>
        <h2 className="bp-title font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
          <span className="reveal-mask block">
            <span className="block">Meet the</span>
          </span>
          <span className="reveal-mask block">
            <span className="block italic text-gold-300">machine.</span>
          </span>
        </h2>
        <p className="mt-8 max-w-md text-fluid-body font-light leading-relaxed text-white/70">
          The Airbus A330 — RwandAir&apos;s long-haul flagship. Move your cursor
          across the airframe and watch the blueprint become real. Then step
          inside.
        </p>
        <p className="mt-6 text-fluid-xs uppercase tracking-[0.2em] text-white/35 lg:hidden">
          Scroll to reveal ↓
        </p>
      </div>

      {/* the reveal stage */}
      <div ref={wrapRef} className="relative mx-auto aspect-[3/4] w-full max-w-[520px]">
        {/* wireframe base (always visible) */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url("${encodeURI(TOPVIEW_WIRE)}")` }}
        />
        {/* real render, clipped from the top by the wipe */}
        <div
          ref={realRef}
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(TOPVIEW_REAL)}")`, clipPath: "inset(0 0 100% 0)" }}
        />
        {/* the wipe seam — a soft scan line */}
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"
          style={{ top: `${wipe * 100}%`, opacity: wipe > 0.01 && wipe < 0.99 ? 1 : 0, boxShadow: "0 0 18px rgba(255,224,122,0.7)" }}
        />

        {/* engineering hotspots */}
        {HOTSPOTS.map((h) => (
          <div
            key={h.label}
            className="bp-label pointer-events-none absolute flex items-center gap-2"
            style={{
              left: h.x,
              top: h.y,
              transform: h.side === "right" ? "translate(6px,-50%)" : "translate(-100%,-50%)",
              flexDirection: h.side === "right" ? "row" : "row-reverse",
            }}
          >
            <span className="h-1 w-1 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(255,224,122,0.9)]" />
            <span className="h-px w-8 bg-gradient-to-r from-gold-300/70 to-transparent" />
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-white/70">
              {h.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── the walkthrough ──────────────────────────────────────────────────────── */
export function SkywardCabin() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".cabin-panel", track);
      const scrollLen = () => track.scrollWidth - window.innerWidth;

      // horizontal walk, pinned
      const tween = gsap.to(track, {
        x: () => -scrollLen(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + scrollLen(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // lighting shifts between cabins as each panel reaches centre
      panels.forEach((panel) => {
        const bg = panel.getAttribute("data-light");
        if (!bg) return;
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive && bgRef.current) gsap.to(bgRef.current, { background: bg, duration: 1.2, ease: "power2.inOut" });
          },
        });
      });

      // per-panel reveal of image + copy
      panels.forEach((panel) => {
        gsap.from(panel.querySelectorAll(".cabin-reveal"), {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 75%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skyward-3" data-skyward-chapter="3" className="relative bg-[#050b18]">
      {/* the blueprint reveal (normal-flow, above the pinned walk) */}
      <div className="px-gutter pb-section-md pt-section-md">
        <BlueprintReveal />
      </div>

      {/* pinned horizontal walkthrough */}
      <div ref={rootRef} className="relative h-[100svh] overflow-hidden">
        <div ref={bgRef} className="absolute inset-0" style={{ background: CABINS[0].light }} />
        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 flex h-full items-center will-change-transform"
        >
          {/* intro card */}
          <div className="cabin-panel flex h-full w-[92vw] shrink-0 flex-col justify-center px-gutter sm:w-[70vw] lg:w-[46vw]">
            <p className="cabin-reveal mb-6 text-fluid-xs uppercase tracking-[0.32em] text-white/60">
              Step inside
            </p>
            <h3 className="cabin-reveal max-w-xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
              Three cabins, <span className="italic text-white/60">one standard.</span>
            </h3>
            <p className="cabin-reveal mt-8 max-w-sm text-fluid-body font-light leading-relaxed text-white/60">
              Walk the length of the aircraft. The light changes as you move from
              one home to the next.
            </p>
            <p className="cabin-reveal mt-10 flex items-center gap-3 text-fluid-xs uppercase tracking-[0.2em] text-white/40">
              Walk forward <span aria-hidden>→</span>
            </p>
          </div>

          {/* one panel per cabin */}
          {CABINS.map((c, i) => (
            <div
              key={c.id}
              data-light={c.light}
              className="cabin-panel flex h-full w-[94vw] shrink-0 items-center gap-8 px-gutter sm:w-[80vw] lg:w-[74vw] lg:gap-14"
            >
              {/* hero image */}
              <div className="cabin-reveal relative aspect-[4/5] h-[58vh] shrink-0 overflow-hidden rounded-[28px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                <span
                  className="absolute left-5 top-5 h-2 w-2 rounded-full"
                  style={{ background: c.accent, boxShadow: `0 0 14px ${c.accent}` }}
                />
              </div>

              {/* copy + detail */}
              <div className="min-w-0 flex-1">
                <span className="cabin-reveal block text-fluid-xs uppercase tracking-[0.28em]" style={{ color: c.accent }}>
                  0{i + 1} — {c.tagline}
                </span>
                <h3 className="cabin-reveal mt-4 font-display text-fluid-h2 font-light leading-[1.0] tracking-tightest text-white">
                  {c.name}
                </h3>
                <p className="cabin-reveal mt-6 max-w-sm text-fluid-body font-light leading-relaxed text-white/70">
                  {c.note}
                </p>
                {/* close-up detail */}
                <div className="cabin-reveal mt-8 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.detail} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          ))}

          {/* tail card */}
          <div className="cabin-panel flex h-full w-[80vw] shrink-0 flex-col justify-center px-gutter lg:w-[40vw]">
            <p className="cabin-reveal font-display text-fluid-h3 font-light italic leading-tight text-white/70">
              And beyond the window, <br />a continent waits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
