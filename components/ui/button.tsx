import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220] disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary:
      "bg-gradient-to-r from-purple-500 via-violet-500 to-sky-400 text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(56,189,248,0.45)]",
    secondary:
      "border border-slate-600 bg-slate-900/70 text-slate-100 hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-slate-900",
    ghost: "text-slate-300 hover:bg-slate-800/70 hover:text-white",
  };

  return <button className={cn(base, styles[variant], className)} {...props} />;
}
