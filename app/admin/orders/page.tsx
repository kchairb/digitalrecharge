import Link from "next/link";
import Image from "next/image";

import { OrderStatusForm } from "@/components/admin/order-status-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDt, shouldUseUnoptimizedImage } from "@/lib/utils";
import type { Order } from "@/types";

export default async function AdminOrdersPage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];
  const paidRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, order) => sum + order.total_dt, 0);
  const allOrdersAmount = orders.reduce((sum, order) => sum + order.total_dt, 0);
  const paidCount = orders.filter((o) => o.status === "paid" || o.status === "delivered").length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{copy.adminOrdersTitle}</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">{copy.revenuePaidDelivered}</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{formatDt(paidRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">{copy.allOrdersTotal}</p>
          <p className="mt-2 text-2xl font-bold text-sky-300">{formatDt(allOrdersAmount)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">{copy.paidOrdersCount}</p>
          <p className="mt-2 text-2xl font-bold text-purple-300">{paidCount}</p>
        </Card>
      </div>
      {orders?.map((order) => (
        <Card key={order.id} className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{order.order_number}</p>
              <Badge className={ORDER_STATUS_STYLES[order.status as keyof typeof ORDER_STATUS_STYLES]}>
                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {order.customer_name} - {order.whatsapp_phone} - {formatDt(order.total_dt)}
            </p>
            <p className="mt-1 text-xs text-slate-400">{copy.paymentMethodShort}: {order.payment_method}</p>
            <div className="mt-3 space-y-1 text-sm text-slate-300">
              {order.order_items?.map((item) => (
                <p key={item.id}>
                  {item.quantity} x {item.product_name} ({formatDt(item.unit_price_dt)})
                </p>
              ))}
            </div>
            {order.proof_image_url ? (
              <div className="mt-2 space-y-2">
                <Link href={order.proof_image_url} target="_blank" className="inline-block text-sm text-sky-300">
                  {copy.viewUploadedProof}
                </Link>
                <Link href={order.proof_image_url} target="_blank" className="block">
                  <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-slate-700">
                    <Image
                      src={order.proof_image_url}
                      alt="Payment proof"
                      fill
                      sizes="112px"
                      unoptimized={shouldUseUnoptimizedImage(order.proof_image_url)}
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">{copy.noProofImageUploaded}</p>
            )}
          </div>
          <OrderStatusForm orderId={order.id} status={order.status} initialNotes={order.delivery_notes} lang={lang} />
        </Card>
      ))}
    </div>
  );
}
