"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import { ExperienceCabins } from "@/components/experience/ExperienceCabins";
import { ExperienceFleet } from "@/components/experience/ExperienceFleet";
import { BeforeYouFly } from "@/components/experience/BeforeYouFly";

export default function ExperiencePage() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        <PageHero
          eyebrow="Experience & Info"
          lines={["The journey starts", <em key="2">long before takeoff.</em>]}
          description="What the cabin feels like, what the fleet is made of, and everything practical worth knowing before you reach the airport."
          image="/assets/fleet/business-service.jpg"
          imageAlt="RwandAir cabin service"
          chip={{ value: "2 cabins", label: "across the network" }}
        />
        <ExperienceCabins />
        <ExperienceFleet />
        <BeforeYouFly />
        <PageCTA
          eyebrow="Ready when you are"
          title={<>Choose your cabin, and fly the dream.</>}
          image="/assets/fleet/business-rows.jpg"
          primary={{ label: "Book a flight", href: "/#book" }}
          secondary={{ label: "Explore destinations", href: "/destinations" }}
        />
      </main>
      <Footer />
    </>
  );
}
