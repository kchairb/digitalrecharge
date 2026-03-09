"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Button } from "@/components/ui/button";
import {
  GIFT_CARD_AMOUNTS,
  GIFT_CARD_PROVIDERS,
  PERPLEXITY_PERIODS,
  VCC_AMOUNTS,
  VCC_PRICING_BY_AMOUNT,
  buildConfiguredLabel,
  computeConfiguredUnitPriceDt,
  getCustomProductKind,
  getGamingTopupConfig,
} from "@/lib/product-customization";
import { type Lang, t } from "@/lib/i18n";
import { formatDt, whatsappProductOrderMessage, whatsappUrl } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductConfigPanel({ product, lang }: { product: Product; lang: Lang }) {
  const copy = t(lang);
  const kind = getCustomProductKind(product);
  const gamingConfig = getGamingTopupConfig(product);
  const [provider, setProvider] = useState<string>(GIFT_CARD_PROVIDERS[0]);
  const [amountUsd, setAmountUsd] = useState<number>(() => {
    if (kind === "vcc") return VCC_AMOUNTS[0];
    if (kind === "gaming_topup" && gamingConfig?.options.length) return gamingConfig.options[0].amount;
    return GIFT_CARD_AMOUNTS[0];
  });
  const [planPeriod, setPlanPeriod] = useState<"1_month" | "1_year">("1_month");
  const [customRequest, setCustomRequest] = useState("");

  const customization = useMemo(
    () => ({
      provider: kind === "gift_card" ? provider : undefined,
      amountUsd: kind === "perplexity_pro" ? undefined : amountUsd,
      planPeriod: kind === "perplexity_pro" ? planPeriod : undefined,
      customRequest: customRequest.trim() || undefined,
    }),
    [amountUsd, customRequest, kind, planPeriod, provider],
  );
  const previewPrice = useMemo(
    () => computeConfiguredUnitPriceDt(product, kind, amountUsd, planPeriod),
    [amountUsd, kind, planPeriod, product],
  );

  if (!kind) {
    return (
      <div className="mt-5 space-y-2">
        <AddToCartButton productId={product.id} label={copy.buyNow} />
        <Link
          target="_blank"
          href={whatsappUrl(whatsappProductOrderMessage(product.name))}
        >
          <Button variant="secondary" className="w-full">
            {copy.orderWhatsapp}
          </Button>
        </Link>
        <Link href="/cart">
          <Button variant="ghost" className="w-full">
            {copy.goToCart}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
        <p className="text-sm font-semibold text-slate-100">
          {kind === "gift_card"
            ? copy.giftCardOptions
            : kind === "vcc"
              ? copy.virtualCardOptions
              : kind === "perplexity_pro"
                ? copy.perplexityOptions
                : copy.gamingTopupOptions}
        </p>
        {kind === "vcc" || kind === "perplexity_pro" || kind === "gaming_topup" ? (
          <p className="mt-2 text-sm text-sky-200">
            {copy.selectedPrice}: <span className="font-semibold">{formatDt(previewPrice)}</span>
          </p>
        ) : null}
        <div className="mt-3 grid gap-3">
          {kind === "gift_card" ? (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-300">{copy.provider}</span>
              <select value={provider} onChange={(e) => setProvider(e.target.value)}>
                {GIFT_CARD_PROVIDERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {kind === "perplexity_pro" ? (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-300">{copy.subscriptionPeriod}</span>
              <select
                value={planPeriod}
                onChange={(e) => setPlanPeriod(e.target.value as "1_month" | "1_year")}
              >
                {PERPLEXITY_PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period === "1_month" ? copy.oneMonth : copy.oneYear} -{" "}
                    {formatDt(computeConfiguredUnitPriceDt(product, kind, undefined, period))}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="mb-1 block text-xs text-slate-300">
                {kind === "gaming_topup" ? copy.topupAmount : copy.amountUsd}
              </span>
              <select value={amountUsd} onChange={(e) => setAmountUsd(Number(e.target.value))}>
                {kind === "gift_card"
                  ? GIFT_CARD_AMOUNTS.map((amount) => (
                      <option key={amount} value={amount}>
                        {`$${amount}`}
                      </option>
                    ))
                  : kind === "gaming_topup" && gamingConfig
                    ? gamingConfig.options.map((opt) => (
                        <option key={opt.amount} value={opt.amount}>
                          {`${opt.amount} ${gamingConfig.unit} - ${formatDt(opt.priceDt)}`}
                        </option>
                      ))
                    : VCC_AMOUNTS.map((amount) => (
                        <option key={amount} value={amount}>
                          {`$${amount} - ${formatDt(VCC_PRICING_BY_AMOUNT[amount] ?? product.price_dt)}`}
                        </option>
                      ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs text-slate-300">
              {kind === "gift_card"
                ? copy.needAnotherGiftCard
                : kind === "vcc"
                  ? copy.needAnotherVcc
                  : kind === "perplexity_pro"
                    ? copy.needAnotherPerplexity
                    : copy.needAnotherTopup}
            </span>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder={copy.customRequestPlaceholder}
              className="min-h-24"
            />
          </label>
        </div>
      </div>

      <AddToCartButton productId={product.id} label={copy.addConfiguredOrder} customization={customization} />
      <Link
        target="_blank"
        href={whatsappUrl(whatsappProductOrderMessage(buildConfiguredLabel(product.name, customization)))}
      >
        <Button variant="secondary" className="w-full">
          {copy.orderWhatsapp}
        </Button>
      </Link>
      <Link href="/cart">
        <Button variant="ghost" className="w-full">
          {copy.goToCart}
        </Button>
      </Link>
    </div>
  );
}
