import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/data";
import { formatDt, shouldUseUnoptimizedImage, whatsappUrl } from "@/lib/utils";

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
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const isInstant = product.delivery_time.toLowerCase().includes("instant");

  return (
    <div className="space-y-6 pb-24 sm:pb-0">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="relative h-72 sm:h-[420px]">
            {product.image_url ? (
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
          <p className="mt-2 text-slate-300">{product.short_description}</p>
          <p className="mt-4 text-4xl font-extrabold text-sky-200">{formatDt(product.price_dt)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isInstant ? (
              <Badge className="border-amber-300/40 bg-amber-500/10 text-amber-200">
                <Zap className="mr-1 h-3.5 w-3.5" />
                Instant
              </Badge>
            ) : null}
            <Badge>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {product.delivery_time}
            </Badge>
            {product.is_featured ? (
              <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">Best Seller</Badge>
            ) : null}
          </div>

          <div className="mt-5 space-y-2">
            <AddToCartButton productId={product.id} label="Buy now" />
            <Link
              target="_blank"
              href={whatsappUrl(`Hello, I want to order ${product.name} (${formatDt(product.price_dt)}).`)}
            >
              <Button variant="secondary" className="w-full">
                Order via WhatsApp
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="w-full">
                Go to cart
              </Button>
            </Link>
          </div>

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
          <summary className="cursor-pointer text-base font-semibold text-white">What you get</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.long_description}</ReactMarkdown>
          </div>
        </details>

        <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <summary className="cursor-pointer text-base font-semibold text-white">Requirements</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.requirements}</ReactMarkdown>
          </div>
        </details>

        <details className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
          <summary className="cursor-pointer text-base font-semibold text-white">Refund policy</summary>
          <div className="prose prose-invert mt-3 max-w-none text-slate-300">
            <ReactMarkdown>{product.refund_policy}</ReactMarkdown>
          </div>
        </details>
      </Card>

      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-700 bg-[#0b1220]/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="text-lg font-bold text-sky-200">{formatDt(product.price_dt)}</p>
          <AddToCartButton productId={product.id} label="Buy now" className="w-auto min-w-36 px-5" />
        </div>
      </div>
    </div>
  );
}
