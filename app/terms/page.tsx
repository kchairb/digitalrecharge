import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.terms,
    description: copy.metaTermsDesc,
  };
}

export default async function TermsPage() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>{copy.termsOfServiceTitle}</h1>
      <p>{copy.termsP1}</p>
      <p>{copy.termsP2}</p>
      <p>{copy.termsP3}</p>
    </Card>
  );
}
