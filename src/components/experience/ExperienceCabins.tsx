"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ensureGsapRegistered } from "@/lib/motion";
import { cabinDetail } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExperienceCabins() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".cabin-reveal", { opacity: 1, y: 0 });
        return;
      }
      gsap.utils.toArray<HTMLElement>(".cabin-block").forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll(".cabin-reveal"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: block, start: "top 75%", once: true },
          }
        );
        // slow Ken-Burns push on the cabin plate as it passes
        gsap.fromTo(
          block.querySelector(".cabin-plate"),
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="onboard" className="bg-paper py-section-lg">
      <div className="mx-auto max-w-shell px-gutter">
        <SectionHeading
          eyebrow="On board"
          title={<>Two cabins, <span className="italic">one standard</span></>}
          description="Whichever cabin you choose, the service is the same — considered, unhurried and unmistakably Rwandan. What changes is how much room you have to enjoy it."
        />

        <div className="mt-20 space-y-24 lg:space-y-32">
          {cabinDetail.map((cabin, i) => (
            <div
              key={cabin.name}
              className={`cabin-block grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <div className="cabin-plate absolute inset-0 will-change-transform">
                  <Image
                    src={cabin.image}
                    alt={`${cabin.name} cabin`}
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="cabin-reveal text-fluid-xs uppercase tracking-wideish text-blue-500">{cabin.tagline}</p>
                <h3 className="cabin-reveal mt-4 font-display text-fluid-h2 font-light leading-[1.02] tracking-tightest text-ink">
                  {cabin.name}
                </h3>
                <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {cabin.features.map((f) => (
                    <div key={f.title} className="cabin-reveal border-t border-line pt-4">
                      <dt className="font-display text-fluid-lg text-ink">{f.title}</dt>
                      <dd className="mt-2 text-fluid-sm text-ink/60">{f.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
