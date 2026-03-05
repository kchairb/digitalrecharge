"use client";

import { useState, useTransition } from "react";

import {
  createFeedbackAction,
  deleteFeedbackAction,
  updateFeedbackAction,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Feedback } from "@/types";

function FeedbackRow({ feedback }: { feedback: Feedback }) {
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
          placeholder="Customer name"
        />
        <input
          value={form.product_label}
          onChange={(e) => setForm((prev) => ({ ...prev, product_label: e.target.value }))}
          placeholder="Product label (optional)"
        />
      </div>
      <textarea
        value={form.comment}
        onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
        className="min-h-24"
        placeholder="Feedback text"
      />
      <div className="grid gap-2 md:grid-cols-3">
        <input
          type="number"
          min={1}
          max={5}
          value={form.rating}
          onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          placeholder="Rating"
        />
        <input
          value={form.screenshot_url}
          onChange={(e) => setForm((prev) => ({ ...prev, screenshot_url: e.target.value }))}
          placeholder="Screenshot URL"
        />
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
          />
          Published
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateFeedbackAction(feedback.id, form);
              setMessage(result.ok ? "Saved" : result.error ?? "Failed");
            })
          }
        >
          Save
        </Button>
        <Button
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteFeedbackAction(feedback.id);
              setMessage(result.ok ? "Deleted" : result.error ?? "Failed");
            })
          }
        >
          Delete
        </Button>
        {form.screenshot_url ? (
          <a href={form.screenshot_url} target="_blank" className="inline-flex items-center text-sm text-sky-300">
            Open screenshot
          </a>
        ) : null}
      </div>
      <p className="text-xs text-slate-400">{message}</p>
    </Card>
  );
}

export function FeedbackManager({ initial }: { initial: Feedback[] }) {
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
        <h2 className="text-lg font-semibold text-white">Add Feedback</h2>
        <div className="mt-3 space-y-2">
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={newForm.customer_name}
              onChange={(e) => setNewForm((p) => ({ ...p, customer_name: e.target.value }))}
              placeholder="Customer name"
            />
            <input
              value={newForm.product_label}
              onChange={(e) => setNewForm((p) => ({ ...p, product_label: e.target.value }))}
              placeholder="Product label"
            />
          </div>
          <textarea
            value={newForm.comment}
            onChange={(e) => setNewForm((p) => ({ ...p, comment: e.target.value }))}
            className="min-h-24"
            placeholder="Feedback text"
          />
          <div className="grid gap-2 md:grid-cols-3">
            <input
              type="number"
              min={1}
              max={5}
              value={newForm.rating}
              onChange={(e) => setNewForm((p) => ({ ...p, rating: Number(e.target.value) }))}
              placeholder="Rating"
            />
            <input
              value={newForm.screenshot_url}
              onChange={(e) => setNewForm((p) => ({ ...p, screenshot_url: e.target.value }))}
              placeholder="Screenshot URL"
            />
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={newForm.is_published}
                onChange={(e) => setNewForm((p) => ({ ...p, is_published: e.target.checked }))}
              />
              Published
            </label>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await createFeedbackAction(newForm);
                setCreateMsg(result.ok ? "Created" : result.error ?? "Failed");
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
            Add feedback
          </Button>
          <p className="text-xs text-slate-400">{createMsg}</p>
        </div>
      </Card>

      <div className="space-y-3">
        {initial.map((item) => (
          <FeedbackRow key={item.id} feedback={item} />
        ))}
      </div>
    </div>
  );
}
