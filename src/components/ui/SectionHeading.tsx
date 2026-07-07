import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="reveal-item mb-4 text-fluid-xs uppercase tracking-wideish text-blue-500">
          {eyebrow}
        </p>
      )}
      <h2 className="reveal-item text-fluid-h2 font-display font-light leading-[1.02] tracking-tightest text-balance text-ink">
        {title}
      </h2>
      {description && (
        <p className="reveal-item mt-6 text-fluid-body text-ink/60 max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
