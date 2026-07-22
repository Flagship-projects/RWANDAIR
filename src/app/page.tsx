"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Loader } from "@/components/home/Loader";
import { TaxiHero } from "@/components/home/TaxiHero";
import { FlightSearch } from "@/components/home/FlightSearch";
import { BookingDock } from "@/components/home/BookingDock";
import { CloudCorridor } from "@/components/home/CloudCorridor";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FleetCabin } from "@/components/home/FleetCabin";
import { Loyalty } from "@/components/home/Loyalty";
import { AdditionalServices } from "@/components/home/AdditionalServices";
import { StopoverStrip } from "@/components/home/StopoverStrip";
import { TripPlanning } from "@/components/home/TripPlanning";
import { AwardsMarquee } from "@/components/home/AwardsMarquee";
import { Footer } from "@/components/home/Footer";
import { ClosingSignature } from "@/components/home/ClosingSignature";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <Loader />
      <Nav />
      <CinematicFX />
      <main>
        {/* The taxi scene is now the front door. The previous "Above the Clouds"
            hero is still on disk at components/home/Hero.tsx, unused. */}
        <TaxiHero />
        <FlightSearch />
        <CloudCorridor />
        <DestinationsSection />
        <FeaturedDestinations />
        <Loyalty />
        <AdditionalServices />
        <StopoverStrip />
        <FleetCabin />
        <TripPlanning />
        <AwardsMarquee />
      </main>
      <Footer />
      <ClosingSignature />
      <BookingDock />
    </>
  );
}
