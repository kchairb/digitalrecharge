"use client";

import { useState, useTransition } from "react";

import { deleteCategoryAction, updateCategoryAction } from "@/lib/actions/admin";
import { Lang, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

export function CategoryRow({ category, lang }: { category: Category; lang: Lang }) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [imageUrl, setImageUrl] = useState(category.image_url ?? "");
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-2 rounded-xl border border-slate-700 bg-slate-950/40 p-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
      <input value={name} onChange={(e) => setName(e.target.value)} className="" />
      <input value={slug} onChange={(e) => setSlug(e.target.value)} className="" />
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="" placeholder={copy.imageUrl} />
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await updateCategoryAction(category.id, { name, slug, image_url: imageUrl });
            setMessage(result.ok ? copy.saved : result.error ?? copy.failed);
          })
        }
      >
        {copy.save}
      </Button>
      <Button
        variant="ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await deleteCategoryAction(category.id);
            setMessage(result.ok ? copy.deleted : result.error ?? copy.deleteFailed);
          })
        }
      >
        {copy.delete}
      </Button>
      <p className="text-xs text-slate-400 md:col-span-4">{message}</p>
    </div>
  );
}
