"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Prologue — the experimental video hero (sits ABOVE Chapter One).
 *
 * Treated as the opening scene of a film rather than a video banner: the
 * footage is the storytelling, the type is a title card. Nothing moves except
 * an imperceptible push on the frame and one bloom drifting across it, so the
 * motion in the video is the only motion the eye reads.
 *
 * Deliberately outside the chapter system — it carries no `data-journey-chapter`
 * attribute, so JourneyChrome's rail, counter and tint still see exactly seven
 * chapters and Chapter One remains The Dream. Remove this component and the page
 * is unchanged.
 *
 * Performance notes:
 * - `preload="metadata"` + a poster: the poster paints the LCP frame immediately
 *   while only the container atom of the video is fetched up front.
 * - An IntersectionObserver pauses playback the moment the hero leaves the
 *   viewport — decoding a 1080p stream behind six other chapters is pure waste.
 * - No rAF loop of our own; every scroll effect is one scrubbed GSAP timeline on
 *   compositor-friendly properties (transform / opacity only).
 * - `prefers-reduced-motion` holds the poster frame and skips the reveal.
 */
const VIDEO_WEBM = "/assets/video/journey-hero.webm";
const VIDEO_MP4 = "/assets/video/journey-hero.mp4";
const POSTER = "/assets/video/journey-hero-poster.jpg";

/** The colour Chapter One opens on — the prologue dissolves into it, so the two never cut. */
const HERO_ENTRY_SKY = "#0b3d84";

