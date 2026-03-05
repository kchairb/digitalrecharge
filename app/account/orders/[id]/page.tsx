import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDt } from "@/lib/utils";
import type { Order } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: Props) {
  const user = await requireUser();
  const lang = await getLang();
  const copy = t(lang);
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  const order = data as Order | null;

  if (!order) notFound();
  const status = order.status as keyof typeof ORDER_STATUS_LABELS;

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-white">{order.order_number}</h1>
        <Badge className={`mt-3 ${ORDER_STATUS_STYLES[status]}`}>{ORDER_STATUS_LABELS[status]}</Badge>
        <p className="mt-2 text-slate-300">{copy.total}: {formatDt(order.total_dt)}</p>
      </Card>
      <Card>
        <h2 className="font-semibold text-white">{copy.orderItemsTitle}</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          {order.order_items?.map((item) => (
            <p key={item.id}>
              {item.quantity} x {item.product_name} - {formatDt(item.unit_price_dt * item.quantity)}
            </p>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-white">{copy.deliveryNotesTitle}</h2>
        <p className="mt-2 text-sm text-slate-300">{order.delivery_notes ?? copy.noNotesYet}</p>
      </Card>
    </div>
  );
}
