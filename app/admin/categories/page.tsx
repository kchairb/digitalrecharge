import { CategoryRow } from "@/components/admin/category-row";
import { CategoryForm } from "@/components/admin/category-form";
import { Card } from "@/components/ui/card";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Category } from "@/types";

export default async function AdminCategoriesPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Categories</h1>
      <CategoryForm />
      <Card>
        <div className="space-y-2 text-sm text-slate-300">
          {categories?.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      </Card>
    </div>
  );
}
