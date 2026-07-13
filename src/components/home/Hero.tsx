"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { ensureGsapRegistered } from "@/lib/motion";
import { destinations } from "@/lib/data";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  const skyRef = useRef<HTMLDivElement>(null);
  const farScrollRef = useRef<HTMLDivElement>(null);
  const farDriftRef = useRef<HTMLDivElement>(null);
  const nearScrollRef = useRef<HTMLDivElement>(null);
  const nearDriftRef = useRef<HTMLDivElement>(null);

  const planeScrollRef = useRef<HTMLDivElement>(null);
  const planeIntroRef = useRef<HTMLDivElement>(null);
  const planeMouseRef = useRef<HTMLDivElement>(null);
  const planeBobRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      /* ---- intro (always, even reduced — just snappier) ---- */
      const lines = titleRef.current?.querySelectorAll(".hero-line-inner");
      gsap.fromTo(lines ?? [], { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09, delay: 0.35 });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.9, stagger: 0.08 });
      gsap.to([farDriftRef.current, nearDriftRef.current], { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.2 });
      gsap.fromTo(
        planeIntroRef.current,
        { xPercent: reduced ? 0 : 22, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: reduced ? 0.6 : 1.8, ease: "power3.out", delay: 0.25 }
      );

      if (reduced) return;

      /* ---- continuous life ---- */
      gsap.to(planeBobRef.current, { y: 16, rotation: -1.4, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(farDriftRef.current, { xPercent: -3, duration: 22, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(nearDriftRef.current, { xPercent: 4, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(scrollHintRef.current?.querySelector(".hint-line") ?? {}, {
        scaleY: 0.3,
        transformOrigin: "bottom",
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ---- scroll: the camera climbs, the plane flies away ---- */
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 1 } as const;
      gsap.fromTo(skyRef.current, { scale: 1.08, yPercent: 0 }, { scale: 1.24, yPercent: 6, ease: "none", scrollTrigger: st });
      gsap.to(planeScrollRef.current, { xPercent: -18, yPercent: -42, scale: 0.72, opacity: 0.25, ease: "none", scrollTrigger: st });
      gsap.to(nearScrollRef.current, { scale: 1.9, yPercent: 26, opacity: 0.9, ease: "none", scrollTrigger: st });
      gsap.to(farScrollRef.current, { yPercent: 14, scale: 1.1, ease: "none", scrollTrigger: st });
      gsap.to(contentRef.current, { yPercent: -30, opacity: 0.15, ease: "none", scrollTrigger: st });
      gsap.to(scrollHintRef.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "10% top", scrub: true } });

      /* ---- cursor parallax (depth) ---- */
      if (!coarse) {
        const planeX = gsap.quickTo(planeMouseRef.current, "x", { duration: 1, ease: "power3.out" });
        const planeY = gsap.quickTo(planeMouseRef.current, "y", { duration: 1, ease: "power3.out" });
        const farX = gsap.quickTo(farDriftRef.current, "x", { duration: 1.4, ease: "power3.out" });
        const nearX = gsap.quickTo(nearDriftRef.current, "x", { duration: 0.8, ease: "power3.out" });
        function onMove(e: MouseEvent) {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          planeX(nx * 46);
          planeY(ny * 30);
          farX(nx * 18);
          nearX(nx * -34);
        }
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative flex min-h-[100svh] items-end overflow-hidden bg-blue-900">
      {/* sky */}
      <div ref={skyRef} className="absolute inset-0 will-change-transform">
        <Image src="/assets/sky/sky-bank.png" alt="" fill priority sizes="100vw" className="object-cover" aria-hidden />
      </div>

      {/* far clouds */}
      <div ref={farScrollRef} className="absolute inset-0 will-change-transform">
        <div ref={farDriftRef} className="absolute inset-[-6%] opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-2-a.png" alt="" fill sizes="100vw" className="object-cover opacity-70" aria-hidden />
        </div>
      </div>

      {/* the plane */}
      <div ref={planeScrollRef} className="absolute inset-0 z-[2] will-change-transform">
        <div ref={planeIntroRef} className="absolute inset-0 opacity-0 will-change-transform">
          <div ref={planeMouseRef} className="absolute inset-0 will-change-transform">
            <div ref={planeBobRef} className="absolute left-1/2 top-[7%] w-[84vw] max-w-[940px] -translate-x-1/2 will-change-transform sm:left-[55%]">
              <Image
                src="/assets/aircraft/plane.png"
                alt="RwandAir Airbus A330 in flight"
                width={2086}
                height={585}
                priority
                className="h-auto w-full drop-shadow-[0_34px_46px_rgba(0,18,45,0.4)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* near clouds (foreground) */}
      <div ref={nearScrollRef} className="absolute inset-0 z-[3] will-change-transform">
        <div ref={nearDriftRef} className="absolute inset-[-8%] opacity-0 will-change-transform">
          <Image src="/assets/sky/clouds-1-a.png" alt="" fill sizes="100vw" className="object-cover opacity-90" aria-hidden />
        </div>
      </div>

      {/* legibility scrims */}
      <div className="absolute inset-0 z-[4] bg-gradient-to-t from-blue-900/85 via-blue-900/25 to-blue-900/5" />
      <div className="absolute inset-0 z-[4] bg-gradient-to-b from-blue-900/45 via-transparent to-transparent" />
      {/* soft vignette behind the headline so it reads over the aircraft */}
      <div
        className="absolute inset-0 z-[4]"
        style={{ background: "radial-gradient(115% 80% at 12% 100%, rgba(2,17,44,0.72) 0%, rgba(2,17,44,0) 52%)" }}
      />

      {/* content */}
      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-28 pt-28 sm:pb-32">
        <p className="hero-fade mb-5 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">
          Rwanda&rsquo;s national carrier
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl font-display text-fluid-h1 font-light leading-[0.95] tracking-tightest text-white drop-shadow-[0_2px_20px_rgba(0,20,50,0.4)]"
        >
          <span className="reveal-mask block"><span className="hero-line-inner block">Fly the</span></span>
          <span className="reveal-mask block"><span className="hero-line-inner block italic">Dream</span></span>
          <span className="reveal-mask block"><span className="hero-line-inner block">of Africa.</span></span>
        </h1>
        <div className="hero-fade mt-10 flex flex-wrap items-center gap-5 opacity-0">
          <Button href="#book">Book a flight</Button>
          <Button href="#destinations" variant="ghost" className="!text-white hover:!text-gold-400">
            Explore the network ↓
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="hero-fade absolute bottom-8 right-gutter z-10 hidden flex-col items-end gap-2 text-right text-fluid-xs uppercase tracking-wideish text-white/60 opacity-0 sm:flex">
        <span>{destinations.length} destinations</span>
        <span>3 continents</span>
      </div>

      {/* scroll hint */}
      <div ref={scrollHintRef} className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 lg:flex">
        <span className="text-[10px] uppercase tracking-wideish text-white/60">Scroll</span>
        <span className="hint-line block h-8 w-px origin-top bg-white/50" />
      </div>
    </section>
  );
}
