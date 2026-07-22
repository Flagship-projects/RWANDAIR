"use client";

import Image from "next/image";
import { awards } from "@/lib/data";
import { useScrollReveal } from "@/lib/motion";

export function AwardsMarquee() {
  const ref = useScrollReveal<HTMLDivElement>({ selector: ".reveal-item", start: "top 82%" });

  return (
    <section className="border-t border-line py-section-lg" ref={ref}>
      <div className="mx-auto max-w-shell px-gutter">
        <div className="max-w-2xl">
          <p className="reveal-item mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">Recognition</p>
          <h2 className="reveal-item text-fluid-h2 font-display font-light leading-[1.02] tracking-tightest text-ink">
            Honoured across <span className="italic">the industry</span>
          </h2>
          <p className="reveal-item mt-6 text-fluid-body text-ink/60">
            From cabin service to safety, RwandAir&rsquo;s work is recognised by the awards that matter most in
            global aviation.
          </p>
        </div>

        {/* On a phone three full-width trophy cards is three screens of scroll
            for what is essentially a proof point — so they become a row that
            reads at a glance: medal beside the citation, not stacked above it. */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:mt-16 sm:gap-6 sm:grid-cols-3">
          {awards.map((a) => (
            <div
              key={a.title}
              className="reveal-item group flex items-center gap-5 rounded-2xl border border-line bg-paper-bright px-5 py-5 text-left shadow-sm shadow-blue-900/5 transition-shadow duration-500 hover:shadow-xl hover:shadow-blue-900/10 sm:flex-col sm:px-8 sm:py-10 sm:text-center"
            >
              <div className="relative h-16 w-16 shrink-0 transition-transform duration-500 ease-premium group-hover:-translate-y-1 group-hover:scale-105 sm:h-28 sm:w-28">
                <Image src={a.image} alt={`${a.title} award`} fill sizes="(min-width:640px) 112px, 64px" className="object-contain" />
              </div>
              <div>
                <h3 className="font-display text-fluid-lg font-light leading-tight tracking-tight text-ink sm:mt-7">
                  {a.title}
                </h3>
                <p className="mt-2 text-fluid-xs uppercase tracking-wideish text-ink/45 sm:mt-3">{a.issuer}</p>
                <p className="mt-1 font-display text-fluid-sm text-blue-500">{a.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
