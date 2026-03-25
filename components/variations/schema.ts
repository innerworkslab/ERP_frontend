import * as z from "zod";

export const variationSchema = z.object({
  name: z.string().min(1, "Variation name is required"),
  value_data_type: z.enum(["String", "Number", "Boolean", "Date"]),
  status: z.enum(["active", "inactive"]),
});

export type VariationFormValues = z.infer<typeof variationSchema>;
