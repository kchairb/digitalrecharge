import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductConfigPanel } from "@/components/product-config-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPackIncludedProducts, getProductBySlug } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getCustomProductKind, isMonthlyPricedProduct } from "@/lib/product-customization";
import { formatDt, shouldUseUnoptimizedImage } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      url: `/product/${product.slug}`,
      type: "article",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const lang = await getLang();
  const copy = t(lang);
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const isInstant = product.delivery_time.toLowerCase().includes("instant");
  const customKind = getCustomProductKind(product);
  const isMonthly = isMonthlyPricedProduct(product);
  const includedProducts = product.is_pack ? await getPackIncludedProducts(product.id) : [];

  return (
    <div id="top" className="space-y-6 pb-24 sm:pb-0">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="relative h-72 sm:h-[420px]">
            {product.is_pack && includedProducts.length > 0 ? (
              <div
                className="grid h-full w-full gap-1 p-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(includedProducts.length, 3)}, 1fr)`,
                }}
              >
                {includedProducts.slice(0, 6).map((p) => (
                  <div key={p.id} className="relative overflow-hidden bg-slate-800/80">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        unoptimized={shouldUseUnoptimizedImage(p.image_url)}
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-500/35 to-sky-400/25" />
                    )}
                  </div>
                ))}
              </div>
            ) : product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized={shouldUseUnoptimizedImage(product.image_url)}
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-purple-500/35 to-sky-400/25" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222]/75 to-transparent" />
          </div>
          <div className="grid grid-cols-4 gap-2 p-4">
            <div className="h-16 rounded-xl border border-slate-700 bg-slate-900/60" />
            <div className="h-16 rounded-xl border border-slate-700 bg-slate-900/60" />
            <div className="h-16 rounded-xl border border-slate-700 bg-slate-900/60" />
            <div className="h-16 rounded-xl border border-slate-700 bg-slate-900/60" />
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-xs uppercase tracking-wider text-slate-400">{product.categories?.name}</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
          {product.is_pack && includedProducts.length > 0 ? (
            <p className="mt-2 text-base font-medium text-sky-200/95">
              {includedProducts.map((p) => p.name).join(" · ")}
            </p>
          ) : null}
          <p className="mt-2 text-slate-300">{product.short_description}</p>
          <p className="mt-4 text-4xl font-extrabold text-sky-200">{formatDt(product.price_dt)}</p>
          {isMonthly ? <p className="mt-1 text-xs text-slate-400">{copy.monthlyPriceHint}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isInstant ? (
              <Badge className="border-amber-300/40 bg-amber-500/10 text-amber-200">
                <Zap className="mr-1 h-3.5 w-3.5" />
                {copy.instant}
              </Badge>
            ) : null}
            <Badge>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {product.delivery_time}
            </Badge>
            {product.is_featured ? (
              <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">{copy.bestSeller}</Badge>
            ) : null}
          </div>

          <ProductConfigPanel product={product} lang={lang} />

          {product.is_pack ? (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/40 p-3">
              <p className="text-sm font-medium text-white">{copy.includedProducts}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {includedProducts.map((item) => (
                  <li key={item.id}>- {item.name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 space-y-2 text-sm text-slate-300">
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Fast order confirmation
            </p>
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              Secure local payment methods
            </p>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <details open className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <summary className="cursor-pointer text-base font-semibold text-white">{copy.whatYouGet}</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.long_description}</ReactMarkdown>
          </div>
        </details>

        <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <summary className="cursor-pointer text-base font-semibold text-white">{copy.requirementsTitle}</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.requirements}</ReactMarkdown>
          </div>
        </details>

        <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <summary className="cursor-pointer text-base font-semibold text-white">{copy.refundPolicyTitle}</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.refund_policy}</ReactMarkdown>
          </div>
        </details>
      </Card>

      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-700 bg-[#0b1220]/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="text-lg font-bold text-sky-200">{formatDt(product.price_dt)}</p>
          {customKind ? (
            <Link href="#top">
              <Button className="w-auto min-w-36 px-5">{copy.configure}</Button>
            </Link>
          ) : (
            <AddToCartButton productId={product.id} label={copy.buyNow} className="w-auto min-w-36 px-5" />
          )}
        </div>
      </div>
    </div>
  );
}
