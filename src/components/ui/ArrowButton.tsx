"use client";

import { cn } from "@/lib/cn";
import { useMagnetic } from "@/lib/motion";

/**
 * A distinctive editorial CTA: a magnetic pill with a colour-sweep on hover and
 * a circular arrow disc that rotates. Used for the "explore more" journeys.
 */
export function ArrowButton({
  href,
  children,
  className,
  tone = "solid",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** solid = blue on light bg · light = white on dark/photo bg */
  tone?: "solid" | "light";
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-5 overflow-hidden rounded-full py-2.5 pl-8 pr-2.5 focus-ring",
        tone === "solid"
          ? "bg-blue-500 text-white"
          : "border border-white/40 bg-white/5 text-white backdrop-blur-sm",
        className
      )}
    >
      {/* hover fill sweep */}
      <span
        className={cn(
          "absolute inset-0 -z-0 origin-bottom translate-y-full transition-transform duration-500 ease-premium group-hover:translate-y-0",
          tone === "solid" ? "bg-blue-700" : "bg-white"
        )}
      />
      <span
        className={cn(
          "relative z-10 text-fluid-xs font-medium uppercase tracking-wideish transition-colors duration-500",
          tone === "light" && "group-hover:text-blue-700"
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 ease-premium group-hover:rotate-[360deg]",
          tone === "solid" ? "bg-white text-blue-600" : "bg-white text-blue-700"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}
