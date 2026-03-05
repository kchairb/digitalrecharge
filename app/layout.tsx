import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { cartCount } from "@/lib/cart";
import { isRtl } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { LivePurchaseToast } from "@/components/ui/live-purchase-toast";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_NAME} | Digital Marketplace`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | Digital Marketplace`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [count, lang, cookieStore] = await Promise.all([cartCount(), getLang(), cookies()]);
  const hasAuthCookie = cookieStore
    .getAll()
    .some((cookie) => cookie.name.includes("-auth-token") || cookie.name.includes("sb-"));

  let userEmail: string | null = null;
  let isAdmin = false;
  if (hasAuthCookie) {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();
      isAdmin = Boolean(profile?.is_admin);
    }
  }
  const rtl = isRtl(lang);

  return (
    <html lang={lang} dir={rtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://tttupvhitpoaslnezxma.supabase.co" />
        <link rel="preconnect" href="https://tttupvhitpoaslnezxma.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader cartCount={count} userEmail={userEmail} lang={lang} isAdmin={isAdmin} />
        <main className="reveal-stagger mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
        <SiteFooter lang={lang} />
        <LivePurchaseToast lang={lang} />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
