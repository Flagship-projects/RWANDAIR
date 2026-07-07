"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { Loader } from "@/components/home/Loader";
import { Hero } from "@/components/home/Hero";
import { FlightSearch } from "@/components/home/FlightSearch";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FleetCabin } from "@/components/home/FleetCabin";
import { Loyalty } from "@/components/home/Loyalty";
import { StopoverStrip } from "@/components/home/StopoverStrip";
import { AwardsMarquee } from "@/components/home/AwardsMarquee";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <FlightSearch />
        <DestinationsSection />
        <FeaturedDestinations />
        <FleetCabin />
        <Loyalty />
        <StopoverStrip />
        <AwardsMarquee />
      </main>
      <Footer />
    </>
  );
}
