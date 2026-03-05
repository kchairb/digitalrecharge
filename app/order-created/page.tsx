import Link from "next/link";
import { Metadata } from "next";

import { UploadProofForm } from "@/components/forms/upload-proof-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { whatsappProofMessage, whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const copy = t(lang);
  return {
    title: copy.orderCreatedBadge,
    description: copy.metaOrderCreatedDesc,
  };
}

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
  const lang = await getLang();
  const copy = t(lang);
  const params = await searchParams;
  const orderNumber = params.number ?? "N/A";
  const total = Number(params.total ?? 0);
  const paymentMethod = (params.method && PAYMENT_METHOD_LABELS[params.method]) || copy.paymentMethodShort;
  const whatsappMessage = whatsappProofMessage(orderNumber, total);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-300">{copy.orderCreatedBadge}</Badge>
        <h1 className="mt-3 text-3xl font-bold text-white">{copy.thanksForOrder}</h1>
        <p className="mt-3 text-slate-300">{copy.orderNumberLabel}: {orderNumber}</p>
        <p className="text-slate-300">{copy.total}: {total} DT</p>
        <p className="text-slate-300">{copy.paymentMethodShort}: {paymentMethod}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">{copy.nextSteps}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>{copy.nextStepPay}</li>
          <li>{copy.nextStepSendProof}</li>
          <li>{copy.nextStepWaitStatus}</li>
        </ol>
        <Link target="_blank" href={whatsappUrl(whatsappMessage)} className="mt-4 inline-block">
          <Button>{copy.sendProofWhatsapp}</Button>
        </Link>
      </Card>

      {params.order && params.token ? (
        <Card>
          <h3 className="font-semibold text-white">{copy.uploadProofOptionalTitle}</h3>
          <p className="mt-1 text-sm text-slate-400">{copy.uploadProofOptionalDesc}</p>
          <div className="mt-3">
            <UploadProofForm orderId={params.order} token={params.token} lang={lang} />
          </div>
        </Card>
      ) : null}

      {params.order ? (
        <Link href={`/orders/${params.order}?token=${params.token ?? ""}`}>
          <Button variant="secondary">{copy.viewOrderPage}</Button>
        </Link>
      ) : null}
    </div>
  );
}
