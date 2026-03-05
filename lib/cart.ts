import { cookies } from "next/headers";

import { CartItem } from "@/types";

const CART_COOKIE = "dr_cart";

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter((item) => item.productId > 0 && item.quantity > 0);
  } catch {
    return [];
  }
}

export async function setCart(items: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(items), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export async function cartCount() {
  const items = await getCart();
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
