"use client";

import { TaxiScene } from "@/components/shared/TaxiScene";

/**
 * The Stand — standalone scene on the Journey page, outside the seven chapters.
 *
 * The visual and the scroll mechanic live in TaxiScene, which the homepage hero
 * also uses; this wrapper only supplies the Journey-side copy. It carries no
 * data-journey-chapter, so JourneyChrome's rail and counter still see exactly
 * seven chapters — data-journey-light flips the chrome to dark ink, since
 * white-on-white would be invisible here.
 */
export function JourneyTaxi() {
  return (
    <TaxiScene
      id="journey-taxi"
      sectionProps={{ "data-journey-light": "true" }}
      eyebrow="Airbus A330-300 · 9XR-WP"
      heading={
        <>
          Sixty metres of Rwanda,
          <span className="italic text-blue-500"> moving.</span>
        </>
      }
    />
  );
}
