"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Building2, MessageCircleMore } from "lucide-react";

import { placeOrderAction } from "@/lib/actions/orders";
import { PAYMENT_METHOD_LABELS, PAYMENT_RECEIVERS } from "@/lib/constants";
import { type Lang, t } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Values = z.infer<typeof checkoutSchema>;

function PaymentServiceIcon({ method }: { method: "flouci" | "d17" | "bank_transfer" }) {
  if (method === "flouci") {
    return (
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-500/20 px-2 text-[10px] font-bold text-cyan-200">
        Fl
      </span>
    );
  }
  if (method === "d17") {
    return (
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500/20 px-2 text-[10px] font-bold text-amber-200">
        D17
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-200">
      <Building2 className="h-3.5 w-3.5" />
    </span>
  );
}

export function CheckoutForm({ total, lang }: { total: number; lang: Lang }) {
  const copy = t(lang);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, formState, watch } = useForm<Values>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "flouci" },
  });
  const selectedMethod = watch("payment_method");

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await placeOrderAction({ ...values, proofFile: file });
      if (!result.ok) {
        setServerError(result.error ?? "Unable to place order.");
        return;
      }
      router.push(
        `/order-created?order=${result.orderId}&number=${result.orderNumber}&total=${result.total}&method=${result.paymentMethod}&token=${result.token}`,
      );
      router.refresh();
    });
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">{copy.checkoutTitle}</h2>
      <p className="mt-1 text-sm text-slate-400">{copy.checkoutDesc}</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.name}</span>
          <input className="" {...register("customer_name")} />
          <p className="mt-1 text-xs text-slate-500">Full name used for order verification.</p>
          <p className="mt-1 text-xs text-rose-300">{formState.errors.customer_name?.message}</p>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.whatsappPhone}</span>
          <input
            placeholder="+216 ..."
            className=""
            {...register("whatsapp_phone")}
          />
          <p className="mt-1 text-xs text-slate-500">We deliver updates and support via WhatsApp.</p>
          <p className="mt-1 text-xs text-rose-300">{formState.errors.whatsapp_phone?.message}</p>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.email} ({copy.optional})</span>
          <input type="email" className="" {...register("email")} />
          <p className="mt-1 text-xs text-rose-300">{formState.errors.email?.message}</p>
        </label>

        <div>
          <p className="mb-2 text-sm text-slate-300">{copy.paymentMethod}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(["flouci", "d17", "bank_transfer"] as const).map((method) => (
              <label
                key={method}
                className="rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-sm transition hover:border-sky-400/50"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <PaymentServiceIcon method={method} />
                    <span>{PAYMENT_METHOD_LABELS[method]}</span>
                  </span>
                  <input type="radio" value={method} {...register("payment_method")} />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
          <p className="text-sm font-semibold text-slate-100">{copy.paymentInstructionsTitle}</p>
          {selectedMethod === "flouci" || selectedMethod === "d17" ? (
            <div className="mt-2 space-y-2 text-sm text-slate-300">
              <p>{copy.sendExactAmount}</p>
              <p>
                <span className="text-slate-400">{copy.amountToSend}:</span>{" "}
                <span className="font-semibold text-emerald-300">{total} DT</span>
              </p>
              <p>
                <span className="text-slate-400">{copy.receiverNumber}:</span>{" "}
                <span className="font-semibold text-sky-300">
                  {selectedMethod === "flouci"
                    ? PAYMENT_RECEIVERS.flouci
                    : PAYMENT_RECEIVERS.d17}
                </span>
              </p>
              <p className="text-xs text-slate-500">{copy.afterPaymentProof}</p>
            </div>
          ) : (
            <div className="mt-2 space-y-2 text-sm text-slate-300">
              <p>{copy.bankTransferInstructions}</p>
              <p>
                <span className="text-slate-400">{copy.bankTransferDetails}:</span>{" "}
                <span className="font-semibold text-sky-300">{PAYMENT_RECEIVERS.bankTransferInfo}</span>
              </p>
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.proofScreenshot} ({copy.optional})</span>
          <input
            type="file"
            accept="image/*"
            className=""
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
          <p className="text-sm text-slate-300">{copy.uploadOrSend}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={whatsappUrl("Hello, I placed an order and will send proof of payment.")} target="_blank">
              <Button type="button" variant="secondary" className="inline-flex gap-2">
                <MessageCircleMore className="h-4 w-4" />
                {copy.contactWhatsapp}
              </Button>
            </Link>
          </div>
        </div>

        {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? copy.creatingOrder : `${copy.placeOrder} (${total} DT)`}
        </Button>
      </form>
    </Card>
  );
}
