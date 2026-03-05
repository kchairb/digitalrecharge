import Link from "next/link";
import type { Metadata } from "next";

import { CartLineItemActions } from "@/components/cart-line-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCart } from "@/lib/cart";
import { getProductsByIds } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { formatDt } from "@/lib/utils";
import { buildConfiguredLabel } from "@/lib/product-customization";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.cart,
    description: copy.metaCartDesc,
  };
}

export default async function CartPage() {
  const lang = await getLang();
  const copy = t(lang);
  const cart = await getCart();
  const products = await getProductsByIds(cart.map((item) => item.productId));
  const productMap = new Map(products.map((product) => [product.id, product]));

  const lines = cart
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        product,
        lineId: item.lineId,
        quantity: item.quantity,
        unitPriceDt: item.unitPriceDt ?? product.price_dt,
        label: buildConfiguredLabel(product.name, {
          provider: item.provider,
          amountUsd: item.amountUsd,
          planPeriod: item.planPeriod,
          customRequest: item.customRequest,
        }),
        subtotal: (item.unitPriceDt ?? product.price_dt) * item.quantity,
      };
    })
    .filter(Boolean) as Array<{
    product: (typeof products)[number];
    lineId: string;
    quantity: number;
    unitPriceDt: number;
    label: string;
    subtotal: number;
  }>;

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return (
    <div className="space-y-5 pb-20">
      <h1 className="text-3xl font-bold text-white">{copy.cartTitle}</h1>
      {!lines.length ? (
        <Card>
          <p className="text-slate-300">{copy.cartEmpty}</p>
          <Link href="/shop">
            <Button className="mt-4">{copy.goShop}</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card className="space-y-4">
            {lines.map((line) => (
              <div
                key={line.lineId}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 last:border-none"
              >
                <div>
                  <p className="font-semibold text-white">{line.label}</p>
                  <p className="text-sm text-slate-400">{formatDt(line.unitPriceDt)} each</p>
                </div>
                <CartLineItemActions lineId={line.lineId} quantity={line.quantity} />
                <p className="font-semibold text-sky-300">{formatDt(line.subtotal)}</p>
              </div>
            ))}
          </Card>
          <Card className="sticky bottom-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xl font-bold text-white">{copy.total}: {formatDt(total)}</p>
            <Link href="/checkout">
              <Button>{copy.proceedCheckout}</Button>
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
