import Link from "next/link";
import { ShieldCheck, ShoppingCart, User } from "lucide-react";

import { t, type Lang } from "@/lib/i18n";
import { BrandMark } from "@/components/ui/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { signOutAction } from "@/lib/actions/auth";

type Props = {
  cartCount: number;
  userEmail: string | null;
  lang: Lang;
  isAdmin: boolean;
};

export function SiteHeader({ cartCount, userEmail, lang, isAdmin }: Props) {
  const copy = t(lang);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0b1220]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <Link href="/" className="hover:text-white">
            {copy.home}
          </Link>
          <Link href="/shop" className="hover:text-white">
            {copy.shop}
          </Link>
          <Link href="/account/orders" className="hover:text-white">
            {copy.myOrders}
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="inline-flex items-center gap-1 hover:text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-300" />
              {copy.admin}
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLang={lang} />
          <Link href="/cart">
            <Badge className="inline-flex gap-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              {copy.cart} {cartCount}
            </Badge>
          </Link>
          {userEmail ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Badge className="max-w-[200px] truncate border-purple-400/40 bg-purple-500/10 text-purple-200">
                <User className="mr-1 h-3.5 w-3.5" />
                {userEmail}
              </Badge>
              <form action={signOutAction}>
                <button className="text-xs text-slate-300 hover:text-white">{copy.logout}</button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" className="px-3 py-1.5">
                {copy.login}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
