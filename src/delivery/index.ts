import type { Delivery } from "@/config/schema";

class DeliveryService {
  constructor(private deliveryConfig: Delivery) {}

  send(msg: string): void {
    throw new Error("Método no implementado");
  }

  private sendWebhook(msg: string): void {
    throw new Error("Método no implementado");
  }
}

export default DeliveryService;
