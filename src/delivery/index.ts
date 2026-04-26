import type { Delivery } from "@/config/schema";

class DeliveryService {
  constructor(private deliveryConfig: Record<string, Delivery>) {}

  async send(msg: string): Promise<void> {
    for (const delivery of Object.values(this.deliveryConfig)) {
      if (!delivery.enabled) continue;
      switch (delivery.type) {
        case "webhook":
          await this.sendWebhook(delivery, msg);
          break;
        default:
          throw new Error(`Tipo de envío ${delivery.type} no implementado`);
      }
    }
  }

  private async sendWebhook(
    config: Extract<Delivery, { type: "webhook" }>,
    msg: string,
  ): Promise<boolean> {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: msg,
      }),
    });
    return res.ok;
  }
}

export default DeliveryService;
