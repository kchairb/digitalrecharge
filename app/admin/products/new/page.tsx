import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";
import { getLang } from "@/lib/i18n-server";

export default async function NewProductPage() {
  const [categories, lang] = await Promise.all([getCategories(), getLang()]);
  return <ProductForm categories={categories} lang={lang} />;
}
