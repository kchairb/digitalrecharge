"use server";

import { revalidatePath } from "next/cache";

import { getCart, setCart } from "@/lib/cart";

export async function addToCartAction(productId: number, quantity = 1) {
  const cart = await getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  await setCart(cart);
  revalidatePath("/cart");
  revalidatePath("/checkout");

  return { ok: true };
}

export async function updateCartQuantityAction(productId: number, quantity: number) {
  let cart = await getCart();
  cart = cart.map((item) => (item.productId === productId ? { ...item, quantity } : item));
  cart = cart.filter((item) => item.quantity > 0);
  await setCart(cart);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeFromCartAction(productId: number) {
  const cart = await getCart();
  await setCart(cart.filter((item) => item.productId !== productId));
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
