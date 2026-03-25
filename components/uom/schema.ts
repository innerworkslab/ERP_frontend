import { z } from "zod";

export const uomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  status: z.enum(["active", "inactive"]),
});

export type UOMFormValues = z.infer<typeof uomSchema>;

