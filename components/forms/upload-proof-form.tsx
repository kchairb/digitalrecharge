"use client";

import { useState, useTransition } from "react";

import { uploadProofForOrderAction } from "@/lib/actions/orders";
import { Lang, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function UploadProofForm({ orderId, token, lang }: { orderId: string; token: string; lang: Lang }) {
  const copy = t(lang);
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
              setMessage(copy.selectImageFirst);
              return;
            }
            const result = await uploadProofForOrderAction({ orderId, token, file });
            setMessage(result.ok ? copy.proofUploadedSuccessfully : result.error ?? copy.uploadFailed);
          })
        }
      >
        {pending ? copy.uploading : copy.uploadProof}
      </Button>
      <p className="text-sm text-slate-300">{message}</p>
    </div>
  );
}
