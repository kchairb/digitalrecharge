import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDt } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-white">{copy.accountOrdersTitle}</h1>
      {!orders?.length ? (
        <Card>
          <p className="text-slate-300">{copy.noOrdersYet}</p>
        </Card>
      ) : (
        orders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`}>
            <Card className="flex items-center justify-between transition hover:-translate-y-0.5 hover:border-sky-400/40">
              <div>
                <p className="font-semibold text-white">{order.order_number}</p>
                <p className="text-sm text-slate-400">{formatDt(order.total_dt)}</p>
              </div>
              <Badge className={ORDER_STATUS_STYLES[order.status as keyof typeof ORDER_STATUS_STYLES]}>
                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
              </Badge>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
