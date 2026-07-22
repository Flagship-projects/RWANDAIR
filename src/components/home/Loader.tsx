"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export function Loader() {
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("ra-loaded");
    if (seen) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem("ra-loaded", "1");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });
    tl.set(barRef.current, { scaleX: 0, transformOrigin: "left" });
    tl.fromTo(markRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    tl.to(barRef.current, { scaleX: 1, duration: 1.05, ease: "power2.inOut" }, "-=0.1");
    tl.to(markRef.current, { opacity: 0, duration: 0.3 }, "+=0.1");
    tl.to(rootRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.05");

    return () => {
      tl.kill();
    };
  }, []);

  if (!visible || skip) return null;

  return (
    // Deep brand blue, not paper. The transparent lockup ("Logo 2") is the
    // white-on-dark cut of the mark — the same asset the closing signature
    // uses — so the site now opens and closes on the identical blue lockup,
    // and the loader lifting away to the white hero is the first transition
    // the visitor sees. (The old loader used mark.png, which is a flat opaque
    // rectangle: that was the "logo with a background".)
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[radial-gradient(120%_90%_at_50%_45%,#0a63bd_0%,#0050a0_38%,#00305f_100%)]"
      aria-hidden="true"
    >
      <div ref={markRef} className="opacity-0 px-gutter">
        <Image
          src="/assets/brand/logotype-transparent.png"
          alt=""
          width={1081}
          height={298}
          priority
          className="h-auto w-[min(62vw,340px)]"
        />
      </div>
      <div className="h-px w-40 overflow-hidden bg-white/20">
        <div ref={barRef} className="h-full w-full bg-gold-400" />
      </div>
    </div>
  );
}
