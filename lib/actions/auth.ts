"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validation";

export async function signUpAction(input: { email: string; password: string }) {
  const parsed = authSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return { ok: false, error: error.message };

  const userId = data.user?.id;
  if (userId) {
    const admin = getSupabaseAdmin();
    await admin.from("profiles").upsert({ user_id: userId, is_admin: false });
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
