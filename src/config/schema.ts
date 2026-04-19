import { z } from "zod";

const ColumnSchema = z.object({
  selector: z.string().min(1),
  attribute: z.string().optional(),
});

const DeliverySchema = z.discriminatedUnion("type", [
  z.object({
    enabled: z.boolean(),
    type: z.literal("webhook"),
    url: z.url(),
  }),
  z.object({
    enabled: z.boolean(),
    type: z.literal("email"),
    url: z.email(),
  }),
  z.object({ enabled: z.boolean(), type: z.literal("sms") }),
]);

const SiteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  urls: z.array(z.url()),
  columns: z.record(z.string(), ColumnSchema),
});

const StorageSchema = z.object({
  table_name: z.string().min(1),
  columns: z.array(z.string().min(1)),
});

export const ConfigSchema = z.object({
  app_name: z.string().min(1),
  storage: StorageSchema,
  delivery: z.record(z.string(), DeliverySchema),
  sites: z.array(SiteSchema),
});

export type Config = z.infer<typeof ConfigSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Storage = z.infer<typeof StorageSchema>;
