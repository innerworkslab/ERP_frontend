import * as z from "zod";

export const priceGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customer_type_id: z.union([
    z.number(),
    z.string().refine((val) => val !== "all", "Customer type is required"),
  ]),
  branch_id: z.union([
    z.number(),
    z.string().refine((val) => val !== "all", "Branch is required"),
  ]),
});

export type PriceGroupFormValues = z.infer<typeof priceGroupSchema>;
