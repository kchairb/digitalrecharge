import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Category, Feedback, Order, Product } from "@/types";

const GAMING_BASE_SLUGS = [
  "fortnite-vbucks",
  "fortnite-vbucks-1000",
  "roblox-robux",
  "roblox-robux-400",
  "pubg-mobile-uc",
  "pubg-uc-60",
  "free-fire-diamonds",
  "freefire-diamonds-100",
  "valorant-points",
  "valorant-points-475",
] as const;

function gamingFamilyKey(slug: string) {
  const s = slug.toLowerCase();
  if (s.startsWith("fortnite-vbucks")) return "fortnite";
  if (s.startsWith("roblox-robux")) return "roblox";
  if (s.startsWith("pubg-uc") || s.startsWith("pubg-mobile-uc")) return "pubg";
  if (s.startsWith("freefire-diamonds") || s.startsWith("free-fire-diamonds")) return "freefire";
  if (s.startsWith("valorant-points")) return "valorant";
  return null;
}

function dedupeGamingTopupProducts(products: Product[]) {
  const grouped = new Map<string, Product[]>();
  for (const product of products) {
    const key = gamingFamilyKey(product.slug);
    if (!key) continue;
    const list = grouped.get(key) ?? [];
    list.push(product);
    grouped.set(key, list);
  }

  const chosenSlugByFamily = new Map<string, string>();
  grouped.forEach((items, family) => {
    const base = items.find((p) => GAMING_BASE_SLUGS.includes(p.slug as (typeof GAMING_BASE_SLUGS)[number]));
    if (base) {
      chosenSlugByFamily.set(family, base.slug);
      return;
    }
    const cheapest = [...items].sort((a, b) => a.price_dt - b.price_dt)[0];
    chosenSlugByFamily.set(family, cheapest.slug);
  });

  return products.filter((product) => {
    const key = gamingFamilyKey(product.slug);
    if (!key) return true;
    return chosenSlugByFamily.get(key) === product.slug;
  });
}

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
    .neq("is_pack", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(error.message);
  }
  return dedupeGamingTopupProducts((data ?? []) as Product[]);
  },
  ["featured-products"],
  { revalidate: 120, tags: ["featured-products", "products"] },
);

export async function getFeaturedPacks() {
  return cachedFeaturedPacks();
}

const cachedFeaturedPacks = unstable_cache(
  async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("is_pack", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Product[];
  },
  ["featured-packs"],
  { revalidate: 120, tags: ["featured-packs", "featured-products", "products"] },
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
  return dedupeGamingTopupProducts((data ?? []) as Product[]);
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
    return dedupeGamingTopupProducts((data ?? []) as Product[]);
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

export async function getPackIncludedProducts(packProductId: number) {
  const supabase = getSupabaseAdmin();
  const { data: links, error: linksError } = await supabase
    .from("product_pack_items")
    .select("included_product_id")
    .eq("pack_product_id", packProductId);
  if (linksError) {
    throw new Error(linksError.message);
  }
  const includedIds = (links ?? []).map((row) => row.included_product_id);
  if (!includedIds.length) return [];
  return getProductsByIds(includedIds);
}

export type PackIncludedItem = { name: string; image_url: string | null };

/** Returns featured packs with included product names and images for display. */
export async function getFeaturedPacksWithIncludedNames(): Promise<
  (Product & { includedProductNames: string[]; includedProductImages: PackIncludedItem[] })[]
> {
  const packs = await getFeaturedPacks();
  if (!packs.length) return [];

  const supabase = getSupabaseAdmin();
  const packIds = packs.map((p) => p.id);
  const { data: links, error: linksError } = await supabase
    .from("product_pack_items")
    .select("pack_product_id, included_product_id")
    .in("pack_product_id", packIds);
  if (linksError) throw new Error(linksError.message);

  const includedIds = [...new Set((links ?? []).map((row) => row.included_product_id))];
  if (!includedIds.length) return packs.map((p) => ({ ...p, includedProductNames: [], includedProductImages: [] }));

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, image_url")
    .in("id", includedIds);
  if (productsError) throw new Error(productsError.message);
  const productById = new Map(
    (products ?? []).map((p: { id: number; name: string; image_url: string | null }) => [p.id, { name: p.name, image_url: p.image_url }])
  );

  const itemsByPackId = new Map<number, { name: string; image_url: string | null }[]>();
  for (const row of links ?? []) {
    const item = productById.get(row.included_product_id);
    if (!item) continue;
    const list = itemsByPackId.get(row.pack_product_id) ?? [];
    list.push(item);
    itemsByPackId.set(row.pack_product_id, list);
  }

  // Ensure every pack has included images (fallback when product_pack_items is empty or cache is stale)
  return Promise.all(
    packs.map(async (p) => {
      let items = itemsByPackId.get(p.id) ?? [];
      if (items.length === 0) {
        const included = await getPackIncludedProducts(p.id);
        items = included.map((prod) => ({ name: prod.name, image_url: prod.image_url }));
      }
      return {
        ...p,
        includedProductNames: items.map((i) => i.name),
        includedProductImages: items,
      };
    })
  );
}

/** For a list of products that may include packs, returns a Map of pack product id -> included product names. */
export async function getPackIncludedNamesMap(packProductIds: number[]): Promise<Map<number, string[]>> {
  const details = await getPackIncludedDetailsMap(packProductIds);
  const out = new Map<number, string[]>();
  details.forEach((items, packId) => out.set(packId, items.map((i) => i.name)));
  return out;
}

/** For a list of pack product ids, returns a Map of pack id -> included items (name + image_url) for pack picture grids. */
export async function getPackIncludedDetailsMap(
  packProductIds: number[]
): Promise<Map<number, PackIncludedItem[]>> {
  if (!packProductIds.length) return new Map();
  const supabase = getSupabaseAdmin();
  const { data: links, error: linksError } = await supabase
    .from("product_pack_items")
    .select("pack_product_id, included_product_id")
    .in("pack_product_id", packProductIds);
  if (linksError) throw new Error(linksError.message);
  const includedIds = [...new Set((links ?? []).map((row) => row.included_product_id))];
  if (!includedIds.length) return new Map(packProductIds.map((id) => [id, []]));
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, image_url")
    .in("id", includedIds);
  if (productsError) throw new Error(productsError.message);
  const itemById = new Map(
    (products ?? []).map((p: { id: number; name: string; image_url: string | null }) => [
      p.id,
      { name: p.name, image_url: p.image_url },
    ])
  );
  const itemsByPackId = new Map<number, PackIncludedItem[]>();
  for (const row of links ?? []) {
    const item = itemById.get(row.included_product_id);
    if (!item) continue;
    const list = itemsByPackId.get(row.pack_product_id) ?? [];
    list.push(item);
    itemsByPackId.set(row.pack_product_id, list);
  }
  return itemsByPackId;
}
