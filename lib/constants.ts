import { OrderStatus, PaymentMethod } from "@/types";

export const SITE_NAME = "DigitalRecharge.tn";
export const SITE_DESCRIPTION =
  "Buy premium digital products in Tunisia: AI tools, streaming, design assets, virtual cards, and gift cards.";

export const THEME_COLORS = {
  background: "#0B1220",
  card: "#111A2E",
  border: "#263352",
  accent: "#7C3AED",
  accentBlue: "#38BDF8",
};

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21600000000";
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/digitalrecharge.tn";
export const FACEBOOK_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com/digitalrecharge.tn";
export const DEVTRX_CONTACT_URL = process.env.NEXT_PUBLIC_DEVTRX_CONTACT_URL ?? "#";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  flouci: "Flouci",
  d17: "D17",
  bank_transfer: "Bank Transfer",
};

export const PAYMENT_RECEIVERS = {
  flouci: process.env.NEXT_PUBLIC_PAYMENT_FLOUCI_NUMBER ?? "TO_BE_SET",
  d17: process.env.NEXT_PUBLIC_PAYMENT_D17_NUMBER ?? "TO_BE_SET",
  bankTransferInfo:
    process.env.NEXT_PUBLIC_PAYMENT_BANK_INFO ?? "Bank details will be provided by support.",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  delivered: "Delivered",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-500/15 text-amber-200 border-amber-300/45 shadow-[0_0_12px_rgba(245,158,11,.25)]",
  paid: "bg-sky-500/15 text-sky-200 border-sky-300/45 shadow-[0_0_12px_rgba(56,189,248,.24)]",
  delivered: "bg-emerald-500/15 text-emerald-200 border-emerald-300/45 shadow-[0_0_12px_rgba(16,185,129,.22)]",
  refunded: "bg-purple-500/15 text-purple-200 border-purple-300/45 shadow-[0_0_12px_rgba(139,92,246,.25)]",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-300/45 shadow-[0_0_12px_rgba(244,63,94,.2)]",
};

export const CATEGORY_ORDER = [
  "ai-tools",
  "streaming",
  "design",
  "virtual-cards",
  "gift-cards",
];
