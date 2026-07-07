"use client";

import { FormEvent, useState } from "react";
import { SelectField, InputField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { destinations } from "@/lib/data";

const cities = destinations.map((d) => `${d.city} (${d.code})`);

export function FlightSearch() {
  const [submitted, setSubmitted] = useState(false);
  const [trip, setTrip] = useState<"return" | "oneway">("return");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="book" className="relative -mt-24 z-20 px-gutter sm:-mt-20">
      <div className="mx-auto max-w-shell">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-ink-soft/90 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-6 pt-5 pb-3 text-fluid-xs uppercase tracking-wideish text-paper/60">
            <button
              type="button"
              onClick={() => setTrip("return")}
              className={`focus-ring rounded-full px-4 py-1.5 transition-colors ${trip === "return" ? "bg-paper text-ink" : "hover:text-paper"}`}
            >
              Round trip
            </button>
            <button
              type="button"
              onClick={() => setTrip("oneway")}
              className={`focus-ring rounded-full px-4 py-1.5 transition-colors ${trip === "oneway" ? "bg-paper text-ink" : "hover:text-paper"}`}
            >
              One way
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            <SelectField label="From" defaultValue="Kigali (KGL)" className="lg:col-span-1">
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
            <SelectField label="To" defaultValue="Nairobi (NBO)" className="lg:col-span-1">
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
            <InputField label="Depart" type="date" className="lg:col-span-1" />
            {trip === "return" ? (
              <InputField label="Return" type="date" className="lg:col-span-1" />
            ) : (
              <div className="hidden lg:col-span-1 lg:block" />
            )}
            <SelectField label="Passengers" defaultValue="1 Adult" className="lg:col-span-1">
              {["1 Adult", "2 Adults", "2 Adults, 1 Child", "3 Adults"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </SelectField>
            <SelectField label="Cabin" defaultValue="Economy" className="lg:col-span-1 !border-r-0">
              <option>Economy</option>
              <option>Business</option>
            </SelectField>
          </div>

          <div className="flex justify-end border-t border-line px-6 py-5">
            <Button type="submit">Search flights</Button>
          </div>
        </form>

        {submitted && (
          <div className="mt-4 rounded-xl border border-line bg-ink-soft/70 px-6 py-4 text-fluid-sm text-paper/70">
            Sample results only — this preview isn&rsquo;t connected to a live booking system yet.
          </div>
        )}
      </div>
    </section>
  );
}
