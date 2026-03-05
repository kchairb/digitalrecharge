import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.privacy,
    description: copy.metaPrivacyDesc,
  };
}

export default async function PrivacyPage() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>{copy.privacyPolicyTitle}</h1>
      <p>{copy.privacyP1}</p>
      <p>{copy.privacyP2}</p>
      <p>{copy.privacyP3}</p>
    </Card>
  );
}
