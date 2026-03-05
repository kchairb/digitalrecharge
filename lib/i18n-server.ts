import { cookies } from "next/headers";

import type { Lang } from "@/lib/i18n";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const cookieLang = store.get("dr_lang")?.value;
  return cookieLang === "ar" ? "ar" : "en";
}
