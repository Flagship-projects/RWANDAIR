"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fleet, cabins } from "@/lib/data";

const FRAME_COUNT = 12;
const frameSrc = (i: number) => `/assets/sequence/frame-${String(i).padStart(2, "0")}.png`;

export function FleetCabin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ frame: 0 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      images.push(img);
    }
    imagesRef.current = images;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    function render() {
      if (!canvas || !ctx) return;
      const img = imagesRef.current[Math.round(frameRef.current.frame)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const parent = canvas.parentElement!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cw = parent.clientWidth;
      const ch = parent.clientHeight;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    images[0].onload = render;

    if (reduced) {
      frameRef.current.frame = FRAME_COUNT - 1;
      const t = setTimeout(render, 50);
      return () => clearTimeout(t);
    }

    // Note: the section is pinned with CSS `position: sticky` rather than GSAP's
    // JS-driven pin. Sticky positioning doesn't require ScrollTrigger to reflow
    // the DOM (pin-spacer insertion), which avoids desync with Lenis's virtual
    // scroll target on load/resize.
    const ctxGsap = gsap.context(() => {
      gsap.to(frameRef.current, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: render,
        },
        onUpdate: render,
      });
    }, wrapperRef);

    window.addEventListener("resize", render);
    return () => {
      ctxGsap.revert();
      window.removeEventListener("resize", render);
    };
  }, []);

  return (
    <div ref={wrapperRef} id="experience" className="relative h-[240vh]">
      <section className="sticky top-0 h-[100svh] overflow-hidden bg-gradient-to-b from-blue-50 to-paper">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/55 to-transparent" />

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-shell px-gutter">
            <div className="max-w-lg">
              <SectionHeading eyebrow="The fleet" title="Built for the long haul" />

              <div className="mt-10 space-y-8">
                {fleet.map((f) => (
                  <div key={f.name} className="border-l-2 border-blue-500/40 pl-5">
                    <p className="font-display text-fluid-lg text-ink">{f.name}</p>
                    <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">{f.role}</p>
                    <p className="mt-2 text-fluid-sm text-ink/60">{f.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6">
                {cabins.map((c) => (
                  <div key={c.name}>
                    <p className="font-display text-fluid-body text-ink">{c.name}</p>
                    <ul className="mt-3 space-y-1.5 text-fluid-xs text-ink/60">
                      {c.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
