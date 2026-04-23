import { z } from "zod";

export const currencySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(2, "Code is required").max(5),
  symbol: z.string().min(1, "Symbol is required"),
  exchange_rate: z.coerce.number().min(0, "Rate cannot be negative"),
  is_base_currency: z.boolean().default(false),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;
