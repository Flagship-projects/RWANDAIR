"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * "Fly through the clouds" — a pinned cinematic beat between the booking panel
 * and the route map. As you scroll, the camera pushes into a sea of clouds,
 * cloud banks rush past the lens and white out, a still message holds while the
 * world keeps moving (time-freeze), then the fog clears to reveal the globe.
 *
 * Uses CSS `position: sticky` (not a ScrollTrigger pin) so it never touches the
 * global pin/scroll bookkeeping the globe and fleet sequence rely on.
 */
export function CloudCorridor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);
  const cloudNearRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const topFadeRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Continuous, scroll-independent life: clouds and particles keep drifting
      // even when the scroll (and the message) hold still.
      const drifts: gsap.core.Tween[] = [];
      if (!reduced) {
        drifts.push(
          gsap.to(skyRef.current, {
            xPercent: -2,
            duration: 14,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
        const dots = particlesRef.current?.children;
        if (dots) {
          Array.from(dots).forEach((d, i) => {
            drifts.push(
              gsap.to(d, {
                y: gsap.utils.random(-40, 40),
                x: gsap.utils.random(-24, 24),
                duration: gsap.utils.random(6, 12),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: i * 0.15,
              })
            );
          });
        }
      }

      if (reduced) {
        // Simplified: just present the sky + message, no scrubbed camera work.
        gsap.set([cloudFarRef.current, cloudNearRef.current, flashRef.current], { opacity: 0 });
        gsap.set(msgRef.current, { opacity: 1 });
        gsap.set([topFadeRef.current, bottomFadeRef.current], { opacity: 0 });
        return () => drifts.forEach((t) => t.kill());
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Camera pushes forward into the sea of clouds.
      tl.fromTo(skyRef.current, { scale: 1.06, yPercent: -3 }, { scale: 1.3, yPercent: 5, duration: 1 }, 0);

      // Feather in from the paper section above, and out to paper below.
      tl.fromTo(topFadeRef.current, { opacity: 1 }, { opacity: 0, duration: 0.12 }, 0);
      tl.fromTo(bottomFadeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.84);

      // Far cloud bank swells and passes.
      tl.fromTo(cloudFarRef.current, { opacity: 0, scale: 1.1 }, { opacity: 0.8, scale: 2.6, duration: 0.6 }, 0.04)
        .to(cloudFarRef.current, { opacity: 0, duration: 0.28 }, 0.56);

      // Near cloud bank rushes past the lens — the fly-through.
      tl.fromTo(cloudNearRef.current, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 5.4, duration: 0.52 }, 0.26)
        .to(cloudNearRef.current, { opacity: 0, duration: 0.22 }, 0.62);

      // Brief white-out at the heart of the cloud.
      tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.62, duration: 0.14 }, 0.5)
        .to(flashRef.current, { opacity: 0, duration: 0.2 }, 0.64);

      // The message holds nearly still while everything else moves (time-freeze).
      tl.fromTo(msgRef.current, { opacity: 0, yPercent: 6 }, { opacity: 1, yPercent: 0, duration: 0.16 }, 0.14)
        .to(msgRef.current, { opacity: 0, yPercent: -6, duration: 0.16 }, 0.62);

      return () => drifts.forEach((t) => t.kill());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    // Three viewports of scroll for one line of type is a considered pause on a
    // desktop and a chore on a phone, where it is three full thumb-swipes of
    // sky. The beat keeps its shape, at two thirds the length.
    <div ref={rootRef} id="corridor" className="relative h-[200svh] bg-[#bcdcf3] md:h-[300vh]">
      <div className="sticky top-0 stage-vh overflow-hidden">
        {/* Sea of clouds — the world the camera flies through */}
        <div ref={skyRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/assets/sky/sky-bank.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>

        {/* Floating particles (kept alive during the freeze) */}
        <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/60 blur-[1px]"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${(i * 61) % 100}%`,
                top: `${(i * 37) % 100}%`,
                opacity: 0.35 + (i % 4) * 0.12,
              }}
            />
          ))}
        </div>

        {/* Cloud banks — black-backed plates composited via screen blend */}
        <div ref={cloudFarRef} className="absolute inset-0 z-20 opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-2-a.png" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
        </div>
        <div ref={cloudNearRef} className="absolute inset-0 z-30 opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-1-a.png" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
        </div>

        {/* White-out at the core of the cloud */}
        <div ref={flashRef} className="absolute inset-0 z-40 bg-white opacity-0" aria-hidden />

        {/* Still message */}
        <div ref={msgRef} className="absolute inset-0 z-40 flex flex-col items-center justify-center px-gutter text-center opacity-0">
          <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-blue-700/80">En route</p>
          <h2 className="max-w-3xl font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-blue-900">
            Above the clouds, <span className="italic">Africa</span> draws closer.
          </h2>
        </div>

        {/* Edge feathers into the paper sections above / below */}
        <div
          ref={topFadeRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[40vh] bg-gradient-to-b from-paper to-transparent"
          aria-hidden
        />
        <div
          ref={bottomFadeRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[45vh] bg-gradient-to-t from-paper to-transparent opacity-0"
          aria-hidden
        />
      </div>
    </div>
  );
}
