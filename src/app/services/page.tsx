"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { PageCTA } from "@/components/ui/PageCTA";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export default function ServicesPage() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        <PageHero
          eyebrow="Travel Services"
          lines={["Everything you need,", <em key="2">in one place.</em>]}
          description="Stopovers, cargo, documents, connectivity and cover — the services that sit around your ticket, arranged before you fly."
          image="/assets/aircraft/stopover-banner.webp"
          imageAlt="Kigali skyline"
        />
        <ServicesGrid />
        <PageCTA
          eyebrow="One booking, sorted"
          title={<>Add what you need, then go.</>}
          image="/assets/stopover/hero.jpg"
          primary={{ label: "Book a flight", href: "/#book" }}
          secondary={{ label: "Kigali stopover", href: "/stopover" }}
        />
      </main>
      <Footer />
    </>
  );
}
