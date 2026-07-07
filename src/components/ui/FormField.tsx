import { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldWrap = "flex flex-col gap-1.5 border-r border-line px-5 py-3 last:border-r-0 sm:px-6";
const labelCls = "text-fluid-xs uppercase tracking-wideish text-ink/45";
const controlCls = "bg-transparent text-fluid-body font-display text-ink focus:outline-none";

export function SelectField({
  label,
  children,
  className,
  ...rest
}: { label: string; children: ReactNode; className?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn(fieldWrap, className)}>
      <span className={labelCls}>{label}</span>
      <select className={cn(controlCls, "focus-ring appearance-none")} {...rest}>
        {children}
      </select>
    </label>
  );
}

export function InputField({
  label,
  className,
  ...rest
}: { label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn(fieldWrap, className)}>
      <span className={labelCls}>{label}</span>
      <input className={cn(controlCls, "focus-ring")} {...rest} />
    </label>
  );
}
