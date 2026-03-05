import type { Product } from "@/types";

export type CustomProductKind = "gift_card" | "vcc";

export const GIFT_CARD_PROVIDERS = ["Steam", "Apple", "Google Play", "PlayStation", "Riot Games"] as const;
export const GIFT_CARD_AMOUNTS = [10, 20, 30, 50, 100] as const;
export const VCC_AMOUNTS = [5, 10, 20, 50, 100] as const;
export const VCC_PRICING_BY_AMOUNT: Record<number, number> = {
  5: 45,
  10: 45,
  20: 85,
  50: 205,
  100: 405,
};

export type CartCustomizationInput = {
  provider?: string;
  amountUsd?: number;
  customRequest?: string;
};

export function getCustomProductKind(product: Product): CustomProductKind | null {
  const categorySlug = product.categories?.slug?.toLowerCase() ?? "";
  if (categorySlug === "gift-cards") return "gift_card";
  if (product.slug === "vcc-5") return "vcc";
  return null;
}

export function inferBaseAmountUsd(product: Product) {
  const haystacks = [product.name, product.short_description, product.slug];
  for (const text of haystacks) {
    const match = text.match(/\$(\d+)/);
    if (match?.[1]) return Number(match[1]);
  }
  return 10;
}

export function computeConfiguredUnitPriceDt(
  product: Product,
  kind: CustomProductKind | null,
  amountUsd?: number,
) {
  if (kind === "vcc") {
    if (!amountUsd || amountUsd <= 0) return product.price_dt;
    return VCC_PRICING_BY_AMOUNT[amountUsd] ?? product.price_dt;
  }
  if (!amountUsd || amountUsd <= 0) return product.price_dt;
  const baseAmount = inferBaseAmountUsd(product);
  const ratio = product.price_dt / Math.max(baseAmount, 1);
  return Math.max(1, Math.round(amountUsd * ratio));
}

export function sanitizeCustomization(kind: CustomProductKind | null, input?: CartCustomizationInput) {
  if (!kind) {
    return {};
  }

  const amount = Number(input?.amountUsd ?? 0);
  const customRequest = input?.customRequest?.trim().slice(0, 200);

  if (kind === "gift_card") {
    const provider = (input?.provider ?? "").trim();
    const safeProvider = provider.length ? provider : "Steam";
    const safeAmount = GIFT_CARD_AMOUNTS.includes(amount as (typeof GIFT_CARD_AMOUNTS)[number]) ? amount : 10;
    return {
      provider: safeProvider,
      amountUsd: safeAmount,
      customRequest,
    };
  }

  const safeAmount = VCC_AMOUNTS.includes(amount as (typeof VCC_AMOUNTS)[number]) ? amount : 10;
  return {
    amountUsd: safeAmount,
    customRequest,
  };
}

export function buildConfiguredLabel(productName: string, input: CartCustomizationInput) {
  const details: string[] = [];
  if (input.provider) details.push(input.provider);
  if (input.amountUsd) details.push(`$${input.amountUsd}`);
  if (input.customRequest) details.push(`Request: ${input.customRequest}`);
  if (!details.length) return productName;
  return `${productName} (${details.join(" | ")})`;
}

export function makeLineId(productId: number, input: CartCustomizationInput) {
  const provider = (input.provider ?? "").trim().toLowerCase();
  const amount = input.amountUsd ? String(input.amountUsd) : "";
  const request = (input.customRequest ?? "").trim().toLowerCase();
  return `${productId}:${provider}:${amount}:${request}`;
}
