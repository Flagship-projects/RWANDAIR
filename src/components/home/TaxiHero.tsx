"use client";

import { Button } from "@/components/ui/Button";
import { TaxiScene } from "@/components/shared/TaxiScene";

/**
 * The homepage hero — the same taxi scene as the Journey page's "Stand", with
 * copy written to do a front-door job instead of a narrative one: say who
 * RwandAir is, say where it can take you, and offer the two things a first-time
 * visitor actually wants (book a flight, or look around first).
 *
 * The scene is light, so the site Nav's dark type sits on it without changes.
 */
export function TaxiHero() {
  return (
    <TaxiScene
      id="hero"
      as="h1"
      variant="hero"
      eyebrow="RwandAir · The national carrier of Rwanda"
      heading={
        <>
          Fly the dream of
          <span className="italic text-blue-500"> Africa.</span>
        </>
      }
      body="From Kigali to the rest of the continent and beyond — on one of the youngest fleets in the sky, flown by people who treat every journey as their own."
      actions={
        <>
          <Button href="/#book" variant="primary">
            Book a flight
          </Button>
          <Button href="/journey" variant="outline">
            Take the journey
          </Button>
        </>
      }
    />
  );
}
