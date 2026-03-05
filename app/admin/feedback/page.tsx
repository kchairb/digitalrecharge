import { FeedbackManager } from "@/components/admin/feedback-manager";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Feedback } from "@/types";

export default async function AdminFeedbackPage() {
  const lang = await getLang();
  const copy = t(lang);
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("feedbacks").select("*").order("created_at", { ascending: false });
  const feedbacks = (data ?? []) as Feedback[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{copy.feedbackManagement}</h1>
      <p className="text-sm text-slate-400">{copy.feedbackManagementDesc}</p>
      <FeedbackManager initial={feedbacks} lang={lang} />
    </div>
  );
}
