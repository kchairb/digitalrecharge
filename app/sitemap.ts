import type { MetadataRoute } from "next";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitalrecharge.tn";

const staticRoutes = [
  "",
  "/shop",
  "/cart",
  "/login",
  "/signup",
  "/terms",
  "/privacy",
  "/refund-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabaseAdmin();
  const { data: products } = await supabase.from("products").select("slug, updated_at");

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
