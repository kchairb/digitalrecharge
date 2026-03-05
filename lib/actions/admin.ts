"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { categorySchema, feedbackSchema, orderStatusSchema, productSchema } from "@/lib/validation";
import { toSlug } from "@/lib/utils";

export async function createCategoryAction(input: { name: string; slug: string; image_url?: string }) {
  const parsed = categorySchema.safeParse({
    ...input,
    slug: toSlug(input.slug || input.name),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category" };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").insert({
    ...parsed.data,
    image_url: parsed.data.image_url || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidateTag("categories", "max");
  return { ok: true };
}

export async function updateCategoryAction(
  id: number,
  input: { name: string; slug: string; image_url?: string },
) {
  const parsed = categorySchema.safeParse({
    ...input,
    slug: toSlug(input.slug || input.name),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category" };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("categories")
    .update({
      ...parsed.data,
      image_url: parsed.data.image_url || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidateTag("categories", "max");
  return { ok: true };
}

export async function deleteCategoryAction(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidateTag("categories", "max");
  return { ok: true };
}

export async function createProductAction(input: Record<string, unknown>) {
  const parsed = productSchema.safeParse({
    ...input,
    slug: toSlug(String(input.slug || input.name || "")),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product" };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").insert({
    ...parsed.data,
    image_url: parsed.data.image_url || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidateTag("products", "max");
  revalidateTag("featured-products", "max");
  return { ok: true };
}

export async function updateProductAction(id: number, input: Record<string, unknown>) {
  const parsed = productSchema.safeParse({
    ...input,
    slug: toSlug(String(input.slug || input.name || "")),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product" };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("products")
    .update({
      ...parsed.data,
      image_url: parsed.data.image_url || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidateTag("products", "max");
  revalidateTag("featured-products", "max");
  return { ok: true };
}

export async function deleteProductAction(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidateTag("products", "max");
  revalidateTag("featured-products", "max");
  return { ok: true };
}

export async function deleteProductFormAction(id: number) {
  await deleteProductAction(id);
}

export async function updateOrderStatusAction(input: {
  orderId: string;
  status: "pending_payment" | "paid" | "delivered" | "refunded" | "cancelled";
  delivery_notes?: string;
}) {
  const parsed = orderStatusSchema.safeParse(input.status);
  if (!parsed.success) return { ok: false, error: "Invalid status." };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("orders")
    .update({
      status: parsed.data,
      delivery_notes: input.delivery_notes?.trim() ? input.delivery_notes.trim() : null,
    })
    .eq("id", input.orderId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${input.orderId}`);
  return { ok: true };
}

export async function createFeedbackAction(input: Record<string, unknown>) {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid feedback." };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("feedbacks").insert({
    ...parsed.data,
    product_label: parsed.data.product_label || null,
    screenshot_url: parsed.data.screenshot_url || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/");
  revalidateTag("feedbacks", "max");
  return { ok: true };
}

export async function updateFeedbackAction(id: number, input: Record<string, unknown>) {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid feedback." };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("feedbacks")
    .update({
      ...parsed.data,
      product_label: parsed.data.product_label || null,
      screenshot_url: parsed.data.screenshot_url || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/");
  revalidateTag("feedbacks", "max");
  return { ok: true };
}

export async function deleteFeedbackAction(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("feedbacks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/");
  revalidateTag("feedbacks", "max");
  return { ok: true };
}

export async function uploadProductImageAction(file: File) {
  if (!file || file.size <= 0) {
    return { ok: false, error: "Select an image first." };
  }

  const serverClient = await getSupabaseServerClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return { ok: false, error: "Unauthorized." };
  }

  const adminCheck = await getSupabaseAdmin()
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();
  if (!adminCheck.data?.is_admin) {
    return { ok: false, error: "Only admins can upload product images." };
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "png";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const bytes = await file.arrayBuffer();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, bytes, { contentType: file.type || "image/png", upsert: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
