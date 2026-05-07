import * as z from "zod";

export const variationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value_data_type: z.enum(["String", "Number", "Boolean", "Date"]),
  status: z.enum(["active", "inactive"]),
  product_category_ids: z
    .array(z.number())
    .min(1, "Select at least one category"),
});

export type VariationFormValues = z.infer<typeof variationSchema>;
