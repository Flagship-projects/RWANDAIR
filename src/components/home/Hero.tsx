"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const lines = titleRef.current.querySelectorAll(".hero-line-inner");
    gsap.fromTo(
      lines,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09, delay: 0.15 }
    );
    gsap.fromTo(
      ".hero-fade",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.7, stagger: 0.08 }
    );
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-blue-900">
      <Image
        src="/assets/aircraft/takeoff.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/85 via-blue-900/35 to-blue-900/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-shell px-gutter pb-20 pt-40 sm:pb-28">
        <p className="hero-fade mb-6 text-fluid-xs uppercase tracking-wideish text-gold-400 opacity-0">
          Rwanda&rsquo;s national carrier
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl font-display text-fluid-display font-light leading-[0.95] tracking-tightest text-white"
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

      <div className="hero-fade absolute bottom-8 right-gutter z-10 hidden flex-col items-end gap-2 text-right text-fluid-xs uppercase tracking-wideish text-white/60 opacity-0 sm:flex">
        <span>23 destinations</span>
        <span>4 continents</span>
      </div>
    </section>
  );
}
