"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapRegistered, useMagnetic } from "@/lib/motion";
import { loyaltyTiers, type LoyaltyTier } from "@/lib/data";
import { cn } from "@/lib/cn";

/**
 * DreamMiles — "Ascension".
 *
 * A light, airy chapter set among soft clouds. Its signature move is a
 * scroll-direction inversion: as you scroll DOWN into it, an inner wrapper is
 * lifted UPWARD against the gesture (faster than the page scrolls), so for a
 * beat the content reads as rising — then the offset eases back to zero and
 * hands you to normal 1:1 downward scroll. The illusion is thematic: the four
 * real DreamMiles tiers (Emerald → Silver → Gold → Diamond) are a climb, and
 * the page makes you feel it. The genuine RwandAir membership cards float and
 * tilt to the cursor, catching light. Everything is driven by scrubbed
 * ScrollTriggers over transforms (never a JS pin), so it never disturbs the
 * global pin/scroll bookkeeping the globe and route map rely on.
 */
export function Loyalty() {
  const sectionRef = useRef<HTMLElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const section = sectionRef.current;
    const lift = liftRef.current;
    if (!section || !lift) return;

    // Reduced motion: skip all animation. Elements keep their natural (visible)
    // state, so the section renders fully and statically.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".tier-card"));

    const ctx = gsap.context(() => {
      /* ---- The scroll-inversion "ascension" lift ----
         y dips upward then returns to zero across the section's entry, so the
         content briefly climbs against the scroll before settling. */
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 8%", scrub: 1 },
        })
        .fromTo(lift, { y: 0 }, { y: -150, ease: "power2.out", duration: 0.55 })
        .to(lift, { y: 0, ease: "power2.inOut", duration: 0.45 });

      /* ---- Clouds drift for parallax depth ---- */
      if (cloudsRef.current) {
        gsap.fromTo(
          cloudsRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
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

      /* ---- Each tier act rises + un-banks as it climbs into view ---- */
      gsap.utils.toArray<HTMLElement>(".tier-act").forEach((act) => {
        gsap.from(act.querySelectorAll(".act-reveal"), {
          opacity: 0,
          y: 46,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: act, start: "top 80%", once: true },
        });
        const card = act.querySelector<HTMLElement>(".tier-card");
        if (card) {
          gsap.from(card, {
            opacity: 0,
            y: 80,
            rotateX: -14,
            transformPerspective: 1000,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: act, start: "top 82%", once: true },
          });
        }
      });

      /* ---- Closing block reveal ---- */
      gsap.from(".outro-reveal", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".tier-outro", start: "top 85%", once: true },
      });

      /* ---- Continuous, gentle float on each card ---- */
      const floats = cards.map((card, i) =>
        gsap.to(card, {
          y: `+=${gsap.utils.random(-12, 12)}`,
          duration: gsap.utils.random(5, 7.5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        })
      );

      /* ---- Cursor: 3D tilt + moving glare per card ---- */
      const cleanups: Array<() => void> = [];
      if (!window.matchMedia("(pointer: coarse)").matches) {
        cards.forEach((card) => {
          const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
          const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const glare = card.querySelector<HTMLElement>(".card-glare");

          function onMove(e: MouseEvent) {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
            rotY(nx * 13);
            rotX(-ny * 13);
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
          cleanups.push(() => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
          });
        });
      }

      return () => {
        floats.forEach((t) => t.kill());
        cleanups.forEach((fn) => fn());
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="loyalty"
      className="relative isolate overflow-hidden border-t border-line bg-gradient-to-b from-[#e9f3fd] via-[#f3f8fd] to-paper text-ink"
    >
      {/* ------------------------------ sky backdrop ----------------------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* soft sun glow, high and warm */}
        <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(90%_70%_at_70%_-10%,rgba(255,240,205,0.7),transparent_60%)]" />
        {/* drifting clouds */}
        <div ref={cloudsRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/assets/sky/clouds-1-a.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-70 mix-blend-screen"
            priority={false}
          />
          <Image
            src="/assets/sky/clouds-2-a.png"
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover object-bottom opacity-50 mix-blend-screen"
            priority={false}
          />
        </div>
        {/* fade the very bottom cleanly into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      </div>

      {/* -------------------------------- content -------------------------------- */}
      <div ref={liftRef} className="relative will-change-transform">
        <div className="mx-auto max-w-shell px-gutter py-section-lg">
          {/* header */}
          <div ref={headRef} className="mx-auto max-w-3xl text-center">
            <p className="reveal-item mb-5 text-fluid-xs uppercase tracking-wideish text-blue-500">
              DreamMiles · The World in DreamMiles
            </p>
            <h2 className="reveal-item font-display text-fluid-h1 font-light leading-[0.95] tracking-tightest text-balance text-ink">
              Rise through <span className="italic text-blue-500">the ranks</span>
            </h2>
            <p className="reveal-item mx-auto mt-6 max-w-xl text-fluid-body text-ink/60">
              RwandAir&apos;s loyalty programme turns every journey into altitude. Earn from your first
              flight, then climb four tiers — each unlocking richer bonuses, deeper comfort and
              exclusive privileges that follow you across the world.
            </p>
          </div>

          {/* the four tiers, an ascending alternating climb */}
          <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-32 lg:gap-40">
            {loyaltyTiers.map((tier, i) => (
              <TierAct key={tier.name} tier={tier} order={i} />
            ))}
          </div>

          {/* close */}
          <div className="tier-outro mx-auto mt-28 max-w-2xl text-center sm:mt-36">
            <p className="outro-reveal font-display text-fluid-h3 font-light tracking-tightest text-ink">
              Your climb starts with a single flight.
            </p>
            <div className="outro-reveal mt-8 flex flex-wrap items-center justify-center gap-4">
              <VaultLink href="#" primary>
                Join DreamMiles
              </VaultLink>
              <VaultLink href="#">Sign in to your account</VaultLink>
            </div>
            <p className="outro-reveal mx-auto mt-8 max-w-md text-fluid-xs leading-relaxed text-ink/45">
              Miles are valid for two years and your membership never expires. Request award tickets
              online or via dreammiles@rwandair.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- tier act -------------------------------- */

function TierAct({ tier, order }: { tier: LoyaltyTier; order: number }) {
  const flipped = order % 2 === 1; // alternate the card side down the climb

  return (
    <div className="tier-act grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* card */}
      <div className={cn("[perspective:1400px]", flipped && "lg:order-2")}>
        <CardVisual tier={tier} />
      </div>

      {/* copy */}
      <div className={cn(flipped && "lg:order-1")}>
        <div className="act-reveal flex items-center gap-4">
          <span className="font-display text-fluid-h2 font-light leading-none text-ink/15">
            {tier.index}
          </span>
          <span
            className="h-px flex-1 max-w-[3.5rem] origin-left"
            style={{ background: tier.accent }}
          />
          <span
            className="rounded-full border px-3 py-1.5 text-fluid-xs font-medium"
            style={{ borderColor: `${tier.accent}55`, color: tier.accent, background: `${tier.accent}12` }}
          >
            {tier.bonus}
          </span>
        </div>

        <h3 className="act-reveal mt-5 font-display text-fluid-h2 font-light leading-[0.98] tracking-tightest text-ink">
          {tier.name}
        </h3>
        <p className="act-reveal mt-1.5 text-fluid-xs uppercase tracking-wideish text-ink/45">
          {tier.threshold}
        </p>
        <p className="act-reveal mt-5 max-w-md font-display text-fluid-lg font-light text-ink/70">
          {tier.headline}
        </p>

        <ul className="act-reveal mt-7 max-w-md">
          {tier.benefits.map((b) => (
            <li key={b} className="flex items-baseline gap-3.5 border-t border-line py-3">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: tier.accent }}
              />
              <span className="text-fluid-sm text-ink/75">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------- card visual ------------------------------- */

function CardVisual({ tier }: { tier: LoyaltyTier }) {
  return (
    <div
      className="tier-card group relative isolate mx-auto w-full max-w-[30rem] overflow-hidden rounded-[5.5%] shadow-[0_34px_70px_-24px_rgba(11,31,58,0.55)] will-change-transform [transform-style:preserve-3d]"
      style={{ aspectRatio: "1.585", ["--accent" as string]: tier.accent }}
    >
      {/* the genuine DreamMiles card */}
      <Image
        src={tier.material}
        alt={`RwandAir DreamMiles ${tier.name} card`}
        fill
        sizes="(min-width:1024px) 30rem, 90vw"
        className="scale-[1.035] object-cover"
      />
      {/* inner hairline to seat the card on the sky */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/25" />
      {/* accent glow keyed to the tier */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 opacity-40 blur-2xl"
        style={{ background: `radial-gradient(50% 50% at 50% 60%, ${tier.accent}, transparent 70%)` }}
      />
      {/* moving cursor glare */}
      <div
        className="card-glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(240px 240px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      {/* continuous sheen sweep on hover */}
      <span aria-hidden className="card-sheen pointer-events-none absolute inset-0" />
    </div>
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
          ? "bg-blue-500 px-8 py-3.5 text-white hover:bg-blue-600"
          : "px-2 py-3.5 text-ink/70 hover:text-blue-500"
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
