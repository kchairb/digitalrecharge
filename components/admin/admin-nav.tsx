"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Users,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderKanban },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-3 space-y-1.5 text-sm text-slate-300">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
              active
                ? "border border-sky-400/40 bg-sky-500/15 text-white shadow-[0_0_16px_rgba(56,189,248,.18)]"
                : "hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
