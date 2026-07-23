import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RwandAir — Fly the Dream of Africa",
  description:
    "RwandAir reimagined: Africa's most premium digital airline experience. Discover destinations, fleet, cabins and DreamMiles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* The hero's LCP: the studio-floor A330 plate. Preloading it means it is
            in flight before the client bundle mounts, so the hero isn't a blank
            floor while the intro plays (worst on repeat visits, where the loader
            is skipped and there's nothing else on screen). */}
        <link
          rel="preload"
          as="image"
          href="/assets/aircraft/side-view-floor-clean.jpg"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
