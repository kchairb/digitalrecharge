"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCategoryAction } from "@/lib/actions/admin";
import { categorySchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Values = z.input<typeof categorySchema>;

export function CategoryForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(categorySchema),
  });

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">New Category</h2>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-4"
        onSubmit={handleSubmit((values) =>
          startTransition(async () => {
            setError("");
            const result = await createCategoryAction(values);
            if (!result.ok) {
              setError(result.error ?? "Create failed");
              return;
            }
            reset();
            router.refresh();
          }),
        )}
      >
        <input className="" placeholder="Name" {...register("name")} />
        <input className="" placeholder="slug" {...register("slug")} />
        <input className="" placeholder="Image URL" {...register("image_url")} />
        <Button type="submit" disabled={pending}>
          Add
        </Button>
      </form>
      <p className="mt-2 text-xs text-rose-300">
        {error ||
          formState.errors.name?.message ||
          formState.errors.slug?.message ||
          formState.errors.image_url?.message}
      </p>
    </Card>
  );
}
