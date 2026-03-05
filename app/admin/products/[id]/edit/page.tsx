import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [categories, supabase, lang] = await Promise.all([getCategories(), getSupabaseAdmin(), getLang()]);
  const { data: product } = await supabase.from("products").select("*").eq("id", Number(id)).single();
  if (!product) notFound();

  return <ProductForm categories={categories} initial={product} lang={lang} />;
}
