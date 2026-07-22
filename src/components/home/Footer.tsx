"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { footerColumnGroups, socialLinks } from "@/lib/data";
import { socialIcons, GooglePlayIcon, AppleIcon, ArrowRightIcon } from "@/components/ui/BrandIcons";

function AppButton({ store, line1, line2, icon }: { store: string; line1: string; line2: string; icon: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={`${line1} ${line2}`}
      className="focus-ring flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-white transition-transform duration-300 hover:-translate-y-0.5"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="flex flex-col leading-none">
        <span className="text-[9px] uppercase tracking-wide text-white/70">{line1}</span>
        <span className="mt-0.5 font-display text-fluid-sm">{line2}</span>
      </span>
    </a>
  );
}

type FooterColumn = (typeof footerColumnGroups)[number][number];

/**
 * A footer column. On a wide screen it is simply a heading and its list — but
 * on a phone the five stacked groups run to well over a thousand pixels of
 * undifferentiated links, so there they collapse into an accordion: every
 * heading stays scannable and the visitor opens only what they came for.
 * The rows are always mounted (a `grid-rows` transition rather than a mount
 * toggle) so the markup a wide screen renders is identical.
 */
function LinkColumn({ col }: { col: FooterColumn }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line sm:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between gap-4 py-4 text-left sm:pointer-events-none sm:py-0"
      >
        <span className="text-fluid-xs font-semibold uppercase tracking-wideish text-ink">
          {col.title}
        </span>
        <svg
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 shrink-0 text-ink/40 transition-transform duration-300 sm:hidden ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          aria-hidden
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-premium sm:grid-rows-[1fr] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2.5 pb-5 sm:mt-4 sm:pb-0">
            {col.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="focus-ring text-fluid-sm text-ink/55 transition-colors hover:text-blue-500"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer id="holidays" className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-shell px-gutter py-section-md">
        {/* brand block — its own full-width row, so everything below shares one top edge */}
        <div className="mb-8 sm:mb-14 lg:mb-16">
          <Image
            src="/assets/brand/logotype.png"
            alt="RwandAir"
            width={160}
            height={38}
            className="h-7 w-auto"
          />
          <p className="mt-6 max-w-xs text-fluid-sm text-ink/55">
            Rwanda&rsquo;s national carrier, connecting Kigali to Africa, Europe and the Middle East.
          </p>
        </div>

        {/* no row gap on a phone: the three groups are one continuous divided
            list of accordion rows there, and a gap between them would read as
            three unrelated blocks */}
        <div className="grid gap-x-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-[1fr_1fr_1fr_340px] lg:gap-x-12">
          {/* three balanced link columns, each stacking its sections top-aligned */}
          {footerColumnGroups.map((group, i) => (
            <div key={i} className="sm:space-y-10">
              {group.map((col) => (
                <LinkColumn key={col.title} col={col} />
              ))}
            </div>
          ))}

          {/* connect rail — same top edge as the link columns */}
          <div className="mt-4 flex flex-col gap-10 sm:mt-0">
            <div>
              <p className="font-display text-fluid-lg text-ink">Let&rsquo;s be connected</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((s) => {
                  const Icon = socialIcons[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-bright text-ink/70 transition-colors duration-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* newsletter */}
            <div>
              <p className="text-fluid-xs uppercase tracking-wideish text-ink/50">Newsletter</p>
              <form onSubmit={handleSubscribe} className="mt-3 flex items-center gap-2 rounded-full border border-line bg-paper-bright py-1.5 pl-5 pr-1.5 focus-within:border-blue-500/50">
                <input
                  type="email"
                  required
                  placeholder="Subscribe to our newsletter"
                  className="w-full bg-transparent text-fluid-sm text-ink placeholder:text-ink/40 focus:outline-none"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-fluid-xs text-green-600">Thanks — you&rsquo;re on the list (demo only).</p>
              )}
            </div>

            {/* app download */}
            <div>
              <p className="font-display text-fluid-lg text-ink">Download the RwandAir App</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <AppButton store="google" line1="Get it on" line2="Google Play" icon={<GooglePlayIcon className="h-5 w-5" />} />
                <AppButton store="apple" line1="Download on the" line2="App Store" icon={<AppleIcon className="h-5 w-5" />} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:mt-16 text-fluid-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RwandAir. Concept redesign — not an official site.</p>
          <p>Fly the Dream of Africa</p>
        </div>
      </div>
    </footer>
  );
}
