import { z } from "zod";

export const uomConversionSchema = z.object({
  base_unit_id: z.string().min(1, "Base unit is required"),
  conversion_unit_id: z.string().min(1, "Conversion unit is required"),
  conversion_rate: z.coerce
    .number()
    .min(0.000001, "Rate must be greater than 0"),
  status: z.enum(["active", "inactive"]),
});

export type UOMConversionFormValues = z.infer<typeof uomConversionSchema>;
