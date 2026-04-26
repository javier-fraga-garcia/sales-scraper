import type { Delivery } from "@/config/schema";
import type { DeliveryHandler } from "./delivery.interface";
import WebhookHandler from "./handlers/WebhookHandler";

export class DeliveryFactory {
  static create(config: Delivery): DeliveryHandler {
    switch (config.type) {
      case "webhook":
        return new WebhookHandler(config);
      default:
        throw new Error(`Handler de tipo ${config.type} no implementado`);
    }
  }
}
