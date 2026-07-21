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
          <span className="reveal-mask block overflow-hidden">
            <span className="taxi-head-line block">Fly the dream</span>
          </span>
          <span className="reveal-mask block overflow-hidden">
            <span className="taxi-head-line block">
              of{" "}
              {/* the sunshine from the tail fin, carried into the word it belongs
                  to. Gradient biased to the deeper end of the gold so display
                  type still clears contrast on a white floor. */}
              <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-[#a8690a] bg-clip-text italic text-transparent">
                Africa.
              </span>
            </span>
          </span>
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
