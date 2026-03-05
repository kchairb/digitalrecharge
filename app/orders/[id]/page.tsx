import Link from "next/link";
import { notFound } from "next/navigation";

import { UploadProofForm } from "@/components/forms/upload-proof-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { getOrderById } from "@/lib/data";
import { formatDt, whatsappUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PublicOrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;
  const order = await getOrderById(id);
  if (!order) notFound();

  const canView = token && token === order.public_token;
  if (!canView) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-white">Order access required</h1>
        <p className="mt-2 text-sm text-slate-300">This page needs the secure token from your order-created link.</p>
      </Card>
    );
  }
  const status = order.status as keyof typeof ORDER_STATUS_LABELS;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-white">Order {order.order_number}</h1>
        <Badge className={`mt-3 ${ORDER_STATUS_STYLES[status]}`}>{ORDER_STATUS_LABELS[status]}</Badge>
        <p className="mt-3 text-slate-300">Total: {formatDt(order.total_dt)}</p>
        <p className="text-slate-300">Payment: {order.payment_method}</p>
        <p className="text-slate-300">Customer: {order.customer_name}</p>
      </Card>
      <Card>
        <h2 className="font-semibold text-white">Items</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          {order.order_items?.map((item) => (
            <p key={item.id}>
              {item.quantity} x {item.product_name} - {formatDt(item.unit_price_dt * item.quantity)}
            </p>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-white">Delivery Notes</h2>
        <p className="mt-2 text-sm text-slate-300">{order.delivery_notes ?? "No notes yet."}</p>
      </Card>
      <Card>
        <h2 className="font-semibold text-white">Payment Proof</h2>
        {order.proof_image_url ? (
          <Link target="_blank" href={order.proof_image_url} className="mt-2 inline-block text-sky-300">
            Open uploaded proof
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No proof uploaded yet.</p>
        )}
        <div className="mt-3">
          <UploadProofForm orderId={order.id} token={order.public_token} />
        </div>
      </Card>
      <Link
        target="_blank"
        href={whatsappUrl(`Order ${order.order_number} status check. Total: ${order.total_dt} DT.`)}
        className="inline-block text-sky-300"
      >
        Message us on WhatsApp
      </Link>
    </div>
  );
}
