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
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-paper"
      aria-hidden="true"
    >
      <div ref={markRef} className="opacity-0">
        <Image src="/assets/brand/mark.png" alt="" width={56} height={56} className="h-12 w-auto" />
      </div>
      <div className="h-px w-40 overflow-hidden bg-line">
        <div ref={barRef} className="h-full w-full bg-blue-500" />
      </div>
    </div>
  );
}
