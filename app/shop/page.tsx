import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { Card } from "@/components/ui/card";
import { getCategories, getProducts } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse digital products: AI tools, streaming, design, and cards.",
};

type Props = {
  searchParams: Promise<{ search?: string; category?: string; sort?: "price" | "new" }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const lang = await getLang();
  const copy = t(lang);
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: params.search,
      category: params.category,
      sort: params.sort,
    }),
  ]);

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-3xl font-bold text-white">{copy.shop}</h1>
      <Card>
        <form className="grid gap-3 md:grid-cols-4">
          <input
            name="search"
            defaultValue={params.search ?? ""}
            placeholder={copy.searchProduct}
            className=""
          />
          <select name="category" defaultValue={params.category ?? ""} className="">
            <option value="">{copy.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={params.sort ?? "new"} className="">
            <option value="new">{copy.newest}</option>
            <option value="price">{copy.priceLowHigh}</option>
          </select>
          <button className="min-h-10 rounded-xl bg-gradient-to-r from-purple-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,.35)]">
            {copy.filter}
          </button>
        </form>
      </Card>
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-slate-300">{copy.noProductsFound}</p>
          <Link href="/shop" className="mt-3 inline-block text-sm text-sky-300">
            {copy.resetFilters}
          </Link>
        </Card>
      )}
    </div>
  );
}
