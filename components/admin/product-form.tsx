"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createProductAction,
  updateProductAction,
  uploadProductImageAction,
} from "@/lib/actions/admin";
import { shouldUseUnoptimizedImage } from "@/lib/utils";
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
  const [uploading, startUploadTransition] = useTransition();
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { register, handleSubmit, formState, setValue, watch } = useForm<Values>({
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
  const imageUrl = watch("image_url");

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
        <div className="rounded-xl border border-slate-700 bg-slate-950/30 p-3 md:col-span-2">
          <p className="text-sm font-medium text-slate-200">Upload image</p>
          <p className="mt-1 text-xs text-slate-500">Upload a product image and it will auto-fill Image URL.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              className="max-w-sm"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() =>
                startUploadTransition(async () => {
                  if (!uploadFile) {
                    setUploadMessage("Select an image first.");
                    return;
                  }
                  const result = await uploadProductImageAction(uploadFile);
                  if (!result.ok || !result.url) {
                    setUploadMessage(result.error ?? "Upload failed.");
                    return;
                  }
                  setValue("image_url", result.url, { shouldValidate: true, shouldDirty: true });
                  setUploadMessage("Uploaded and linked successfully.");
                })
              }
            >
              {uploading ? "Uploading..." : "Upload image"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-400">{uploadMessage}</p>
        </div>
        {imageUrl ? (
          <div className="relative h-48 overflow-hidden rounded-xl border border-slate-700 md:col-span-2">
            <Image
              src={String(imageUrl)}
              alt="Product preview"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              unoptimized={shouldUseUnoptimizedImage(String(imageUrl))}
              className="object-cover"
            />
          </div>
        ) : null}
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
