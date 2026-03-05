"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { authSchema, signupSchema } from "@/lib/validation";

export async function signUpAction(input: {
  full_name: string;
  whatsapp_phone: string;
  email: string;
  password: string;
}) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      whatsapp_phone: parsed.data.whatsapp_phone,
    },
  });
  if (error) return { ok: false, error: error.message };

  const userId = data.user?.id;
  if (userId) {
    await admin
      .from("profiles")
      .upsert({
        user_id: userId,
        full_name: parsed.data.full_name,
        whatsapp_phone: parsed.data.whatsapp_phone,
        is_admin: false,
      });
  }

  const supabase = await getSupabaseServerClient();
  const signInRes = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (signInRes.error) {
    return { ok: false, error: signInRes.error.message };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function signInAction(input: { email: string; password: string }) {
  const parsed = authSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
