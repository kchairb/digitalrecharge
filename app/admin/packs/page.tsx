import { PackManager } from "@/components/admin/pack-manager";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Category, Product } from "@/types";

export default async function AdminPacksPage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();

  const [{ data: packs }, { data: products }, { data: categories }, { data: links }] = await Promise.all([
    supabase.from("products").select("*").eq("is_pack", true).order("created_at", { ascending: false }),
    supabase.from("products").select("*").neq("is_pack", true).order("name"),
    supabase.from("categories").select("*").order("name"),
    supabase.from("product_pack_items").select("pack_product_id, included_product_id"),
  ]);

  const packLinksMap = new Map<number, number[]>();
  for (const row of links ?? []) {
    const current = packLinksMap.get(row.pack_product_id) ?? [];
    current.push(row.included_product_id);
    packLinksMap.set(row.pack_product_id, current);
  }

  const packsWithItems = ((packs ?? []) as Product[]).map((pack) => ({
    ...pack,
    includedProductIds: packLinksMap.get(pack.id) ?? [],
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{copy.packManagement}</h1>
      <p className="text-sm text-slate-400">{copy.packManagementDesc}</p>
      <PackManager
        initialPacks={packsWithItems}
        products={(products ?? []) as Product[]}
        categories={(categories ?? []) as Category[]}
        lang={lang}
      />
    </div>
  );
}
