"use client";

import { useState, useTransition } from "react";

import { uploadProofForOrderAction } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

export function UploadProofForm({ orderId, token }: { orderId: string; token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <Button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (!file) {
              setMessage("Select an image first.");
              return;
            }
            const result = await uploadProofForOrderAction({ orderId, token, file });
            setMessage(result.ok ? "Proof uploaded successfully." : result.error ?? "Upload failed");
          })
        }
      >
        {pending ? "Uploading..." : "Upload proof"}
      </Button>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
  );
}
