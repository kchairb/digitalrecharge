import { TrendingUp, Wallet, ReceiptText, CircleCheckBig } from "lucide-react";

import { Card } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDt } from "@/lib/utils";

export default async function AdminHomePage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const [
    { count: products },
    { count: categories },
    { count: orders },
    { count: feedbacks },
    { data: orderTotals },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("feedbacks").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_dt,status"),
  ]);

  const totals = orderTotals ?? [];
  const realizedRevenue = totals
    .filter((order) => order.status === "paid" || order.status === "delivered")
    .reduce((sum, order) => sum + order.total_dt, 0);
  const pendingRevenue = totals
    .filter((order) => order.status === "pending_payment")
    .reduce((sum, order) => sum + order.total_dt, 0);
  const grossRevenue = totals.reduce((sum, order) => sum + order.total_dt, 0);
  const paidCount = totals.filter((order) => order.status === "paid" || order.status === "delivered").length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{copy.businessOverview}</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-emerald-500/15 blur-2xl" />
          <p className="inline-flex items-center gap-2 text-sm text-slate-400">
            <Wallet className="h-4 w-4 text-emerald-300" />
            {copy.revenuePaidDelivered}
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">{formatDt(realizedRevenue)}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.paidDeliveredOnly}</p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-amber-500/15 blur-2xl" />
          <p className="inline-flex items-center gap-2 text-sm text-slate-400">
            <ReceiptText className="h-4 w-4 text-amber-300" />
            {copy.pendingRevenue}
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-300">{formatDt(pendingRevenue)}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.awaitingPaymentConfirmation}</p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-sky-500/15 blur-2xl" />
          <p className="inline-flex items-center gap-2 text-sm text-slate-400">
            <TrendingUp className="h-4 w-4 text-sky-300" />
            {copy.grossRevenue}
          </p>
          <p className="mt-2 text-3xl font-bold text-sky-300">{formatDt(grossRevenue)}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.allCreatedOrders}</p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-purple-500/15 blur-2xl" />
          <p className="inline-flex items-center gap-2 text-sm text-slate-400">
            <CircleCheckBig className="h-4 w-4 text-purple-300" />
            {copy.paidOrdersCount}
          </p>
          <p className="mt-2 text-3xl font-bold text-purple-300">{paidCount}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.successfulPaymentPipeline}</p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-400">{copy.products}</p>
          <p className="mt-2 text-2xl font-bold text-white">{products ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">{copy.categoriesLabel}</p>
          <p className="mt-2 text-2xl font-bold text-white">{categories ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">{copy.ordersLabel}</p>
          <p className="mt-2 text-2xl font-bold text-white">{orders ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">{copy.feedbacks}</p>
          <p className="mt-2 text-2xl font-bold text-white">{feedbacks ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
