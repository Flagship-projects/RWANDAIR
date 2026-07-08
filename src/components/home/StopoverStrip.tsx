"use client";

import Image from "next/image";
import { services } from "@/lib/data";
import { useScrollReveal } from "@/lib/motion";

export function StopoverStrip() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 80%" });

  return (
    <section className="relative overflow-hidden border-t border-line" ref={ref}>
      <div className="relative grid lg:grid-cols-2">
        <div className="relative min-h-[360px]">
          <Image
            src="/assets/aircraft/crew-service.jpg"
            alt="View of a RwandAir winglet over mountainous landscape in flight"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/15" />
        </div>
        <div className="flex flex-col justify-center gap-8 bg-paper-bright px-gutter py-section-md">
          <div className="reveal-item">
            <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">Travel information</p>
            <h3 className="mt-4 max-w-md font-display text-fluid-h3 font-light leading-[1.05] tracking-tightest text-ink">
              Break your journey in Kigali
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.label} className="reveal-item border-t border-line pt-4">
                <p className="font-display text-fluid-body text-ink">{s.label}</p>
                <p className="mt-1.5 text-fluid-sm text-ink/55">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
