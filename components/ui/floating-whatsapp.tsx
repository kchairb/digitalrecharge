import { MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { whatsappSupportMessage, whatsappUrl } from "@/lib/utils";

export function FloatingWhatsApp() {
  return (
    <Link
      href={whatsappUrl(whatsappSupportMessage())}
      target="_blank"
      className="fixed right-3 bottom-3 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] sm:right-4 sm:bottom-4"
    >
      <MessageCircleMore className="h-4 w-4" />
      WhatsApp Support
    </Link>
  );
}
