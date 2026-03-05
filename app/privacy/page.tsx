import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How we use customer data and payment proof information.",
};

export default function PrivacyPage() {
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p>We collect only data needed to fulfill your order: name, WhatsApp, optional email, and order metadata.</p>
      <p>Payment proof screenshots are stored securely in Supabase Storage and used only for verification.</p>
      <p>We do not sell your personal data and access is restricted to authorized admins.</p>
    </Card>
  );
}
