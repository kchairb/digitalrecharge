import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Category, Feedback, Order, Product } from "@/types";

export async function getCategories() {
  return cachedCategories();
}

const cachedCategories = unstable_cache(
  async () => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Category[];
  },
  ["categories"],
  { revalidate: 120, tags: ["categories"] },
);

export async function getFeaturedProducts() {
  return cachedFeaturedProducts();
}

const cachedFeaturedProducts = unstable_cache(
  async () => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Product[];
  },
  ["featured-products"],
  { revalidate: 120, tags: ["featured-products", "products"] },
);

export async function getProducts(params?: {
  search?: string;
  category?: string;
  sort?: "price" | "new";
}) {
  const isDefaultQuery = !params?.search && !params?.category && (!params?.sort || params.sort === "new");
  if (isDefaultQuery) {
    return cachedDefaultProducts();
  }

  const supabase = getSupabaseAdmin();
  let query = supabase.from("products").select("*, categories(*)");

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params?.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (params?.sort === "price") {
    query = query.order("price_dt", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Product[];
}

const cachedDefaultProducts = unstable_cache(
  async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Product[];
  },
  ["default-products"],
  { revalidate: 120, tags: ["products"] },
);

export async function getProductBySlug(slug: string) {
  return cachedProductBySlug(slug);
}

const cachedProductBySlug = unstable_cache(
  async (slug: string) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }
  return data as Product;
  },
  ["product-by-slug"],
  { revalidate: 120, tags: ["products"] },
);

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) return [];

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as Product[];
}

export async function getOrderById(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Order;
}

export async function getPublishedFeedbacks() {
  return cachedPublishedFeedbacks();
}

const cachedPublishedFeedbacks = unstable_cache(
  async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Feedback[];
  },
  ["published-feedbacks"],
  { revalidate: 120, tags: ["feedbacks"] },
);
