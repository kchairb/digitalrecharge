import { UploadProofForm } from "@/components/forms/upload-proof-form";
import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function OrderProofPage({ params, searchParams }: Props) {
  const lang = await getLang();
  const copy = t(lang);
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card>
        <p className="text-slate-300">{copy.missingTokenInUrl}</p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold text-white">{copy.uploadPaymentProof}</h1>
      <p className="mt-2 text-sm text-slate-400">{copy.orderIdLabel}: {id}</p>
      <div className="mt-4">
        <UploadProofForm orderId={id} token={token} lang={lang} />
      </div>
    </Card>
  );
}
