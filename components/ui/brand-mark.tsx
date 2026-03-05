import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-sky-400 text-sm font-extrabold text-white shadow-[0_0_18px_rgba(56,189,248,0.35)] transition-transform duration-200 group-hover:scale-105",
        )}
      >
        DR
      </span>
      {!compact ? (
        <span className="text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
          Digital<span className="neon-text">Recharge.tn</span>
        </span>
      ) : null}
    </Link>
  );
}
