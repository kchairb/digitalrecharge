"use client";

import { useEffect, useMemo, useState } from "react";

import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const names = ["محمد", "آمنة", "سفيان", "مروى", "أحمد", "ريم", "هيثم", "ياسمين", "كريم"];
const products = ["ChatGPT Plus", "Netflix", "Spotify Premium", "Canva Pro", "Gift Card $10", "VCC $20"];
const places = ["تونس", "صفاقس", "سوسة", "بنزرت", "المنستير"];

export function LivePurchaseToast({ lang }: { lang: Lang }) {
  const copy = t(lang);
  const [index, setIndex] = useState(0);
  const list = useMemo(
    () =>
      names.map((name, i) => ({
        name,
        product: products[i % products.length],
        place: places[i % places.length],
      })),
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [list.length]);

  const item = list[index];

  return (
    <div className="pointer-events-none fixed left-3 bottom-20 z-40 sm:left-4 sm:bottom-24">
      <div className="glass-card pointer-events-auto reveal-up max-w-[280px] px-3 py-2 text-sm shadow-[0_0_26px_rgba(56,189,248,0.2)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{copy.livePurchases}</p>
        <p className="mt-1 text-slate-100">
          <span className="font-semibold text-sky-200">{item.name}</span> {copy.justPurchased}{" "}
          <span className="font-semibold text-purple-200">{item.product}</span>
        </p>
        <p className="text-xs text-slate-400">{item.place}</p>
      </div>
    </div>
  );
}
