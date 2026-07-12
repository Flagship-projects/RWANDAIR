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
        <div className="mb-14 lg:mb-16">
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

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_340px] lg:gap-x-12">
          {/* three balanced link columns, each stacking its sections top-aligned */}
          {footerColumnGroups.map((group, i) => (
            <div key={i} className="space-y-10">
              {group.map((col) => (
                <div key={col.title}>
                  <p className="text-fluid-xs font-semibold uppercase tracking-wideish text-ink">{col.title}</p>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a
                          href={l === "Cargo" ? "/cargo" : "#"}
                          className="focus-ring text-fluid-sm text-ink/55 transition-colors hover:text-blue-500"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {/* connect rail — same top edge as the link columns */}
          <div className="flex flex-col gap-10">
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

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-fluid-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RwandAir. Concept redesign — not an official site.</p>
          <p>Fly the Dream of Africa</p>
        </div>
      </div>
    </footer>
  );
}
