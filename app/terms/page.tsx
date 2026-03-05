import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms and conditions for using DigitalRecharge.tn.",
};

export default function TermsPage() {
  return (
    <Card className="prose prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p>By placing an order, you confirm that information provided is accurate and you agree to our delivery process.</p>
      <p>Digital products are delivered according to each product delivery time and can require account verification details.</p>
      <p>Abuse, fraudulent payments, or chargeback attempts may result in cancellation and permanent account restriction.</p>
    </Card>
  );
}
