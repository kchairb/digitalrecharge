"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProductAction, updateProductAction } from "@/lib/actions/admin";
import { productSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Category, Product } from "@/types";

type Values = z.input<typeof productSchema>;

type Props = {
  categories: Category[];
  initial?: Product;
};

export function ProductForm({ categories, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? {
          ...initial,
          image_url: initial.image_url ?? "",
        }
      : {
          is_featured: false,
        },
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      setError("");
      const result = initial
        ? await updateProductAction(initial.id, values)
        : await createProductAction(values);

      if (!result.ok) {
        setError(result.error ?? "Save failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    }),
  );

  return (
    <Card>
      <h1 className="text-2xl font-bold text-white">{initial ? "Edit Product" : "New Product"}</h1>
      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <input className="" placeholder="Name" {...register("name")} />
        <input className="" placeholder="Slug" {...register("slug")} />
        <select className="" {...register("category_id", { valueAsNumber: true })}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input className="" type="number" placeholder="Price DT" {...register("price_dt", { valueAsNumber: true })} />
        <input className="md:col-span-2" placeholder="Short description" {...register("short_description")} />
        <textarea className="min-h-28 md:col-span-2" placeholder="Long description (markdown)" {...register("long_description")} />
        <input className="" placeholder="Delivery time" {...register("delivery_time")} />
        <input className="" placeholder="Image URL" {...register("image_url")} />
        <textarea className="min-h-24" placeholder="Requirements (markdown)" {...register("requirements")} />
        <textarea className="min-h-24" placeholder="Refund policy (markdown)" {...register("refund_policy")} />
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" {...register("is_featured")} />
          Featured
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save product"}
        </Button>
      </form>
      <p className="mt-3 text-xs text-rose-300">
        {error || Object.values(formState.errors)[0]?.message?.toString()}
      </p>
    </Card>
  );
}
