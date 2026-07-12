"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Loader } from "@/components/home/Loader";
import { Hero } from "@/components/home/Hero";
import { FlightSearch } from "@/components/home/FlightSearch";
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

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <Loader />
      <Nav />
      <CinematicFX />
      <main>
        <Hero />
        <FlightSearch />
        <CloudCorridor />
        <DestinationsSection />
        <FeaturedDestinations />
        <FleetCabin />
        <Loyalty />
        <AdditionalServices />
        <StopoverStrip />
        <TripPlanning />
        <AwardsMarquee />
      </main>
      <Footer />
    </>
  );
}
