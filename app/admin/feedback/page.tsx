import { FeedbackManager } from "@/components/admin/feedback-manager";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Feedback } from "@/types";

export default async function AdminFeedbackPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("feedbacks").select("*").order("created_at", { ascending: false });
  const feedbacks = (data ?? []) as Feedback[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Feedback Management</h1>
      <p className="text-sm text-slate-400">Manage real customer reviews and optional screenshot proofs.</p>
      <FeedbackManager initial={feedbacks} />
    </div>
  );
}
