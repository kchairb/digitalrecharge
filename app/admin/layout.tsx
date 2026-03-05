import type { ReactNode } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="space-y-5">
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Admin Workspace</p>
          <p className="mt-1 text-xs text-slate-400">
            Manage products, categories, orders, and customer trust signals.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-sky-400/50 hover:text-white"
        >
          <Shield className="h-4 w-4 text-sky-300" />
          Back to storefront
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass-card h-fit p-4 lg:sticky lg:top-24">
          <p className="text-sm font-semibold tracking-wide text-white">Admin Panel</p>
          <AdminNav />
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
