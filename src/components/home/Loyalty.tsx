"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered, useMagnetic } from "@/lib/motion";
import { loyaltyTiers, type LoyaltyTier } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * DreamMiles — "Ascension".
 *
 * A dark cinematic chapter set above the stratosphere. The section's signature
 * move is a scroll-direction inversion: as you scroll DOWN into it, an inner
 * wrapper is lifted UPWARD against the gesture (faster than the page scrolls),
 * so for a beat the content reads as rising — then the offset eases back to zero
 * and hands you to normal 1:1 downward scroll. The illusion is thematic here:
 * the four real DreamMiles tiers (Emerald → Silver → Gold → Diamond) are a climb,
 * and the page makes you feel it. Everything is driven by scrubbed ScrollTriggers
 * over transforms (never a JS pin), so it never touches the global pin/scroll
 * bookkeeping the globe and route map rely on.
 */
export function Loyalty() {
  const sectionRef = useRef<HTMLElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    ensureGsapRegistered();
    const section = sectionRef.current;
    const lift = liftRef.current;
    if (!section || !lift) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".tier-card"));

    const ctx = gsap.context(() => {
      /* ---- The scroll-inversion "ascension" lift ----
         y dips upward then returns to zero across the section's entry, so the
         content briefly climbs against the scroll before settling. */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 8%",
            scrub: 1,
          },
        })
        .fromTo(lift, { y: 0 }, { y: -150, ease: "power2.out", duration: 0.55 })
        .to(lift, { y: 0, ease: "power2.inOut", duration: 0.45 });

      /* ---- Backdrop parallax (opposite drift for depth) ---- */
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 10,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }

      /* ---- Header reveal ---- */
      if (headRef.current) {
        gsap.from(headRef.current.querySelectorAll(".reveal-item"), {
          opacity: 0,
          y: 34,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: headRef.current, start: "top 82%", once: true },
        });
      }

      /* ---- Cards rise + unbank as they climb into view ---- */
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 90, rotateX: -12, transformPerspective: 1000 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );

        // Track which tier is centred, to drive the left-hand progress rail.
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      /* ---- Cursor: 3D tilt + moving glare per card ---- */
      if (!window.matchMedia("(pointer: coarse)").matches) {
        cards.forEach((card) => {
          const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
          const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const glare = card.querySelector<HTMLElement>(".card-glare");

          function onMove(e: MouseEvent) {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - (r.left + r.width / 2)) / r.width; // -0.5..0.5
            const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
            rotY(nx * 11);
            rotX(-ny * 11);
            if (glare) {
              glare.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
              glare.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
              glare.style.opacity = "1";
            }
          }
          function onLeave() {
            rotY(0);
            rotX(0);
            if (glare) glare.style.opacity = "0";
          }
          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="loyalty"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      {/* ------------------------------- backdrop ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/assets/loyalty/vault.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-80"
            priority={false}
          />
        </div>
        {/* vertical scrims: clean top/bottom seams into neighbouring light sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/55 to-ink" />
        {/* warm horizon glow, low and central */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(247,198,35,0.10),transparent_60%)]" />
        {/* faint grain via subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,transparent_55%,rgba(0,10,25,0.55))]" />
      </div>

      {/* ------------------------------- content ------------------------------- */}
      <div ref={liftRef} className="relative will-change-transform">
        <div className="mx-auto max-w-shell px-gutter py-section-lg">
          {/* header */}
          <div ref={headRef} className="max-w-3xl">
            <p className="reveal-item mb-5 text-fluid-xs uppercase tracking-wideish text-gold-400">
              DreamMiles · The World in DreamMiles
            </p>
            <h2 className="reveal-item font-display text-fluid-h1 font-light leading-[0.95] tracking-tightest text-balance">
              Rise through <span className="italic text-gold-300">the ranks</span>
            </h2>
            <p className="reveal-item mt-6 max-w-xl text-fluid-body text-white/65">
              RwandAir&apos;s loyalty programme turns every journey into altitude. Earn from your first
              flight, then climb four tiers — each unlocking richer bonuses, deeper comfort and
              exclusive privileges that follow you across the world.
            </p>
          </div>

          {/* main: sticky narrative rail + ascending cards */}
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* left — sticky progress rail */}
            <div className="lg:sticky lg:top-28 lg:h-fit lg:self-start">
              <p className="text-fluid-xs uppercase tracking-wideish text-white/40">Your climb</p>
              <ol className="mt-6 space-y-1">
                {loyaltyTiers.map((tier, i) => (
                  <li key={tier.name}>
                    <button
                      type="button"
                      aria-current={active === i}
                      className="group flex w-full items-center gap-4 py-2.5 text-left"
                      onClick={() => {
                        document
                          .getElementById(`tier-${tier.name.toLowerCase()}`)
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full transition-all duration-500"
                        style={{
                          background: active >= i ? tier.accent : "rgba(255,255,255,0.22)",
                          boxShadow: active === i ? `0 0 14px ${tier.accent}` : "none",
                        }}
                      />
                      <span
                        className={cn(
                          "font-display text-fluid-lg transition-colors duration-500",
                          active === i ? "text-paper" : "text-white/45 group-hover:text-white/75"
                        )}
                      >
                        {tier.name}
                      </span>
                      <span className="ml-auto font-display text-fluid-xs text-white/30">
                        {tier.index}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <VaultLink href="#" primary>
                  Join DreamMiles
                </VaultLink>
                <VaultLink href="#">Sign in to your account</VaultLink>
              </div>

              <p className="mt-10 max-w-xs text-fluid-xs leading-relaxed text-white/40">
                Miles are valid for two years and your membership never expires. Award tickets via
                dreammiles@rwandair.com or online.
              </p>
            </div>

            {/* right — the four tiers, an ascending staircase on a flight-path spine */}
            <div ref={clusterRef} className="relative [perspective:1400px]">
              <div className="flex flex-col gap-7 sm:gap-9">
                {loyaltyTiers.map((tier, i) => (
                  <TierCard key={tier.name} tier={tier} rise={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- tier card ------------------------------- */

function TierCard({ tier, rise }: { tier: LoyaltyTier; rise: number }) {
  // Progressive indent + scale so the stack literally reads as a climb.
  const indent = ["lg:ml-0", "lg:ml-6", "lg:ml-12", "lg:ml-20"][rise] ?? "";

  return (
    <article
      id={`tier-${tier.name.toLowerCase()}`}
      className={cn(
        "tier-card group relative isolate overflow-hidden rounded-3xl border border-white/12 shadow-2xl shadow-black/40 will-change-transform [transform-style:preserve-3d]",
        indent
      )}
      style={{ ["--accent" as string]: tier.accent }}
    >
      {/* metal material */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={tier.material}
          alt={`${tier.name} tier material`}
          fill
          sizes="(min-width:1024px) 46vw, 100vw"
          className="scale-105 object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-110"
        />
      </div>
      {/* legibility scrims — darken toward the text (left), floor and top */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/92 via-ink/72 to-ink/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-transparent to-ink/45" />
      {/* accent wash keyed to the gem */}
      <div
        className="absolute inset-0 -z-10 opacity-25 mix-blend-screen"
        style={{ background: `radial-gradient(120% 140% at 100% 0%, ${tier.accent}, transparent 55%)` }}
      />
      {/* moving cursor glare */}
      <div
        className="card-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(220px 220px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.22), transparent 65%)",
        }}
      />
      {/* continuous sheen sweep */}
      <span aria-hidden className="card-sheen pointer-events-none absolute inset-0" />
      {/* accent hairline top edge */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)` }}
      />

      {/* crane watermark */}
      <Image
        src="/assets/brand/mark.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none absolute -right-3 -top-3 w-24 opacity-[0.12] mix-blend-screen sm:w-28"
      />

      {/* content */}
      <div className="relative flex flex-col gap-5 p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* node dot on the flight-path spine */}
            <span
              className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-ink/60 font-display text-fluid-xs backdrop-blur-sm"
              style={{ color: tier.accent }}
            >
              {tier.index}
            </span>
            <div>
              <h3 className="font-display text-fluid-h3 font-light leading-none tracking-tightest">
                {tier.name}
              </h3>
              <p className="mt-1.5 text-fluid-xs uppercase tracking-wideish text-white/45">
                {tier.threshold}
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-full border px-3 py-1.5 text-fluid-xs font-medium"
            style={{ borderColor: `${tier.accent}66`, color: tier.accent, background: `${tier.accent}12` }}
          >
            {tier.bonus}
          </span>
        </div>

        <p className="font-display text-fluid-lg font-light text-white/85">{tier.headline}</p>

        <ul className="grid gap-y-1.5">
          {tier.benefits.map((b) => (
            <li key={b} className="flex items-baseline gap-3 border-t border-white/10 py-2.5">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: tier.accent }}
              />
              <span className="text-fluid-sm text-white/75">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* --------------------------------- CTA link -------------------------------- */

function VaultLink({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.22);
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "focus-ring relative inline-flex items-center justify-center gap-2 rounded-full text-fluid-sm font-medium tracking-tight transition-colors duration-300 ease-premium",
        primary
          ? "bg-gold-400 px-8 py-3.5 text-ink hover:bg-gold-300"
          : "px-2 py-3.5 text-white/70 hover:text-paper"
      )}
    >
      {children}
      {primary && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </a>
  );
}
