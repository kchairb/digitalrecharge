"use client";

import { useMemo, useState, useTransition } from "react";

import { createPackAction, deletePackAction, updatePackAction } from "@/lib/actions/admin";
import { Lang, t } from "@/lib/i18n";
import { toSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Category, Product } from "@/types";

type PackRow = Product & { includedProductIds: number[] };

function PackEditor({
  pack,
  products,
  categories,
  lang,
}: {
  pack: PackRow;
  products: Product[];
  categories: Category[];
  lang: Lang;
}) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: pack.name,
    slug: pack.slug,
    category_id: pack.category_id,
    price_dt: pack.price_dt,
    short_description: pack.short_description,
    long_description: pack.long_description,
    delivery_time: pack.delivery_time,
    requirements: pack.requirements,
    refund_policy: pack.refund_policy,
    image_url: pack.image_url ?? "",
    is_featured: pack.is_featured,
    included_product_ids: pack.includedProductIds,
  });

  const toggleIncludedProduct = (id: number) => {
    setForm((prev) => {
      const exists = prev.included_product_ids.includes(id);
      return {
        ...prev,
        included_product_ids: exists
          ? prev.included_product_ids.filter((value) => value !== id)
          : [...prev.included_product_ids, id],
      };
    });
  };

  return (
    <Card className="space-y-3">
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
              slug: toSlug(e.target.value || prev.slug),
            }))
          }
          placeholder={copy.packName}
        />
        <input
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
          placeholder={copy.slug}
        />
        <input
          type="number"
          min={1}
          value={form.price_dt}
          onChange={(e) => setForm((prev) => ({ ...prev, price_dt: Number(e.target.value) }))}
          placeholder={copy.priceDt}
        />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <select
          value={form.category_id}
          onChange={(e) => setForm((prev) => ({ ...prev, category_id: Number(e.target.value) }))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={form.delivery_time}
          onChange={(e) => setForm((prev) => ({ ...prev, delivery_time: e.target.value }))}
          placeholder={copy.deliveryTime}
        />
        <input
          value={form.image_url}
          onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
          placeholder={copy.imageUrl}
        />
      </div>
      <textarea
        value={form.short_description}
        onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
        className="min-h-20"
        placeholder={copy.shortDescription}
      />
      <textarea
        value={form.long_description}
        onChange={(e) => setForm((prev) => ({ ...prev, long_description: e.target.value }))}
        className="min-h-20"
        placeholder={copy.longDescriptionMarkdown}
      />
      <textarea
        value={form.requirements}
        onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
        className="min-h-16"
        placeholder={copy.requirementsMarkdown}
      />
      <textarea
        value={form.refund_policy}
        onChange={(e) => setForm((prev) => ({ ...prev, refund_policy: e.target.value }))}
        className="min-h-16"
        placeholder={copy.refundPolicyMarkdown}
      />
      <div className="rounded-xl border border-slate-700 p-3">
        <p className="mb-2 text-sm text-slate-300">{copy.includedProducts}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <label
              key={product.id}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-sm"
            >
              <input
                type="checkbox"
                checked={form.included_product_ids.includes(product.id)}
                onChange={() => toggleIncludedProduct(product.id)}
              />
              <span>{product.name}</span>
            </label>
          ))}
        </div>
      </div>
      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
        />
        {copy.featured}
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updatePackAction(pack.id, form);
              setMessage(result.ok ? copy.saved : result.error ?? copy.failed);
            })
          }
        >
          {copy.updatePack}
        </Button>
        <Button
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deletePackAction(pack.id);
              setMessage(result.ok ? copy.deleted : result.error ?? copy.failed);
            })
          }
        >
          {copy.delete}
        </Button>
      </div>
      <p className="text-xs text-slate-400">{message}</p>
    </Card>
  );
}

