"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { StopoverHero } from "@/components/stopover/StopoverHero";
import { StopoverHow } from "@/components/stopover/StopoverHow";
import { StopoverThingsToDo } from "@/components/stopover/StopoverThingsToDo";
import { StopoverCTA } from "@/components/stopover/StopoverCTA";

export default function StopoverPage() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        <StopoverHero />
        <StopoverHow />
        <StopoverThingsToDo />
        <StopoverCTA />
      </main>
      <Footer />
    </>
  );
}
