import { CategoryRow } from "@/components/admin/category-row";
import { CategoryForm } from "@/components/admin/category-form";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Category } from "@/types";

export default async function AdminCategoriesPage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{copy.categoriesLabel}</h1>
      <CategoryForm lang={lang} />
      <Card>
        <div className="space-y-2 text-sm text-slate-300">
          {categories?.map((category) => (
            <CategoryRow key={category.id} category={category} lang={lang} />
          ))}
        </div>
      </Card>
    </div>
  );
}