export function JourneyPrologue() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- playback: start quickly, and never decode off-screen ---------- */
    let io: IntersectionObserver | null = null;
    if (video) {
      if (reduced) {
        video.pause(); // the poster frame is the whole experience
      } else {
        // autoplay can still be refused (low power mode); the poster stays up
        video.play().catch(() => {});
        io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
          },
          { threshold: 0.01 }
        );
        io.observe(root);
      }
    }

    const ctx = gsap.context(() => {
      if (!reduced) {
        /* ---------- the title card assembles ---------- */
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".pro-frame", { opacity: 0, scale: 1.06, duration: 2.2, ease: "power2.out" }, 0)
          .from(".pro-scrim", { opacity: 0, duration: 1.6 }, 0.2)
          .from(".pro-eyebrow", { opacity: 0, y: 14, duration: 1.1 }, 0.7)
          .from(".pro-line", { yPercent: 118, duration: 1.35, ease: "power4.out", stagger: 0.11 }, 0.85)
          .from(".pro-sub", { opacity: 0, y: 18, duration: 1.1 }, 1.5)
          .from(".pro-cta", { opacity: 0, y: 18, duration: 1.1 }, 1.68)
          .from(".pro-cue", { opacity: 0, duration: 1.1 }, 1.95);

        /* ---------- restrained ambient life ---------- */
        // an imperceptible push on the frame — film breathing, not a ken burns
        gsap.to(".pro-frame", { scale: 1.05, duration: 26, ease: "sine.inOut", yoyo: true, repeat: -1 });
        // one soft bloom drifting across the glass
        gsap.to(".pro-bloom", { xPercent: 16, yPercent: -8, duration: 22, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      /* ---------- the exit: the scene recedes into Chapter One ---------- */
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 } })
        .to(".pro-content", { yPercent: -26, opacity: 0, ease: "none" }, 0)
        .to(".pro-cue", { opacity: 0, duration: 0.2, ease: "none" }, 0)
        .to(".pro-frame", { scale: 1.14, ease: "none" }, 0)
        // …and dissolves into the exact blue the dawn sky begins on
        .to(".pro-handoff", { opacity: 1, ease: "none" }, 0.35);
    }, root);

    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="journey-prologue"
      className="relative h-[100svh] overflow-hidden bg-[#04122b]"
    >
      {/* ---------------- the footage ---------------- */}
      <div className="pro-frame absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden
          tabIndex={-1}
        >
          {/* WebM first — smaller at equal quality; MP4 covers Safari and older engines */}
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_MP4} type="video/mp4" />
        </video>
      </div>

      {/* ---------------- cinematic grade ---------------- */}
      <div className="pro-scrim absolute inset-0" aria-hidden>
        {/* foot-to-head scrim: carries the type, leaves the sky alone */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(4,18,43,0.5) 0%,rgba(4,18,43,0.12) 26%,rgba(4,18,43,0.24) 58%,rgba(4,18,43,0.72) 100%)",
          }}
        />
        {/* lens vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 84% at 50% 46%,transparent 44%,rgba(3,14,34,0.4) 100%)" }}
        />
        {/* a whisper of shade under the title card — just enough for the type to
            hold on the brightest frames, without greying out the footage */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(56% 42% at 50% 44%,rgba(3,13,32,0.28) 0%,rgba(3,13,32,0.12) 54%,transparent 78%)" }}
        />
        {/* one drifting bloom — the only light that moves */}
        <div
          className="pro-bloom absolute left-[18%] top-[24%] h-[70vh] w-[70vh] rounded-full opacity-60 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle,rgba(255,231,186,0.22) 0%,rgba(255,214,150,0.08) 42%,transparent 70%)",
          }}
        />
      </div>

      {/* ---------------- the title card ---------------- */}
      {/* pb keeps the title card clear of the scroll cue on short viewports */}
      <div className="pro-content absolute inset-0 z-10 flex flex-col items-center justify-center px-gutter pb-[13vh] text-center">
        <p className="pro-eyebrow mb-8 text-fluid-xs uppercase tracking-[0.4em] text-white/75 drop-shadow-[0_1px_14px_rgba(3,13,32,0.7)]">
          RwandAir presents
        </p>

        {/* display scale only once there's width for it — at 375px it wraps to
            four lines and swallows the frame */}
        <h1 className="max-w-5xl font-display text-fluid-h1 font-light leading-[0.94] tracking-tightest text-white drop-shadow-[0_2px_30px_rgba(3,13,32,0.6)] md:text-fluid-display md:leading-[0.92]">
          <span className="reveal-mask block overflow-hidden">
            <span className="pro-line block">Some journeys</span>
          </span>
          <span className="reveal-mask block overflow-hidden">
            <span className="pro-line block">
              stay with <span className="italic text-gold-300">you.</span>
            </span>
          </span>
        </h1>

        <p className="pro-sub mt-10 max-w-xl text-fluid-lg font-light leading-relaxed text-white/85 drop-shadow-[0_1px_18px_rgba(3,13,32,0.7)]">
          Seven chapters, one flight — from the first flutter of anticipation to
          the moment the wheels touch home.
        </p>

        <a
          href="#journey-0"
          className="pro-cta group mt-12 inline-flex items-center gap-4 rounded-full border border-white/30 bg-white/[0.06] py-4 pl-8 pr-6 text-fluid-sm uppercase tracking-[0.22em] text-white backdrop-blur-md transition-all duration-500 ease-premium hover:border-white/70 hover:bg-white hover:text-ink"
        >
          Begin the journey
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-full border border-white/35 transition-transform duration-500 ease-premium group-hover:translate-y-0.5 group-hover:border-ink/25"
          >
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden>
              <path d="M4.5 0v9M1 6l3.5 3.5L8 6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </a>
      </div>

      {/* ---------------- scroll indicator ---------------- */}
      <div className="pro-cue pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.36em] text-white/55">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[proCue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gradient-to-b from-transparent via-white to-transparent" />
        </span>
      </div>

      {/* the blue Chapter One opens on — fades up so the prologue never cuts */}
      <div
        className="pro-handoff pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{ background: HERO_ENTRY_SKY }}
        aria-hidden
      />

      <style jsx>{`
        @keyframes proCue {
          0% {
            transform: translateY(-120%);
          }
          70%,
          100% {
            transform: translateY(400%);
          }
        }
      `}</style>
    </section>
  );
}
