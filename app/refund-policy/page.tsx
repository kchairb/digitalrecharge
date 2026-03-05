import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund rules for digital products and subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>Refund Policy</h1>
      <p>Refunds are evaluated case-by-case for failed delivery or service mismatch.</p>
      <p>Completed and successfully delivered digital products are generally non-refundable.</p>
      <p>If a provider-side issue occurs and cannot be resolved, partial or full refund may be issued.</p>
    </Card>
  );
}
