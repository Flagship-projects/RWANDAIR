"use client";

import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMagnetic } from "@/lib/motion";

type Variant = "primary" | "ghost" | "outline";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-sans text-fluid-sm font-medium tracking-tight transition-colors duration-300 ease-premium focus-ring whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-blue-500 text-white px-7 py-3.5 hover:bg-blue-600",
  ghost: "text-ink px-2 py-2 hover:text-blue-500",
  outline: "border border-line-strong text-ink px-7 py-3.5 hover:border-blue-500 hover:text-blue-500",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  magnetic?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", children, magnetic = true, className, ...rest } = props;
  const ref = useMagnetic<HTMLAnchorElement | HTMLButtonElement>(0.25);

  const cls = cn(base, variants[variant], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={magnetic ? (ref as any) : undefined}
        href={href}
        className={cls}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={magnetic ? (ref as any) : undefined}
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
