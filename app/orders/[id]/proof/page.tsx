import { UploadProofForm } from "@/components/forms/upload-proof-form";
import { Card } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function OrderProofPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card>
        <p className="text-slate-300">Missing token in URL.</p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold text-white">Upload payment proof</h1>
      <p className="mt-2 text-sm text-slate-400">Order ID: {id}</p>
      <div className="mt-4">
        <UploadProofForm orderId={id} token={token} />
      </div>
    </Card>
  );
}
