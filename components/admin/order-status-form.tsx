"use client";

import { useState, useTransition } from "react";

import { updateOrderStatusAction } from "@/lib/actions/admin";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Lang, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types";

export function OrderStatusForm({
  orderId,
  status,
  initialNotes,
  lang,
}: {
  orderId: string;
  status: OrderStatus;
  initialNotes?: string | null;
  lang: Lang;
}) {
  const copy = t(lang);
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [message, setMessage] = useState("");

  return (
    <form
      className="space-y-3"
      action={(formData) =>
        startTransition(async () => {
          const nextStatus = String(formData.get("status")) as OrderStatus;
          const result = await updateOrderStatusAction({
            orderId,
            status: nextStatus,
            delivery_notes: notes,
          });
          setMessage(result.ok ? copy.updated : result.error ?? copy.failed);
        })
      }
    >
      <select name="status" defaultValue={status} className="">
        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((key) => (
          <option key={key} value={key}>
            {ORDER_STATUS_LABELS[key]}
          </option>
        ))}
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-24"
        placeholder={copy.deliveryNotesPlaceholder}
      />
      <Button type="submit" disabled={pending}>
        {pending ? copy.updating : copy.save}
      </Button>
      <p className="text-xs text-slate-400">{message}</p>
    </form>
  );
}
