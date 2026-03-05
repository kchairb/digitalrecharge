import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Lang, t } from "@/lib/i18n";
import { formatDt, shouldUseUnoptimizedImage } from "@/lib/utils";
import { Product } from "@/types";

export function FeaturedSlider({ products, lang }: { products: Product[]; lang: Lang }) {
  const copy = t(lang);
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="glass-card min-w-[260px] snap-start p-4 transition hover:-translate-y-0.5 hover:border-sky-400/35 sm:min-w-[300px]"
        >
          <div className="relative mb-3 h-28 overflow-hidden rounded-xl border border-slate-700/80">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 80vw, 320px"
                unoptimized={shouldUseUnoptimizedImage(product.image_url)}
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-purple-500/35 to-sky-400/25" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222]/70 to-transparent" />
          </div>
          <div className="flex items-center justify-between">
            <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">{copy.topSeller}</Badge>
            <span className="text-sm font-semibold text-sky-200">{formatDt(product.price_dt)}</span>
          </div>
          <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-white">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-300">{product.short_description}</p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-300">
            {copy.view}
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}