export function PackManager({
  initialPacks,
  products,
  categories,
  lang,
}: {
  initialPacks: PackRow[];
  products: Product[];
  categories: Category[];
  lang: Lang;
}) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [createMsg, setCreateMsg] = useState("");

  const defaultCategoryId = categories[0]?.id ?? 1;
  const defaultImage = products[0]?.image_url ?? "";
  const [newForm, setNewForm] = useState({
    name: "",
    slug: "",
    category_id: defaultCategoryId,
    price_dt: 60,
    short_description: "",
    long_description: "",
    delivery_time: "Instant / 5-20 min",
    requirements: "Share your contact details to complete activation.",
    refund_policy: "Refund applies only if delivery fails.",
    image_url: defaultImage,
    is_featured: true,
    included_product_ids: [] as number[],
  });

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const toggleCreateIncludedProduct = (id: number) => {
    setNewForm((prev) => {
      const exists = prev.included_product_ids.includes(id);
      return {
        ...prev,
        included_product_ids: exists
          ? prev.included_product_ids.filter((value) => value !== id)
          : [...prev.included_product_ids, id],
      };
    });
  };

  const suggestedDescription = newForm.included_product_ids
    .map((id) => productsById.get(id)?.name)
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-white">{copy.addPack}</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={newForm.name}
            onChange={(e) =>
              setNewForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: toSlug(e.target.value || prev.slug),
              }))
            }
            placeholder={copy.packName}
          />
          <input
            value={newForm.slug}
            onChange={(e) => setNewForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
            placeholder={copy.slug}
          />
          <input
            type="number"
            min={1}
            value={newForm.price_dt}
            onChange={(e) => setNewForm((prev) => ({ ...prev, price_dt: Number(e.target.value) }))}
            placeholder={copy.priceDt}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <select
            value={newForm.category_id}
            onChange={(e) => setNewForm((prev) => ({ ...prev, category_id: Number(e.target.value) }))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={newForm.delivery_time}
            onChange={(e) => setNewForm((prev) => ({ ...prev, delivery_time: e.target.value }))}
            placeholder={copy.deliveryTime}
          />
          <input
            value={newForm.image_url}
            onChange={(e) => setNewForm((prev) => ({ ...prev, image_url: e.target.value }))}
            placeholder={copy.imageUrl}
          />
        </div>
        <textarea
          value={newForm.short_description || suggestedDescription}
          onChange={(e) => setNewForm((prev) => ({ ...prev, short_description: e.target.value }))}
          className="min-h-20"
          placeholder={copy.shortDescription}
        />
        <textarea
          value={newForm.long_description}
          onChange={(e) => setNewForm((prev) => ({ ...prev, long_description: e.target.value }))}
          className="min-h-20"
          placeholder={copy.longDescriptionMarkdown}
        />
        <div className="rounded-xl border border-slate-700 p-3">
          <p className="mb-2 text-sm text-slate-300">{copy.includedProducts}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <label
                key={product.id}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-2 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={newForm.included_product_ids.includes(product.id)}
                  onChange={() => toggleCreateIncludedProduct(product.id)}
                />
                <span>{product.name}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={newForm.is_featured}
            onChange={(e) => setNewForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
          />
          {copy.featured}
        </label>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await createPackAction(newForm);
              setCreateMsg(result.ok ? copy.createdMsg : result.error ?? copy.failed);
              if (result.ok) {
                setNewForm((prev) => ({
                  ...prev,
                  name: "",
                  slug: "",
                  short_description: "",
                  long_description: "",
                  included_product_ids: [],
                }));
              }
            })
          }
        >
          {copy.addPack}
        </Button>
        <p className="text-xs text-slate-400">{createMsg}</p>
      </Card>

      <div className="space-y-3">
        {initialPacks.length === 0 ? <Card>{copy.noPacksYet}</Card> : null}
        {initialPacks.map((pack) => (
          <PackEditor key={pack.id} pack={pack} products={products} categories={categories} lang={lang} />
        ))}
      </div>
    </div>
  );
}
