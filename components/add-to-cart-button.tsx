"use client";

import { useState, useTransition } from "react";

import { addToCartAction } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartCustomizationInput } from "@/lib/product-customization";

export function AddToCartButton({
  productId,
  className,
  label = "Add to cart",
  customization,
}: {
  productId: number;
  className?: string;
  label?: string;
  customization?: CartCustomizationInput;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="space-y-1">
      <Button
        onClick={() =>
          startTransition(async () => {
            setDone(false);
            setError("");
            const result = await addToCartAction(productId, 1, customization);
            if (!result.ok) {
              setError(result.error ?? "Failed");
              return;
            }
            setDone(true);
            setTimeout(() => setDone(false), 1400);
          })
        }
        disabled={pending}
        className={cn("w-full", className)}
      >
        {pending ? "Adding..." : done ? "Added" : label}
      </Button>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
