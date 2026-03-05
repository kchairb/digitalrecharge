import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Bot,
  CircleDollarSign,
  CreditCard,
  Facebook,
  Gift,
  Instagram,
  Layers3,
  MessageCircleMore,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { FeaturedSlider } from "@/components/featured-slider";
import { FeedbackShowcase } from "@/components/feedback-showcase";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/constants";
import { getCategories, getFeaturedProducts, getPublishedFeedbacks } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { shouldUseUnoptimizedImage, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
  description: "Premium digital services in Tunisia with instant support.",
};

export default async function Home() {
  const [categories, featured, feedbacks, lang] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getPublishedFeedbacks(),
    getLang(),
  ]);
  const copy = t(lang);
  const categoryIcons = {
    "ai-tools": Bot,
    streaming: MonitorPlay,
    design: WandSparkles,
    "virtual-cards": CreditCard,
    "gift-cards": Gift,
  } as const;

  return (
    <div className="space-y-14 pb-20">
      <section className="glass-card relative overflow-hidden p-6 sm:p-10">
        <div className="absolute -top-14 -right-14 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">{copy.instantDelivery}</Badge>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          <span className="neon-text">{copy.heroTitle}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-300">{copy.heroSubtitle}</p>
        <p className="mt-3 max-w-2xl text-slate-300">
          {copy.heroDescription}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop">
            <Button>{copy.shopNow}</Button>
          </Link>
          <Link href={whatsappUrl("Hello DigitalRecharge.tn, I want to place an order.")} target="_blank">
            <Button variant="secondary">{copy.orderWhatsapp}</Button>
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span className="inline-flex items-center gap-1">
            <Zap className="h-4 w-4 text-amber-300" />
            {copy.instantDelivery}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            {copy.securePayments}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircleMore className="h-4 w-4 text-purple-300" />
            {copy.support}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="text-slate-400">{copy.followUs}:</span>
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 hover:border-sky-400/60 hover:text-white"
          >
            <Instagram className="h-4 w-4" />
            {copy.instagram}
          </Link>
          <Link
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 hover:border-sky-400/60 hover:text-white"
          >
            <Facebook className="h-4 w-4" />
            {copy.facebook}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">{copy.categories}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? Layers3;
            const imageStyle = category.image_url
              ? { backgroundImage: `linear-gradient(to top, rgba(6,10,20,.65), rgba(6,10,20,.2)), url(${category.image_url})` }
              : undefined;
            return (
              <Link key={category.id} href={`/shop?category=${category.slug}`}>
                <Card
                  className="group overflow-hidden text-center text-slate-200 transition hover:-translate-y-1 hover:border-purple-400/60"
                >
                  <div className="relative mb-3 -mx-5 -mt-5 h-20 overflow-hidden">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        unoptimized={shouldUseUnoptimizedImage(category.image_url)}
                        className="object-cover"
                      />
                    ) : (
                      <div
                        style={imageStyle}
                        className="h-full w-full bg-cover bg-center"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1222]/70 to-transparent" />
                  </div>
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/70 text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium">{category.name}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="section-title">{copy.featuredProducts}</h2>
        <p className="mt-1 text-sm text-slate-400">{copy.featuredSwipeHint}</p>
        <div className="mt-4">
          <FeaturedSlider products={featured} />
        </div>
      </section>

      <section>
        <h2 className="section-title">{copy.topProducts}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CircleDollarSign className="h-5 w-5 text-sky-300" />
          <h3 className="mt-3 font-semibold text-white">{copy.howStep1Title}</h3>
          <p className="mt-2 text-sm text-slate-300">{copy.howStep1Desc}</p>
        </Card>
        <Card>
          <ShieldCheck className="h-5 w-5 text-purple-300" />
          <h3 className="mt-3 font-semibold text-white">{copy.howStep2Title}</h3>
          <p className="mt-2 text-sm text-slate-300">{copy.howStep2Desc}</p>
        </Card>
        <Card>
          <Zap className="h-5 w-5 text-amber-300" />
          <h3 className="mt-3 font-semibold text-white">{copy.howStep3Title}</h3>
          <p className="mt-2 text-sm text-slate-300">{copy.howStep3Desc}</p>
        </Card>
        <Card>
          <Sparkles className="h-5 w-5 text-sky-300" />
          <h3 className="mt-3 font-semibold text-white">{copy.howStep4Title}</h3>
          <p className="mt-2 text-sm text-slate-300">{copy.howStep4Desc}</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{copy.paymentMethods}</h2>
        <div className="flex flex-wrap gap-3">
          {["Flouci", "D17", "Bank Transfer"].map((item) => (
            <Badge key={item} className="rounded-xl px-4 py-2 text-sm">
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <FeedbackShowcase lang={lang} feedbacks={feedbacks} />
    </div>
  );
}
