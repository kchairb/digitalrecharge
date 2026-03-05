"use client";

import { useState, useTransition } from "react";

import { addToCartAction } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  className,
  label = "Add to cart",
}: {
  productId: number;
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          setDone(false);
          await addToCartAction(productId, 1);
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        })
      }
      disabled={pending}
      className={cn("w-full", className)}
    >
      {pending ? "Adding..." : done ? "Added" : label}
    </Button>
  );
}
