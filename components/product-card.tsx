import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lang, t } from "@/lib/i18n";
import { getCustomProductKind, isMonthlyPricedProduct } from "@/lib/product-customization";
import { formatDt, shouldUseUnoptimizedImage, whatsappUrl } from "@/lib/utils";
import { Product } from "@/types";

export function ProductCard({ product, lang }: { product: Product; lang: Lang }) {
  const copy = t(lang);
  const isInstant = product.delivery_time.toLowerCase().includes("instant");
  const isCustomizable = Boolean(getCustomProductKind(product));
  const isMonthly = isMonthlyPricedProduct(product);

  return (
    <Card className="group flex h-full flex-col justify-between overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/30 hover:shadow-[0_0_28px_rgba(56,189,248,0.18)]">
      <div className="relative h-36 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized={shouldUseUnoptimizedImage(product.image_url)}
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-500/35 to-sky-400/25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222]/80 via-[#0a1222]/20 to-transparent" />
      </div>
      <div className="flex h-full flex-col justify-between p-5">
      <div>
        <p className="text-xs text-slate-400">{product.categories?.name ?? copy.digitalProduct}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {isInstant ? (
            <Badge className="border-amber-300/40 bg-amber-400/10 text-amber-200">
              <Zap className="mr-1 h-3.5 w-3.5" />
              {copy.instant}
            </Badge>
          ) : null}
          {product.is_featured ? (
            <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {copy.bestSeller}
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">{product.name}</h3>
        <p className="mt-2 text-sm text-slate-300">{product.short_description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-sky-200">{formatDt(product.price_dt)}</p>
            {isMonthly ? <p className="text-[11px] text-slate-400">{copy.monthlyPriceHint}</p> : null}
          </div>
          <Badge>{product.delivery_time}</Badge>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href={`/product/${product.slug}`}>
            <Button variant="secondary" className="w-full">
              {copy.view}
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
          {isCustomizable ? (
            <Link href={`/product/${product.slug}`}>
              <Button className="w-full">{copy.configure}</Button>
            </Link>
          ) : (
            <AddToCartButton productId={product.id} className="w-full" />
          )}
        </div>
        <Link href={`/product/${product.slug}`}>
          <Button className="w-full shadow-[0_0_20px_rgba(139,92,246,0.35)]">{copy.buyNow}</Button>
        </Link>
        <Link href={whatsappUrl(`Hello, I want to order ${product.name} (${formatDt(product.price_dt)}).`)} target="_blank">
          <Button variant="ghost" className="w-full">
            {copy.orderWhatsapp}
          </Button>
        </Link>
      </div>
      </div>
    </Card>
  );
}
