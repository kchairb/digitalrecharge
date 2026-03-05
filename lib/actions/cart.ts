"use server";

import { revalidatePath } from "next/cache";

import { getCart, setCart } from "@/lib/cart";
import {
  type CartCustomizationInput,
  computeConfiguredUnitPriceDt,
  getCustomProductKind,
  makeLineId,
  sanitizeCustomization,
} from "@/lib/product-customization";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/types";

export async function addToCartAction(productId: number, quantity = 1, customization?: CartCustomizationInput) {
  const cart = await getCart();
  const supabase = getSupabaseAdmin();
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", productId)
    .single();
  const safeProduct = product as Product | null;
  if (!safeProduct) {
    return { ok: false, error: "Product not found." };
  }

  const kind = getCustomProductKind(safeProduct);
  const safeCustomization = sanitizeCustomization(kind, customization);
  const lineId = makeLineId(productId, safeCustomization);
  const unitPriceDt = computeConfiguredUnitPriceDt(
    safeProduct,
    kind,
    safeCustomization.amountUsd,
    safeCustomization.planPeriod,
  );
  const existing = cart.find((item) => item.lineId === lineId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      lineId,
      productId,
      quantity,
      unitPriceDt,
      provider: safeCustomization.provider,
      amountUsd: safeCustomization.amountUsd,
      planPeriod: safeCustomization.planPeriod,
      customRequest: safeCustomization.customRequest,
    });
  }

  await setCart(cart);
  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { ok: true };
}

export async function updateCartQuantityAction(lineId: string, quantity: number) {
  let cart = await getCart();
  cart = cart.map((item) => (item.lineId === lineId ? { ...item, quantity } : item));
  cart = cart.filter((item) => item.quantity > 0);
  await setCart(cart);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeFromCartAction(lineId: string) {
  const cart = await getCart();
  await setCart(cart.filter((item) => item.lineId !== lineId));
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
