"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered } from "@/lib/motion";

type Region = "East Africa" | "West Africa" | "Southern Africa" | "Europe" | "Middle East";

type Featured = {
  city: string;
  country: string;
  code: string;
  region: Region;
  note: string;
  /** Optional cinematic photo; falls back to a brand gradient when absent. */
  image?: string;
};

const featured: Featured[] = [
  { city: "Nairobi", country: "Kenya", code: "NBO", region: "East Africa", note: "East Africa's business gateway", image: "/assets/destinations/nairobi.jpg" },
  { city: "Lagos", country: "Nigeria", code: "LOS", region: "West Africa", note: "West Africa's commercial hub", image: "/assets/destinations/lagos.jpg" },
  { city: "Johannesburg", country: "South Africa", code: "JNB", region: "Southern Africa", note: "The Southern Africa connector", image: "/assets/destinations/johannesburg.jpg" },
  { city: "Dubai", country: "United Arab Emirates", code: "DXB", region: "Middle East", note: "Long-haul link to the Gulf", image: "/assets/destinations/dubai.jpg" },
];

const gradients: Record<Region, string> = {
  "East Africa": "linear-gradient(135deg,#00305f 0%,#0050a0 55%,#20a0e0 100%)",
  "West Africa": "linear-gradient(135deg,#0050a0 0%,#6ea02b 65%,#e8a600 100%)",
  "Southern Africa": "linear-gradient(135deg,#001b39 0%,#00305f 55%,#0050a0 100%)",
  Europe: "linear-gradient(135deg,#243a58 0%,#0050a0 60%,#7fccef 100%)",
  "Middle East": "linear-gradient(135deg,#00305f 0%,#0050a0 50%,#e8a600 100%)",
};

