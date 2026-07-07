import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-fluid-xs uppercase tracking-wideish text-ink/60",
        className
      )}
    >
      {children}
    </span>
  );
}
