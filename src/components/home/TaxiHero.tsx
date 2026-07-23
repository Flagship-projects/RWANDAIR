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
        // One line, held on one line wherever it can be: the phrase is the
        // brand's whole promise, and breaking it across two lines cost it its
        // balance. `taxi-head-line` is sized in the stylesheet to fit the
        // viewport on a single row and only wraps on the very narrowest screens.
        <span className="reveal-mask block overflow-hidden">
          <span className="taxi-head-line block whitespace-nowrap">
            Fly the dream of{" "}
            {/* the sunshine from the tail fin, carried into the word it belongs
                to. Gradient biased to the deeper end of the gold so display
                type still clears contrast on a white floor. */}
            <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-[#a8690a] bg-clip-text italic text-transparent">
              Africa.
            </span>
          </span>
        </span>
      }
      body="From Kigali across Africa and beyond, aboard one of the youngest fleets in the sky."
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
