"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signInAction, signUpAction } from "@/lib/actions/auth";
import { type Lang, t } from "@/lib/i18n";
import { authSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Values = z.infer<typeof authSchema>;

export function AuthForm({ mode, lang }: { mode: "login" | "signup"; lang: Lang }) {
  const copy = t(lang);
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = mode === "login" ? await signInAction(values) : await signUpAction(values);
      if (!result.ok) {
        setServerError(result.error ?? "Action failed");
        return;
      }
      router.push(mode === "login" ? "/account/orders" : "/login");
      router.refresh();
    });
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold text-white">{mode === "login" ? copy.loginTitle : copy.signupTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">
        {mode === "login" ? copy.signinDesc : copy.signupDesc}
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.email}</span>
          <input
            type="email"
            className=""
            {...register("email")}
          />
          <p className="mt-1 text-xs text-slate-500">{lang === "ar" ? "نستخدم البريد فقط للدخول إلى الحساب." : "We only use your email for account access."}</p>
          <p className="mt-1 text-xs text-rose-300">{formState.errors.email?.message}</p>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-200">{copy.password}</span>
          <input
            type="password"
            className=""
            {...register("password")}
          />
          <p className="mt-1 text-xs text-slate-500">{lang === "ar" ? "6 أحرف على الأقل." : "Minimum 6 characters."}</p>
          <p className="mt-1 text-xs text-rose-300">{formState.errors.password?.message}</p>
        </label>
        {serverError ? <p className="text-sm text-rose-300">{serverError}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? copy.pleaseWait : mode === "login" ? copy.login : copy.createAccount}
        </Button>
      </form>
    </Card>
  );
}
