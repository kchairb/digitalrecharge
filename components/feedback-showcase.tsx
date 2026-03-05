import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

import { Card } from "@/components/ui/card";
import type { Feedback } from "@/types";

export function FeedbackShowcase({ lang, feedbacks }: { lang: Lang; feedbacks: Feedback[] }) {
  const copy = t(lang);
  const list = feedbacks.length ? [...feedbacks, ...feedbacks] : [];

  return (
    <section>
      <h2 className="section-title">{copy.feedbackTitle}</h2>
      <div className="mt-4 overflow-hidden">
        {!feedbacks.length ? (
          <Card>
            <p className="text-sm text-slate-300">No feedback yet. Add customer reviews from admin panel.</p>
          </Card>
        ) : (
          <div className="feedback-marquee-track flex gap-4">
            {list.map((item, idx) => (
              <Card key={`${item.id}-${idx}`} className="min-w-[300px] max-w-[360px]">
                <p className="text-amber-300">{"★".repeat(Math.max(1, item.rating))}</p>
                <p className="mt-2 line-clamp-3 text-sm text-slate-200">&quot;{item.comment}&quot;</p>
                <p className="mt-3 text-xs text-slate-400">
                  {item.customer_name}
                  {item.product_label ? ` • ${item.product_label}` : ""}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
