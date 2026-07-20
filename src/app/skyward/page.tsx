"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Footer } from "@/components/home/Footer";
import { SkywardChrome } from "@/components/skyward/SkywardChrome";
import { SkywardHero } from "@/components/skyward/SkywardHero";
import { SkywardDeparture } from "@/components/skyward/SkywardDeparture";
import { SkywardIntoSky } from "@/components/skyward/SkywardIntoSky";
import { SkywardCabin } from "@/components/skyward/SkywardCabin";
import { SkywardWindow } from "@/components/skyward/SkywardWindow";
import { SkywardAfrica } from "@/components/skyward/SkywardAfrica";
import { SkywardArrival } from "@/components/skyward/SkywardArrival";

/**
 * "Skyward" — the flagship cinematic journey.
 *
 * Not a marketing page but an interactive documentary in seven chapters, each
 * scroll a step deeper into a single continuous flight above Africa. It carries
 * its own dark chrome (never the light site Nav), and only at Arrival does it
 * hand the visitor gently back to the rest of the site via the shared Footer.
 *
 *   1  The Invitation      a breathing dawn sky, the aircraft arriving
 *   2  Every Journey Begins the charged quiet before departure
 *   3  Into the Sky         a real scroll-driven climb through the clouds
 *   4  The Cabin            the machine revealed, then walked through
 *   5  The Window           one held, wordless moment at the glass
 *   6  Africa From Above    the continent, revealed like weather
 *   7  Arrival              the descent, and the way back home
 */
export default function SkywardPage() {
  useSmoothScroll();

  return (
    <>
      <SkywardChrome />
      <main className="bg-[#050b18] text-white">
        <SkywardHero />
        <SkywardDeparture />
        <SkywardIntoSky />
        <SkywardCabin />
        <SkywardWindow />
        <SkywardAfrica />
        <SkywardArrival />
      </main>
      <Footer />
    </>
  );
}
