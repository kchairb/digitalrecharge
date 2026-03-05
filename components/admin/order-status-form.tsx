"use client";

import { useState, useTransition } from "react";

import { updateOrderStatusAction } from "@/lib/actions/admin";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types";

export function OrderStatusForm({
  orderId,
  status,
  initialNotes,
}: {
  orderId: string;
  status: OrderStatus;
  initialNotes?: string | null;
}) {
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
          setMessage(result.ok ? "Updated." : result.error ?? "Failed");
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
        placeholder="Delivery notes..."
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Updating..." : "Save"}
      </Button>
      <p className="text-xs text-slate-400">{message}</p>
    </form>
  );
}
