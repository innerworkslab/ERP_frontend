import * as z from "zod";

export const priceGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customer_type_id: z.union([
    z.number(),
    z.string().refine((val) => val !== "all", "Customer type is required"),
  ]),
  branch_id: z.array(z.string()).min(1, "At least one branch is required"),
});

export type PriceGroupFormValues = z.infer<typeof priceGroupSchema>;
