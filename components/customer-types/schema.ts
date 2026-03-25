import * as z from "zod";

export const customerTypeSchema = z.object({
  name: z.string().min(1, "Customer type name is required"),
});

export type CustomerTypeFormValues = z.infer<typeof customerTypeSchema>;
