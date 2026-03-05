"use client";

import { useState, useTransition } from "react";

import {
  createFeedbackAction,
  deleteFeedbackAction,
  updateFeedbackAction,
} from "@/lib/actions/admin";
import { Lang, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Feedback } from "@/types";

function FeedbackRow({ feedback, lang }: { feedback: Feedback; lang: Lang }) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    customer_name: feedback.customer_name,
    product_label: feedback.product_label ?? "",
    comment: feedback.comment,
    rating: feedback.rating,
    screenshot_url: feedback.screenshot_url ?? "",
    is_published: feedback.is_published,
  });

  return (
    <Card className="space-y-2">
      <div className="grid gap-2 md:grid-cols-2">
        <input
          value={form.customer_name}
          onChange={(e) => setForm((prev) => ({ ...prev, customer_name: e.target.value }))}
          placeholder={copy.customerName}
        />
        <input
          value={form.product_label}
          onChange={(e) => setForm((prev) => ({ ...prev, product_label: e.target.value }))}
          placeholder={copy.productLabelOptional}
        />
      </div>
      <textarea
        value={form.comment}
        onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
        className="min-h-24"
        placeholder={copy.feedbackText}
      />
      <div className="grid gap-2 md:grid-cols-3">
        <input
          type="number"
          min={1}
          max={5}
          value={form.rating}
          onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          placeholder={copy.rating}
        />
        <input
          value={form.screenshot_url}
          onChange={(e) => setForm((prev) => ({ ...prev, screenshot_url: e.target.value }))}
          placeholder={copy.screenshotUrl}
        />
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
          />
          {copy.published}
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateFeedbackAction(feedback.id, form);
              setMessage(result.ok ? copy.saved : result.error ?? copy.failed);
            })
          }
        >
          {copy.save}
        </Button>
        <Button
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteFeedbackAction(feedback.id);
              setMessage(result.ok ? copy.deleted : result.error ?? copy.failed);
            })
          }
        >
          {copy.delete}
        </Button>
        {form.screenshot_url ? (
          <a href={form.screenshot_url} target="_blank" className="inline-flex items-center text-sm text-sky-300">
            {copy.openScreenshot}
          </a>
        ) : null}
      </div>
      <p className="text-xs text-slate-400">{message}</p>
    </Card>
  );
}

export function FeedbackManager({ initial, lang }: { initial: Feedback[]; lang: Lang }) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [createMsg, setCreateMsg] = useState("");
  const [newForm, setNewForm] = useState({
    customer_name: "",
    product_label: "",
    comment: "",
    rating: 5,
    screenshot_url: "",
    is_published: true,
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold text-white">{copy.addFeedback}</h2>
        <div className="mt-3 space-y-2">
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={newForm.customer_name}
              onChange={(e) => setNewForm((p) => ({ ...p, customer_name: e.target.value }))}
              placeholder={copy.customerName}
            />
            <input
              value={newForm.product_label}
              onChange={(e) => setNewForm((p) => ({ ...p, product_label: e.target.value }))}
              placeholder={copy.productLabel}
            />
          </div>
          <textarea
            value={newForm.comment}
            onChange={(e) => setNewForm((p) => ({ ...p, comment: e.target.value }))}
            className="min-h-24"
            placeholder={copy.feedbackText}
          />
          <div className="grid gap-2 md:grid-cols-3">
            <input
              type="number"
              min={1}
              max={5}
              value={newForm.rating}
              onChange={(e) => setNewForm((p) => ({ ...p, rating: Number(e.target.value) }))}
              placeholder={copy.rating}
            />
            <input
              value={newForm.screenshot_url}
              onChange={(e) => setNewForm((p) => ({ ...p, screenshot_url: e.target.value }))}
              placeholder={copy.screenshotUrl}
            />
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={newForm.is_published}
                onChange={(e) => setNewForm((p) => ({ ...p, is_published: e.target.checked }))}
              />
              {copy.published}
            </label>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await createFeedbackAction(newForm);
                setCreateMsg(result.ok ? copy.createdMsg : result.error ?? copy.failed);
                if (result.ok) {
                  setNewForm({
                    customer_name: "",
                    product_label: "",
                    comment: "",
                    rating: 5,
                    screenshot_url: "",
                    is_published: true,
                  });
                }
              })
            }
          >
            {copy.addFeedback}
          </Button>
          <p className="text-xs text-slate-400">{createMsg}</p>
        </div>
      </Card>

      <div className="space-y-3">
        {initial.map((item) => (
          <FeedbackRow key={item.id} feedback={item} lang={lang} />
        ))}
      </div>
    </div>
  );
}
