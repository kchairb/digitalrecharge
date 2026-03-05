type TelegramOrderItem = {
  product_name: string;
  quantity: number;
  unit_price_dt: number;
};

type TelegramOrderPayload = {
  orderNumber: string;
  customerName: string;
  whatsappPhone: string;
  email?: string | null;
  paymentMethod: string;
  totalDt: number;
  items: TelegramOrderItem[];
  productImageUrl?: string | null;
  proofImageUrl?: string | null;
};

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  return { botToken, chatId, enabled: Boolean(botToken && chatId) };
}

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const { botToken, enabled } = getTelegramConfig();
  if (!enabled || !botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

async function sendTelegramMessage(text: string) {
  const { chatId, enabled } = getTelegramConfig();
  if (!enabled || !chatId) return;
  await telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
  });
}

async function sendTelegramPhoto(photoUrl: string, caption?: string) {
  const { chatId, enabled } = getTelegramConfig();
  if (!enabled || !chatId || !photoUrl) return;
  await telegramApi("sendPhoto", {
    chat_id: chatId,
    photo: photoUrl,
    caption,
  });
}

function orderSummaryText(payload: TelegramOrderPayload) {
  const lines = payload.items.map(
    (item) => `- ${item.quantity} x ${item.product_name} (${item.unit_price_dt} DT)`,
  );
  return [
    "🛒 New Order",
    `Order: ${payload.orderNumber}`,
    `Name: ${payload.customerName}`,
    `WhatsApp: ${payload.whatsappPhone}`,
    `Email: ${payload.email ?? "-"}`,
    `Payment: ${payload.paymentMethod}`,
    `Total: ${payload.totalDt} DT`,
    "",
    "Items:",
    ...lines,
  ].join("\n");
}

export async function notifyTelegramNewOrder(payload: TelegramOrderPayload) {
  try {
    const summary = orderSummaryText(payload);
    if (payload.productImageUrl) {
      await sendTelegramPhoto(payload.productImageUrl, summary);
    } else {
      await sendTelegramMessage(summary);
    }

    if (payload.proofImageUrl) {
      await sendTelegramPhoto(
        payload.proofImageUrl,
        `💳 Payment proof uploaded\nOrder: ${payload.orderNumber}\nCustomer: ${payload.customerName}`,
      );
    }
  } catch {
    // Never block checkout because of Telegram failures.
  }
}

export async function notifyTelegramProofUploaded(payload: {
  orderNumber: string;
  customerName: string;
  whatsappPhone: string;
  email?: string | null;
  proofImageUrl: string;
}) {
  try {
    await sendTelegramPhoto(
      payload.proofImageUrl,
      [
        "💳 Payment proof uploaded",
        `Order: ${payload.orderNumber}`,
        `Name: ${payload.customerName}`,
        `WhatsApp: ${payload.whatsappPhone}`,
        `Email: ${payload.email ?? "-"}`,
      ].join("\n"),
    );
  } catch {
    // Do not block user flow
  }
}
