"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Footer } from "@/components/home/Footer";
import { JourneyChrome } from "@/components/journey/JourneyChrome";
import { JourneyPrologue } from "@/components/journey/JourneyPrologue";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { JourneyTaxi } from "@/components/journey/JourneyTaxi";
import { JourneyDeparture } from "@/components/journey/JourneyDeparture";
import { JourneyClimb } from "@/components/journey/JourneyClimb";
import { JourneyCabin } from "@/components/journey/JourneyCabin";
import { JourneyDaybreak } from "@/components/journey/JourneyDaybreak";
import { JourneyAfrica } from "@/components/journey/JourneyAfrica";
import { JourneyArrival } from "@/components/journey/JourneyArrival";

/**
 * "The Journey" — the flagship cinematic experience.
 *
 * One continuous RwandAir journey, told in seven chapters — because nobody
 * dreams about altitude, everybody remembers a journey. Anticipation, the
 * climb, the hours aloft, the window, the places, the landing: each chapter
 * is a scroll-driven scene, and the climb is one memorable beat inside the
 * larger story, not the theme of the page. It carries its own chrome (never
 * the light site Nav) and only at Arrival hands the visitor back to the site.
 *
 *   1  The Dream            a breathing dawn sky — every journey begins here
 *   2  Anticipation         the charged quiet before departure
 *   3  The Climb            the ascent, felt: the aircraft climbs as you scroll
 *   4  Life On Board        the machine revealed, then lived in
  *   5  First Light           the overnight hours, told as one sunrise
 *   6  Where Journeys Lead  the continent, revealed like weather
 *   7  Arrival              the descent, and the way back home
 */
export default function JourneyPage() {
  useSmoothScroll();

  return (
    <>
      <JourneyChrome />
      <main className="bg-[#07306a] text-white">
        {/* EXPERIMENTAL — the video prologue, under evaluation against the
            existing Chapter One hero below it. It sits outside the chapter
            system; delete this one line to fall back to the original opening. */}
        <JourneyPrologue />
        <JourneyHero />
        {/* EXPERIMENTAL — the studio-floor taxi scene, also outside the chapter
            system. Sitting here for review; move or delete freely. */}
        <JourneyTaxi />
        <JourneyDeparture />
        <JourneyClimb />
        <JourneyCabin />
        <JourneyDaybreak />
        <JourneyAfrica />
        <JourneyArrival />
      </main>
      <Footer />
    </>
  );
}
