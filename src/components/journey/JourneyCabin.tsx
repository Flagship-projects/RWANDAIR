"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Chapter 4 — Life On Board.
 *
 * Opens with the signature interaction: the aircraft, real and photographic by
 * default. As the cursor moves across the hull, a scanning light passes over
 * the airframe and — only inside its beam — the engineering blueprint surfaces
 * beneath the livery, like an X-ray held to the light. Subtle, premium,
 * technological. (On touch devices the scan sweeps the airframe on its own.)
 *
 * Then the visitor walks the length of the aircraft — Business, Premium,
 * Economy — as a pinned horizontal track whose lighting warms and cools
 * between cabins.
 *
 * ── Asset swap points (single source of truth per surface) ──────────────────
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
    light: "linear-gradient(180deg,#0b2e28 0%,#123f33 50%,#0b2a24 100%)",
    accent: "#8bbf3c",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The considered middle",
    img: "/assets/Rwandair new assets/rwandair premium inside.jpg",
    detail: "/assets/Rwandair new assets/rwandair premium inside..jpg",
    note: "More room to think, more room to breathe, on the routes that run long.",
    light: "linear-gradient(180deg,#082f63 0%,#0d4486 50%,#082c5c 100%)",
    accent: "#20a0e0",
  },
  {
    id: "economy",
    name: "Economy Class",
    tagline: "Comfort, every seat",
    img: "/assets/Rwandair new assets/Rwandair Inside.png",
    detail: "/assets/Rwandair new assets/RWANDAIR economy.jpg",
    note: "Considered from the first row to the last — nobody rides in the back here.",
    light: "linear-gradient(180deg,#0a2c56 0%,#123e74 50%,#0a2850 100%)",
    accent: "#7fccef",
  },
];

