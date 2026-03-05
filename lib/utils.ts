import clsx from "clsx";

import { WHATSAPP_NUMBER } from "@/lib/constants";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatDt(amount: number) {
  return `${amount} DT`;
}

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappSupportMessage() {
  return `السلام عليكم،
نحب نطلب خدمة من DigitalRecharge.tn`;
}

export function whatsappProductOrderMessage(productName: string) {
  return `السلام عليكم،

نحب نطلب الخدمة التالية:

الخدمة: ${productName}
طريقة الدفع: Flouci أو D17

يرجى تأكيد التوفر.`;
}

export function whatsappProofMessage(orderNumber: string, totalDt: number) {
  return `السلام عليكم،

تم إنشاء طلبي بنجاح.
رقم الطلب: ${orderNumber}
المجموع: ${totalDt} DT

سأرسل إثبات الدفع الآن.
يرجى تأكيد الاستلام.`;
}

export function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 900 + 100);
  return `DR-${stamp}-${random}`;
}

export function shouldUseUnoptimizedImage(url?: string | null) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    const allowed = ["images.unsplash.com", "tttupvhitpoaslnezxma.supabase.co"];
    return !allowed.includes(parsed.hostname);
  } catch {
    return true;
  }
}
