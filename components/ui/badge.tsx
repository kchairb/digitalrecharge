import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
