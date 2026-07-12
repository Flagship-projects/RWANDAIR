"use client";

import Image from "next/image";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useScrollReveal } from "@/lib/motion";

export function StopoverStrip() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });

  return (
    <section id="stopover" className="relative overflow-hidden border-t border-line" ref={ref}>
      <div className="relative grid lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image
            src="/assets/destinations/kigali.jpg"
            alt="The landscapes of Rwanda"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/25" />
          <div className="reveal-item absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-fluid-xs uppercase tracking-wideish text-ink">Complimentary one-night hotel stay</span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-7 bg-paper-bright px-gutter py-section-md">
          <div className="reveal-item">
            <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">Kigali Stopover</p>
            <h2 className="mt-4 max-w-lg font-display text-fluid-h2 font-light leading-[1.04] tracking-tightest text-ink">
              Plan Your Trip with Peace of Mind
            </h2>
          </div>
          <p className="reveal-item max-w-xl text-fluid-body text-ink/60">
            Turn your layover into an experience. Make the most of your journey with RwandAir&rsquo;s Kigali Stopover,
            an exclusive offer that transforms a long layover into a refreshing travel experience. Eligible transit
            passengers connecting through Kigali can enjoy a complimentary one-night hotel stay, giving them the chance
            to relax, recharge, or discover the charm of Rwanda&rsquo;s vibrant capital.
          </p>
          <div className="reveal-item">
            <ArrowButton href="#stopover">Learn more</ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
