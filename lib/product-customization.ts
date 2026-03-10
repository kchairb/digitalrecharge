import type { Product } from "@/types";

export type CustomProductKind = "gift_card" | "vcc" | "perplexity_pro" | "gaming_topup";

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
export const PERPLEXITY_PERIODS = ["1_month", "1_year"] as const;

type GamingOption = { amount: number; priceDt: number };

type GamingConfig = {
  unit: string;
  options: GamingOption[];
};

const GAMING_TOPUP_CONFIG: Record<string, GamingConfig> = {
  fortnite: {
    unit: "V-Bucks",
    options: [
      { amount: 1000, priceDt: 59 },
      { amount: 2800, priceDt: 99 },
      { amount: 5000, priceDt: 159 },
      { amount: 13500, priceDt: 359 },
    ],
  },
  roblox: {
    unit: "Robux",
    options: [
      { amount: 400, priceDt: 22 },
      { amount: 800, priceDt: 39 },
      { amount: 1700, priceDt: 75 },
      { amount: 4500, priceDt: 175 },
      { amount: 10000, priceDt: 365 },
    ],
  },
  pubg: {
    unit: "UC",
    options: [
      { amount: 60, priceDt: 6 },
      { amount: 325, priceDt: 28 },
      { amount: 660, priceDt: 49 },
      { amount: 1800, priceDt: 115 },
      { amount: 3850, priceDt: 225 },
      { amount: 8100, priceDt: 435 },
    ],
  },
  freefire: {
    unit: "Diamonds",
    options: [
      { amount: 100, priceDt: 6 },
      { amount: 310, priceDt: 16 },
      { amount: 520, priceDt: 25 },
      { amount: 1060, priceDt: 49 },
      { amount: 2180, priceDt: 95 },
    ],
  },
  valorant: {
    unit: "VP",
    options: [
      { amount: 475, priceDt: 19 },
      { amount: 1000, priceDt: 36 },
      { amount: 2050, priceDt: 69 },
      { amount: 3650, priceDt: 110 },
      { amount: 5350, priceDt: 159 },
    ],
  },
};

function getGamingKey(product: Product): keyof typeof GAMING_TOPUP_CONFIG | null {
  const slug = product.slug.toLowerCase();
  if (slug.includes("fortnite-vbucks")) return "fortnite";
  if (slug.includes("roblox-robux")) return "roblox";
  if (slug.includes("pubg-uc")) return "pubg";
  if (slug.includes("freefire-diamonds")) return "freefire";
  if (slug.includes("valorant-points")) return "valorant";
  return null;
}

export function getGamingTopupConfig(
  product: Product,
): (GamingConfig & { key: keyof typeof GAMING_TOPUP_CONFIG }) | null {
  const key = getGamingKey(product);
  if (!key) return null;
  return { ...GAMING_TOPUP_CONFIG[key], key };
}

export type CartCustomizationInput = {
  provider?: string;
  amountUsd?: number;
  planPeriod?: "1_month" | "1_year";
  customRequest?: string;
};

export function getCustomProductKind(product: Product): CustomProductKind | null {
  const categorySlug = product.categories?.slug?.toLowerCase() ?? "";
  if (categorySlug === "gift-cards") return "gift_card";
  if (product.slug === "vcc-5") return "vcc";
  if (product.slug === "perplexity-pro") return "perplexity_pro";
   if (categorySlug === "gaming-top-ups" && getGamingKey(product)) return "gaming_topup";
  return null;
}

export function isMonthlyPricedProduct(product: Product) {
  const categorySlug = product.categories?.slug?.toLowerCase() ?? "";
  return ![
    "gift-cards",
    "virtual-cards",
    "gaming-top-ups",
    "gaming-gift-cards",
    "app-store-cards",
  ].includes(categorySlug);
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
  planPeriod?: "1_month" | "1_year",
) {
  if (kind === "gaming_topup") {
    const cfg = getGamingTopupConfig(product);
    if (!cfg || !cfg.options.length) return product.price_dt;
    const requested = amountUsd && amountUsd > 0 ? amountUsd : cfg.options[0].amount;
    const match = cfg.options.find((opt) => opt.amount === requested) ?? cfg.options[0];
    return match.priceDt;
  }
  if (kind === "perplexity_pro") {
    if (planPeriod === "1_year") return product.price_dt * 10;
    return product.price_dt;
  }
  if (kind === "vcc") {
    if (!amountUsd || amountUsd <= 0) return product.price_dt;
    return VCC_PRICING_BY_AMOUNT[amountUsd] ?? product.price_dt;
  }
  if (!amountUsd || amountUsd <= 0) return product.price_dt;
  const baseAmount = inferBaseAmountUsd(product);
  const ratio = product.price_dt / Math.max(baseAmount, 1);
  return Math.max(1, Math.round(amountUsd * ratio));
}

export function sanitizeCustomization(
  product: Product | null,
  kind: CustomProductKind | null,
  input?: CartCustomizationInput,
) {
  if (!kind) {
    return {};
  }

  const amount = Number(input?.amountUsd ?? 0);
  const planPeriod = input?.planPeriod;
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

  if (kind === "perplexity_pro") {
    const safePlanPeriod =
      planPeriod && PERPLEXITY_PERIODS.includes(planPeriod) ? planPeriod : "1_month";
    return {
      planPeriod: safePlanPeriod,
      customRequest,
    };
  }

  if (kind === "gaming_topup" && product) {
    const cfg = getGamingTopupConfig(product);
    const allowed = cfg?.options.map((o) => o.amount) ?? [];
    const safeAmount = allowed.includes(amount) ? amount : allowed[0];
    return {
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
  if (input.amountUsd) {
    const lower = productName.toLowerCase();
    const gamingUnit = lower.includes("v-bucks")
      ? "V-Bucks"
      : lower.includes("robux")
        ? "Robux"
        : lower.includes("pubg") || lower.includes(" uc")
          ? "UC"
          : lower.includes("free fire") || lower.includes("diamonds")
            ? "Diamonds"
            : lower.includes("valorant") || lower.includes(" vp")
              ? "VP"
              : null;
    details.push(gamingUnit ? `${input.amountUsd} ${gamingUnit}` : `$${input.amountUsd}`);
  }
  if (input.planPeriod) details.push(input.planPeriod === "1_year" ? "1 year" : "1 month");
  if (input.customRequest) details.push(`Request: ${input.customRequest}`);
  if (!details.length) return productName;
  return `${productName} (${details.join(" | ")})`;
}

export function makeLineId(productId: number, input: CartCustomizationInput) {
  const provider = (input.provider ?? "").trim().toLowerCase();
  const amount = input.amountUsd ? String(input.amountUsd) : "";
  const planPeriod = input.planPeriod ?? "";
  const request = (input.customRequest ?? "").trim().toLowerCase();
  return `${productId}:${provider}:${amount}:${planPeriod}:${request}`;
}
