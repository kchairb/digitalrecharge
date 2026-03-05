"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CheckCircle2, ShoppingCart } from "lucide-react";

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
      {done ? (
        <div className="reveal-up rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2 py-2 text-xs text-emerald-200">
          <p className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Added to cart successfully.
          </p>
          <Link href="/cart" className="mt-1 inline-flex items-center gap-1 text-sky-200 hover:text-sky-100">
            <ShoppingCart className="h-3.5 w-3.5" />
            Go to cart
          </Link>
        </div>
      ) : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
