import type { Delivery } from "@/config/schema";

class DeliveryService {
  constructor(private deliveryConfig: Delivery) {}

  async send(msg: string): Promise<boolean> {
    if (!this.deliveryConfig.enabled) return false;
    switch (this.deliveryConfig.type) {
      case "webhook":
        return await this.sendWebhook(this.deliveryConfig, msg);
      default:
        throw new Error(
          `Tipo de envío ${this.deliveryConfig.type} no implementado`,
        );
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
