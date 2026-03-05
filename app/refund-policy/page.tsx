import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.refundPolicy,
    description: copy.metaRefundDesc,
  };
}

export default async function RefundPolicyPage() {
  const lang = await getLang();
  const copy = t(lang);
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>{copy.refundPolicyPageTitle}</h1>
      <p>{copy.refundP1}</p>
      <p>{copy.refundP2}</p>
      <p>{copy.refundP3}</p>
    </Card>
  );
}