export function FeaturedDestinations() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    ensureGsapRegistered();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    // Phones get a native swipe carousel instead of the horizontal scroll-jack —
    // touch-native, performant, and no 500vh of scroll to sit through.
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobile(true);
      return;
    }
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Rack-focus + parallax: the centred panel is crisp and forward,
            // neighbours drift and recede — each destination its own moment.
            const vw = window.innerWidth;
            let nearest = 0;
            let best = Infinity;
            panels.forEach((el, i) => {
              const rect = el.getBoundingClientRect();
              const d = (rect.left + rect.width / 2 - vw / 2) / vw;
              const media = el.querySelector<HTMLElement>("[data-media]");
              if (media) media.style.transform = `translate3d(${d * -60}px,0,0) scale(1.12)`;
              const inner = el.querySelector<HTMLElement>("[data-inner]");
              if (inner) {
                inner.style.transform = `translate3d(${d * 90}px,0,0)`;
                inner.style.opacity = String(gsap.utils.clamp(0.25, 1, 1 - Math.abs(d) * 1.1));
              }
              if (Math.abs(d) < best) {
                best = Math.abs(d);
                nearest = i;
              }
            });
            setCurrent(nearest);
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  // The mobile and reduced-motion branches below replace this section's ~500vh
  // desktop scroll-jack with a short carousel/list. That swap only happens on the
  // SECOND render (after the effect above flips the flag), and it shortens the
  // page by roughly four viewports. By then every `once` reveal in the sections
  // that follow (Loyalty → the footer) has already measured its "top 82%" trigger
  // against the tall first render, so those triggers now sit ~4 screens too low:
  // the copy stays hidden on the way down and only appears after you scroll past
  // and back (which is the exact bug that was reported, phone-only, below this
  // section). Once the collapsed layout has painted, re-measure every trigger so
  // they line up with where the sections actually are.
  useEffect(() => {
    if (!isMobile && !reduced) return;
    ensureGsapRegistered();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [isMobile, reduced]);

  /* ------- reduced-motion / no-JS fallback: a clean vertical list ------- */
  if (reduced) {
    return (
      <section id="featured" className="border-t border-line py-section-lg">
        <div className="mx-auto max-w-shell px-gutter">
          <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">Featured routes</p>
          <h2 className="text-fluid-h2 font-display font-light tracking-tightest text-ink">Where the dream takes you</h2>
          <div className="mt-12 grid grid-cols-1 divide-y divide-line border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {featured.map((f, i) => (
              <a key={f.city} href="#book" className="group flex flex-col gap-8 px-2 py-10 sm:px-8">
                <span className="font-display text-fluid-lg text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-fluid-h3 font-light tracking-tightest text-ink">{f.city}</h3>
                  <p className="mt-3 text-fluid-sm text-ink/55">{f.country} — {f.note}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- mobile: a native, touch-first swipe carousel ---------------- */
  if (isMobile) {
    return (
      <section id="featured" className="border-t border-line bg-paper py-section-lg">
        <div className="px-gutter">
          <p className="mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">Featured routes</p>
          <h2 className="font-display text-fluid-h2 font-light leading-[0.98] tracking-tightest text-ink">
            Where the <span className="italic">dream</span> takes you
          </h2>
          <p className="mt-4 max-w-md text-fluid-body text-ink/60">
            Four destinations on RwandAir&apos;s growing network — swipe to explore.
          </p>
        </div>

        <div className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-3">
          {featured.map((f, i) => (
            <a
              key={f.city}
              href="#book"
              className="focus-ring relative aspect-[3/4] w-[80vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0" style={{ background: gradients[f.region] }}>
                {f.image && (
                  <Image src={f.image} alt={`${f.city}, ${f.country}`} fill sizes="80vw" className="object-cover" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent" />
              <span className="pointer-events-none absolute -right-2 top-1 font-display text-[20vw] font-light leading-none text-white/10">
                {f.code}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-fluid-sm text-white/50">
                  {String(i + 1).padStart(2, "0")} / 0{featured.length}
                </span>
                <h3 className="mt-1 font-display text-[clamp(2rem,9.5vw,3rem)] font-light leading-[0.95] tracking-tightest text-white">
                  {f.city}
                </h3>
                <p className="mt-2 text-fluid-sm text-white/75">{f.country} — {f.note}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/45 px-5 py-2.5 text-fluid-xs uppercase tracking-wideish text-white">
                  Search {f.code} →
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-3 px-gutter text-fluid-xs uppercase tracking-wideish text-ink/40">
          <span className="h-px w-8 bg-ink/25" /> Swipe to explore
        </p>
      </section>
    );
  }

  return (
    <section id="featured" className="relative bg-paper">
      <div ref={rootRef} style={{ height: `${(featured.length + 1) * 100}vh` }}>
        <div className="sticky top-0 stage-vh overflow-hidden">
          <div ref={trackRef} className="flex h-full w-max will-change-transform">
            {/* intro panel */}
            <div data-panel className="relative flex h-full w-screen shrink-0 flex-col justify-center px-gutter">
              <div data-inner className="max-w-xl">
                <p className="mb-5 text-fluid-xs uppercase tracking-wideish text-blue-500">Featured routes</p>
                <h2 className="font-display text-fluid-h1 font-light leading-[0.95] tracking-tightest text-ink">
                  Where the <span className="italic">dream</span> takes you
                </h2>
                <p className="mt-6 max-w-md text-fluid-body text-ink/60">
                  Four of the destinations on RwandAir's growing network — keep scrolling to travel through them.
                </p>
                <p className="mt-10 flex items-center gap-3 text-fluid-xs uppercase tracking-wideish text-ink/45">
                  <span className="h-px w-10 bg-ink/30" /> Scroll to explore
                </p>
              </div>
            </div>

            {/* destination panels */}
            {featured.map((f, i) => (
              <div key={f.city} data-panel className="relative h-full w-screen shrink-0 overflow-hidden">
                {/* background: photo when provided, brand gradient otherwise */}
                <div data-media className="absolute inset-0 will-change-transform" style={{ background: gradients[f.region] }}>
                  {f.image && (
                    <Image src={f.image} alt={`${f.city}, ${f.country}`} fill sizes="100vw" className="object-cover" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/85 via-blue-900/25 to-blue-900/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-transparent to-transparent" />

                {/* giant ghost region word */}
                <span className="pointer-events-none absolute -right-4 bottom-[-2vh] font-display text-[26vw] font-light leading-none text-white/10">
                  {f.code}
                </span>

                <div data-inner className="relative z-10 flex h-full flex-col justify-center px-gutter">
                  <span className="font-display text-fluid-lg text-white/40">{String(i + 1).padStart(2, "0")} / 0{featured.length}</span>
                  <h3 className="mt-3 font-display text-[clamp(3.5rem,12vw,11rem)] font-light leading-[0.9] tracking-tightest text-white">
                    {f.city}
                  </h3>
                  <p className="mt-4 max-w-md text-fluid-body text-white/75">
                    {f.country} — {f.note}
                  </p>
                  <a
                    href="#book"
                    className="focus-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-fluid-xs uppercase tracking-wideish text-white transition-colors hover:border-white hover:bg-white hover:text-blue-700"
                  >
                    Search flights to {f.code} →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* progress */}
          <div className="pointer-events-none absolute inset-x-gutter bottom-8 z-20 flex items-center gap-4">
            <span className="font-display text-fluid-sm text-ink/50 mix-blend-difference">
              {String(current + 1).padStart(2, "0")}
            </span>
            <div className="relative h-px flex-1 bg-ink/15">
              <div ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-blue-500" />
            </div>
            <span className="font-display text-fluid-sm text-ink/50 mix-blend-difference">
              0{featured.length + 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
