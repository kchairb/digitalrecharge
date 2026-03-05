import Link from "next/link";
import type { Metadata } from "next";

import { AuthForm } from "@/components/forms/auth-form";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.loginTitle,
    description: copy.metaLoginDesc,
  };
}

export default async function LoginPage() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <div className="space-y-4">
      <AuthForm mode="login" lang={lang} />
      <p className="text-center text-sm text-slate-400">
        {copy.newHere}{" "}
        <Link href="/signup" className="text-sky-300">
          {copy.createAccount}
        </Link>
      </p>
    </div>
  );
}
