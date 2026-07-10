"use client";

import { useSmoothScroll } from "@/lib/motion";
import { Nav } from "@/components/ui/Nav";
import { CinematicFX } from "@/components/ui/CinematicFX";
import { Footer } from "@/components/home/Footer";
import { CargoHero } from "@/components/cargo/CargoHero";
import { CargoStatement } from "@/components/cargo/CargoStatement";
import { CargoServices } from "@/components/cargo/CargoServices";
import { ColdChain } from "@/components/cargo/ColdChain";
import { CargoTerminal } from "@/components/cargo/CargoTerminal";
import { CargoNetwork } from "@/components/cargo/CargoNetwork";
import { CargoVideo } from "@/components/cargo/CargoVideo";
import { CargoCTA } from "@/components/cargo/CargoCTA";

export default function CargoPage() {
  useSmoothScroll();

  return (
    <>
      <Nav />
      <CinematicFX />
      <main>
        <CargoHero />
        <CargoStatement />
        <CargoServices />
        <ColdChain />
        <CargoTerminal />
        <CargoNetwork />
        <CargoVideo />
        <CargoCTA />
      </main>
      <Footer />
    </>
  );
}
