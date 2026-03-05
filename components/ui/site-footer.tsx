import Link from "next/link";
import { Facebook, Instagram, Send } from "lucide-react";

import { t, type Lang } from "@/lib/i18n";
import { BrandMark } from "@/components/ui/brand-mark";
import { whatsappUrl } from "@/lib/utils";

export function SiteFooter({ lang }: { lang: Lang }) {
  const copy = t(lang);
  return (
    <footer className="mt-16 border-t border-slate-800 bg-[#0b1220]/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 text-sm text-slate-400 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <BrandMark compact />
          <p className="mt-3 max-w-xs">{copy.heroDescription}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-slate-200">{copy.quickLinks}</p>
          <Link href="/shop" className="hover:text-white">
            {copy.shop}
          </Link>
          <Link href="/account/orders" className="hover:text-white">
            {copy.myOrders}
          </Link>
          <Link href="/admin" className="hover:text-white">
            {copy.admin}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-slate-200">{copy.legal}</p>
          <Link href="/terms" className="hover:text-white">
            {copy.terms}
          </Link>
          <Link href="/refund-policy" className="hover:text-white">
            {copy.refundPolicy}
          </Link>
          <Link href="/privacy" className="hover:text-white">
            {copy.privacy}
          </Link>
        </div>
        <div>
          <p className="text-slate-300">{copy.paymentLabel}</p>
          <p className="mt-1">{copy.supportLabel}</p>
          <div className="mt-4 flex items-center gap-2 text-slate-300">
            <Link href={whatsappUrl("Hello, I need support.")} target="_blank" className="rounded-lg border border-slate-700 p-2 hover:border-sky-400/60">
              <Send className="h-4 w-4" />
            </Link>
            <span className="rounded-lg border border-slate-700 p-2 opacity-70">
              <Facebook className="h-4 w-4" />
            </span>
            <span className="rounded-lg border border-slate-700 p-2 opacity-70">
              <Instagram className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
