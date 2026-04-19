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

export const ConfigSchema = z.object({
  sites: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      urls: z.array(z.url()),
      storage: z.object({
        table_name: z.string().min(1),
        columns: z.record(z.string(), ColumnSchema),
      }),
    }),
  ),
  delivery: z.record(z.string(), DeliverySchema),
});

export type Config = z.infer<typeof ConfigSchema>;
