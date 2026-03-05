import Link from "next/link";
import { Metadata } from "next";

import { UploadProofForm } from "@/components/forms/upload-proof-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Created",
  description: "Follow payment instructions and share your proof.",
};

type Props = {
  searchParams: Promise<{
    order?: string;
    number?: string;
    total?: string;
    method?: "flouci" | "d17" | "bank_transfer";
    token?: string;
  }>;
};

export default async function OrderCreatedPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = params.number ?? "N/A";
  const total = Number(params.total ?? 0);
  const paymentMethod = (params.method && PAYMENT_METHOD_LABELS[params.method]) || "Payment Method";
  const whatsappMessage = `Order ${orderNumber} created. Total ${total} DT. I will send payment proof now.`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-300">Order Created</Badge>
        <h1 className="mt-3 text-3xl font-bold text-white">Thanks for your order.</h1>
        <p className="mt-3 text-slate-300">Order Number: {orderNumber}</p>
        <p className="text-slate-300">Total: {total} DT</p>
        <p className="text-slate-300">Payment method: {paymentMethod}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Next steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Pay using your selected method.</li>
          <li>Send proof to WhatsApp.</li>
          <li>Wait for status update: Pending Payment -&gt; Paid -&gt; Delivered.</li>
        </ol>
        <Link target="_blank" href={whatsappUrl(whatsappMessage)} className="mt-4 inline-block">
          <Button>Send proof via WhatsApp</Button>
        </Link>
      </Card>

      {params.order && params.token ? (
        <Card>
          <h3 className="font-semibold text-white">Upload Proof Here (Optional)</h3>
          <p className="mt-1 text-sm text-slate-400">You can upload the screenshot now or later.</p>
          <div className="mt-3">
            <UploadProofForm orderId={params.order} token={params.token} />
          </div>
        </Card>
      ) : null}

      {params.order ? (
        <Link href={`/orders/${params.order}?token=${params.token ?? ""}`}>
          <Button variant="secondary">View order page</Button>
        </Link>
      ) : null}
    </div>
  );
}
