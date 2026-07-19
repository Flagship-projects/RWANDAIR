"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import { TierLadder } from "@/components/dreammiles/TierLadder";
import { EarnAndRedeem } from "@/components/dreammiles/EarnAndRedeem";

export default function DreamMilesPage() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        <PageHero
          eyebrow="DreamMiles"
          lines={["Every flight", <em key="2">takes you higher.</em>]}
          description="RwandAir's loyalty programme rewards the way you already travel — four tiers, real benefits, and miles that are worth spending."
          image="/assets/aircraft/a330-livery-01.jpg"
          imageAlt="RwandAir aircraft in flight"
          chip={{ value: "4 tiers", label: "Emerald to Diamond" }}
        />
        <TierLadder />
        <EarnAndRedeem />
        <PageCTA
          eyebrow="Free to join"
          title={<>Start earning on your very next flight.</>}
          image="/assets/aircraft/a330-livery-03.jpg"
          primary={{ label: "Join DreamMiles", href: "/#book" }}
          secondary={{ label: "Back to home", href: "/" }}
        />
      </main>
      <Footer />
    </>
  );
}
