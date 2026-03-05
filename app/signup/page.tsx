import Link from "next/link";
import type { Metadata } from "next";

import { AuthForm } from "@/components/forms/auth-form";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.signupTitle,
    description: copy.metaSignupDesc,
  };
}

export default async function SignupPage() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <div className="space-y-4">
      <AuthForm mode="signup" lang={lang} />
      <p className="text-center text-sm text-slate-400">
        {copy.alreadyHaveAccount}{" "}
        <Link href="/login" className="text-sky-300">
          {copy.login}
        </Link>
      </p>
    </div>
  );
}