/* ── the scan-light blueprint reveal ─────────────────────────────────────── */
function BlueprintScan() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wireRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const wrap = wrapRef.current;
    const wire = wireRef.current;
    const beam = beamRef.current;
    if (!wrap || !wire || !beam) return;

    // The scan state: position (% of the stage) and radius (px). The wireframe
    // is masked to a soft circle around the light; the beam is a slim halo that
    // trails the same point. Everything animates through this one object.
    const scan = { x: 50, y: 40, r: 0 };
    const apply = () => {
      const mask = `radial-gradient(circle ${scan.r}px at ${scan.x}% ${scan.y}%, black 0%, black 58%, transparent 100%)`;
      wire.style.webkitMaskImage = mask;
      wire.style.maskImage = mask;
      beam.style.opacity = String(Math.min(1, scan.r / 120));
      beam.style.left = `${scan.x}%`;
      beam.style.top = `${scan.y}%`;
    };
    apply();

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarse || reduced) {
      // touch / reduced motion: the light makes one slow pass on its own, on loop
      const auto = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: { trigger: wrap, start: "top 75%", toggleActions: "play pause resume pause" },
      });
      auto
        .to(scan, { r: 150, duration: 0.6, ease: "power2.out", onUpdate: apply })
        .fromTo(scan, { x: 50, y: 12 }, { y: 88, duration: 4.5, ease: "sine.inOut", onUpdate: apply }, 0)
        .to(scan, { r: 0, duration: 0.7, ease: "power2.in", onUpdate: apply }, "-=0.7");
      return () => {
        auto.kill();
      };
    }

    // pointer-driven: the light lives under the cursor
    const xTo = gsap.quickTo(scan, "x", { duration: 0.35, ease: "power3.out", onUpdate: apply });
    const yTo = gsap.quickTo(scan, "y", { duration: 0.35, ease: "power3.out", onUpdate: apply });

    function onMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect();
      xTo(((e.clientX - rect.left) / rect.width) * 100);
      yTo(((e.clientY - rect.top) / rect.height) * 100);
    }
    function onEnter() {
      gsap.to(scan, { r: 160, duration: 0.55, ease: "power3.out", onUpdate: apply, overwrite: "auto" });
    }
    function onLeave() {
      gsap.to(scan, { r: 0, duration: 0.5, ease: "power2.in", onUpdate: apply, overwrite: "auto" });
    }
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // headline + hotspot entrance
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
    }, wrap);
    return () => ctx.revert();
  }, []);

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
        <p className="mb-6 text-fluid-xs uppercase tracking-[0.32em] text-sky-300/90">
          Chapter Four — Life on board
        </p>
        <h2 className="bp-title font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
          <span className="reveal-mask block">
            <span className="block">Your home</span>
          </span>
          <span className="reveal-mask block">
            <span className="block italic text-gold-300">for the hours aloft.</span>
          </span>
        </h2>
        <p className="mt-8 max-w-md text-fluid-body font-light leading-relaxed text-white/75">
          The Airbus A330, RwandAir&apos;s long-haul flagship. Run your cursor
          across the hull — a scanning light passes over the airframe and, just
          beneath the livery, the engineering shows through. Then step inside.
        </p>
        <p className="mt-6 text-fluid-xs uppercase tracking-[0.2em] text-white/40 lg:hidden">
          The scan runs on its own — watch the light ↓
        </p>
      </div>

      {/* the scan stage */}
      <div ref={wrapRef} className="relative mx-auto aspect-[3/4] w-full max-w-[520px] cursor-crosshair">
        {/* the real machine — always present */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${encodeURI(TOPVIEW_REAL)}")` }}
        />
        {/* the blueprint beneath the livery — only inside the scan light */}
        <div
          ref={wireRef}
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${encodeURI(TOPVIEW_WIRE)}")`,
            filter: "invert(1) brightness(1.6) drop-shadow(0 0 6px rgba(127,204,239,0.35))",
            WebkitMaskImage: "radial-gradient(circle 0px at 50% 40%, black 0%, transparent 100%)",
            maskImage: "radial-gradient(circle 0px at 50% 40%, black 0%, transparent 100%)",
          }}
          aria-hidden
        />
        {/* the scanning light itself — a soft halo trailing the same point */}
        <div
          ref={beamRef}
          className="pointer-events-none absolute h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
          style={{
            left: "50%",
            top: "40%",
            background:
              "radial-gradient(circle,rgba(127,204,239,0.35) 0%,rgba(127,204,239,0.12) 40%,transparent 70%)",
          }}
          aria-hidden
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
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-white/75">
              {h.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── the walkthrough ──────────────────────────────────────────────────────── */
export function JourneyCabin() {
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
    <section id="journey-3" data-journey-chapter="3" className="relative bg-[#062a5c]">
      {/* the scan-light reveal (normal-flow, above the pinned walk) */}
      <div className="px-gutter pb-section-md pt-section-md">
        <BlueprintScan />
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
            <p className="cabin-reveal mb-6 text-fluid-xs uppercase tracking-[0.32em] text-white/65">
              Step inside
            </p>
            <h3 className="cabin-reveal max-w-xl font-display text-fluid-h1 font-light leading-[0.98] tracking-tightest text-white">
              Three cabins, <span className="italic text-white/65">one standard.</span>
            </h3>
            <p className="cabin-reveal mt-8 max-w-sm text-fluid-body font-light leading-relaxed text-white/65">
              Walk the length of the aircraft. The light changes as you move from
              one home to the next.
            </p>
            <p className="cabin-reveal mt-10 flex items-center gap-3 text-fluid-xs uppercase tracking-[0.2em] text-white/45">
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
              <div className="cabin-reveal relative aspect-[4/5] h-[58vh] shrink-0 overflow-hidden rounded-[28px] shadow-[0_50px_120px_-40px_rgba(2,16,40,0.8)]">
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
                <p className="cabin-reveal mt-6 max-w-sm text-fluid-body font-light leading-relaxed text-white/75">
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
            <p className="cabin-reveal font-display text-fluid-h3 font-light italic leading-tight text-white/75">
              And beyond the window, <br />a continent waits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
