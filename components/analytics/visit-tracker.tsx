"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "dr_visitor_id";

function getVisitorId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const created = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(VISITOR_KEY, created);
  return created;
}

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const visitorId = getVisitorId();
    if (!visitorId) return;

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, path: pathname }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
