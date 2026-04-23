import { z } from "zod";

export const discountGroupSchema = z.object({
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

export type DiscountGroupFormValues = z.infer<typeof discountGroupSchema>;
