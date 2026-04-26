export interface DeliveryHandler {
  send(msg: string): Promise<void>;
}
