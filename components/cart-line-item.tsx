"use client";

import { useTransition } from "react";

import { removeFromCartAction, updateCartQuantityAction } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";

type Props = {
  lineId: string;
  quantity: number;
};

export function CartLineItemActions({ lineId, quantity }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => startTransition(async () => updateCartQuantityAction(lineId, quantity - 1))}
      >
        -
      </Button>
      <span className="min-w-8 text-center text-sm text-slate-200">{quantity}</span>
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => startTransition(async () => updateCartQuantityAction(lineId, quantity + 1))}
      >
        +
      </Button>
      <Button variant="ghost" disabled={pending} onClick={() => startTransition(async () => removeFromCartAction(lineId))}>
        Remove
      </Button>
    </div>
  );
}
