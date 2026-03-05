"use server";

import { revalidatePath } from "next/cache";

import { clearCart, getCart } from "@/lib/cart";
import { getProductsByIds } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notifyTelegramNewOrder, notifyTelegramProofUploaded } from "@/lib/telegram";
import { checkoutSchema } from "@/lib/validation";
import { buildConfiguredLabel } from "@/lib/product-customization";
import { generateOrderNumber } from "@/lib/utils";

function toNullableEmail(email?: string) {
  return email?.trim() ? email.trim() : null;
}

async function uploadProof(file: File, orderId: string) {
  if (!file || file.size <= 0) return null;
  const supabase = getSupabaseAdmin();
  const path = `order-${orderId}/${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("payment-proofs")
    .upload(path, bytes, { contentType: file.type || "image/png", upsert: false });
  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
  return data.publicUrl;
}

export async function placeOrderAction(input: {
  customer_name: string;
  whatsapp_phone: string;
  email?: string;
  payment_method: "flouci" | "d17" | "bank_transfer";
  proofFile?: File | null;
}) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid checkout data" };
  }

  const cart = await getCart();
  if (!cart.length) return { ok: false, error: "Your cart is empty." };

  const products = await getProductsByIds(cart.map((item) => item.productId));
  if (!products.length) return { ok: false, error: "No products found in cart." };

  const amountMap = new Map(products.map((product) => [product.id, product.price_dt]));
  const nameMap = new Map(products.map((product) => [product.id, product.name]));
  const imageMap = new Map(products.map((product) => [product.id, product.image_url ?? null]));
  const total = cart.reduce(
    (sum, item) => sum + (item.unitPriceDt ?? amountMap.get(item.productId) ?? 0) * item.quantity,
    0,
  );

  const serverClient = await getSupabaseServerClient();
  const authUser = await serverClient.auth.getUser();
  const userId = authUser.data.user?.id ?? null;

  const supabase = getSupabaseAdmin();
  const orderNumber = generateOrderNumber();
  const publicToken = crypto.randomUUID();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      customer_name: parsed.data.customer_name,
      whatsapp_phone: parsed.data.whatsapp_phone,
      email: toNullableEmail(parsed.data.email),
      payment_method: parsed.data.payment_method,
      status: "pending_payment",
      total_dt: total,
      public_token: publicToken,
    })
    .select("*")
    .single();

  if (orderError || !order) return { ok: false, error: orderError?.message ?? "Order failed." };

  const itemsToInsert = cart.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: buildConfiguredLabel(nameMap.get(item.productId) ?? "Product", {
      provider: item.provider,
      amountUsd: item.amountUsd,
      planPeriod: item.planPeriod,
      customRequest: item.customRequest,
    }),
    unit_price_dt: item.unitPriceDt ?? amountMap.get(item.productId) ?? 0,
    quantity: item.quantity,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(itemsToInsert);
  if (itemError) return { ok: false, error: itemError.message };

  let proofUrl: string | null = null;
  if (input.proofFile && input.proofFile.size > 0) {
    proofUrl = await uploadProof(input.proofFile, order.id);
    if (proofUrl) {
      await supabase.from("orders").update({ proof_image_url: proofUrl }).eq("id", order.id);
    }
  }

  const firstProductImage =
    cart.length > 0 ? imageMap.get(cart[0]?.productId ?? -1) : null;
  await notifyTelegramNewOrder({
    orderNumber: order.order_number,
    customerName: order.customer_name,
    whatsappPhone: order.whatsapp_phone,
    email: order.email,
    paymentMethod: order.payment_method,
    totalDt: order.total_dt,
    items: itemsToInsert.map((item) => ({
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price_dt: item.unit_price_dt,
    })),
    productImageUrl: firstProductImage,
    proofImageUrl: proofUrl,
  });

  await clearCart();
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin/orders");

  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.order_number,
    total: order.total_dt,
    paymentMethod: order.payment_method,
    token: order.public_token,
  };
}

export async function uploadProofForOrderAction(input: {
  orderId: string;
  token: string;
  file: File;
}) {
  if (!input.file || input.file.size <= 0) return { ok: false, error: "No image selected." };
  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from("orders")
    .select("id, public_token, order_number, customer_name, whatsapp_phone, email")
    .eq("id", input.orderId)
    .single();

  if (!order || order.public_token !== input.token) {
    return { ok: false, error: "Invalid order token." };
  }

  const proofUrl = await uploadProof(input.file, input.orderId);
  const { error } = await supabase
    .from("orders")
    .update({ proof_image_url: proofUrl })
    .eq("id", input.orderId);
  if (error) return { ok: false, error: error.message };

  await notifyTelegramProofUploaded({
    orderNumber: order.order_number,
    customerName: order.customer_name,
    whatsappPhone: order.whatsapp_phone,
    email: order.email,
    proofImageUrl: proofUrl,
  });

  revalidatePath(`/orders/${input.orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
