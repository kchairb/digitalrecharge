import Link from "next/link";

import { deleteProductFormAction } from "@/lib/actions/admin";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDt } from "@/lib/utils";

export default async function AdminProductsPage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{copy.products}</h1>
        <Link href="/admin/products/new">
          <Button>{copy.newProduct}</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products?.map((product) => (
          <Card key={product.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-white">{product.name}</p>
              <p className="text-sm text-slate-400">
                {product.categories?.name} - {formatDt(product.price_dt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button variant="secondary">{copy.edit}</Button>
              </Link>
              <form action={deleteProductFormAction.bind(null, product.id)}>
                <Button variant="ghost" type="submit">
                  {copy.delete}
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
