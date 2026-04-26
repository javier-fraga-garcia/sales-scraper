import type { DeliveryHandler } from "../delivery.interface";
import type { Delivery } from "@/config/schema";

type WebhookConfig = Extract<Delivery, { type: "webhook" }>;

export default class WebhookHandler implements DeliveryHandler {
  constructor(private config: WebhookConfig) {}
  async send(msg: string): Promise<void> {
    const res = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: msg,
      }),
    });
  }
}
