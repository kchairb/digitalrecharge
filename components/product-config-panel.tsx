"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Button } from "@/components/ui/button";
import {
  GIFT_CARD_AMOUNTS,
  GIFT_CARD_PROVIDERS,
  VCC_AMOUNTS,
  buildConfiguredLabel,
  getCustomProductKind,
} from "@/lib/product-customization";
import { formatDt, whatsappUrl } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductConfigPanel({ product }: { product: Product }) {
  const kind = getCustomProductKind(product);
  const [provider, setProvider] = useState<string>(GIFT_CARD_PROVIDERS[0]);
  const [amountUsd, setAmountUsd] = useState<number>(kind === "vcc" ? VCC_AMOUNTS[0] : GIFT_CARD_AMOUNTS[0]);
  const [customRequest, setCustomRequest] = useState("");

  const customization = useMemo(
    () => ({
      provider: kind === "gift_card" ? provider : undefined,
      amountUsd,
      customRequest: customRequest.trim() || undefined,
    }),
    [amountUsd, customRequest, kind, provider],
  );

  if (!kind) {
    return (
      <div className="mt-5 space-y-2">
        <AddToCartButton productId={product.id} label="Buy now" />
        <Link
          target="_blank"
          href={whatsappUrl(`Hello, I want to order ${product.name} (${formatDt(product.price_dt)}).`)}
        >
          <Button variant="secondary" className="w-full">
            Order via WhatsApp
          </Button>
        </Link>
        <Link href="/cart">
          <Button variant="ghost" className="w-full">
            Go to cart
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
        <p className="text-sm font-semibold text-slate-100">
          {kind === "gift_card" ? "Gift card options" : "Virtual card options"}
        </p>
        <div className="mt-3 grid gap-3">
          {kind === "gift_card" ? (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-300">Provider</span>
              <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                {GIFT_CARD_PROVIDERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-xs text-slate-300">Amount (USD)</span>
            <select value={amountUsd} onChange={(e) => setAmountUsd(Number(e.target.value))}>
              {(kind === "gift_card" ? GIFT_CARD_AMOUNTS : VCC_AMOUNTS).map((amount) => (
                <option key={amount} value={amount}>
                  ${amount}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-300">
              Need another {kind === "gift_card" ? "gift card" : "VCC"}? Tell us here
            </span>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Example: Xbox gift card $25"
              className="min-h-24"
            />
          </label>
        </div>
      </div>

      <AddToCartButton productId={product.id} label="Add configured order" customization={customization} />
      <Link
        target="_blank"
        href={whatsappUrl(
          `Hello, I want to order ${buildConfiguredLabel(product.name, customization)} (${formatDt(product.price_dt)} base).`,
        )}
      >
        <Button variant="secondary" className="w-full">
          Order via WhatsApp
        </Button>
      </Link>
      <Link href="/cart">
        <Button variant="ghost" className="w-full">
          Go to cart
        </Button>
      </Link>
    </div>
  );
}
