"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { Lang } from "@/lib/i18n";

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const updateLang = (lang: Lang) => {
    document.cookie = `dr_lang=${lang}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-950/60 p-1 text-xs">
      <button
        disabled={pending}
        onClick={() => updateLang("en")}
        className={`rounded-lg px-2 py-1 transition ${currentLang === "en" ? "bg-sky-500/30 text-white" : "text-slate-300"}`}
      >
        EN
      </button>
      <button
        disabled={pending}
        onClick={() => updateLang("ar")}
        className={`rounded-lg px-2 py-1 transition ${currentLang === "ar" ? "bg-purple-500/30 text-white" : "text-slate-300"}`}
      >
        AR
      </button>
    </div>
  );
}
