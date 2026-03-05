import Link from "next/link";
import type { Metadata } from "next";
import { MessageCircleMore } from "lucide-react";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCart } from "@/lib/cart";
import { getProductsByIds } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { buildConfiguredLabel } from "@/lib/product-customization";
import { formatDt, whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.checkoutTitle,
    description: copy.metaCheckoutDesc,
  };
}

export default async function CheckoutPage() {
  const lang = await getLang();
  const copy = t(lang);
  const cart = await getCart();
  const products = await getProductsByIds(cart.map((item) => item.productId));
  const productMap = new Map(products.map((p) => [p.id, p]));
  const total = cart.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    const unitPriceDt = item.unitPriceDt ?? product?.price_dt ?? 0;
    return sum + unitPriceDt * item.quantity;
  }, 0);

  if (!cart.length) {
    return (
      <Card>
        <p className="text-slate-300">{copy.cartEmpty}</p>
        <Link href="/shop" className="mt-3 inline-block text-sky-300">
          {copy.continueShopping}
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CheckoutForm total={total} lang={lang} />
      </div>
      <Card className="h-fit lg:sticky lg:top-24">
        <h3 className="font-semibold text-white">{copy.orderSummary}</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          {cart.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) return null;
            const label = buildConfiguredLabel(product.name, {
              provider: item.provider,
              amountUsd: item.amountUsd,
              customRequest: item.customRequest,
            });
            const unitPriceDt = item.unitPriceDt ?? product.price_dt;
            return (
              <p key={item.lineId}>
                {item.quantity} x {label} - {formatDt(unitPriceDt * item.quantity)}
              </p>
            );
          })}
          <p className="mt-4 border-t border-slate-700 pt-3 text-base font-semibold text-white">{copy.total}: {formatDt(total)}</p>
        </div>
        <Link href={whatsappUrl("Hello, I need help before confirming my checkout.")} target="_blank" className="mt-4 inline-block">
          <Button variant="secondary" className="inline-flex w-full gap-2">
            <MessageCircleMore className="h-4 w-4" />
            {copy.needHelpFast}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
