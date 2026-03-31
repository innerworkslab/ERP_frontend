import * as yup from "yup";

export const taxSchema = yup
  .object({
    category: yup.string().required("Tax category is required"),
    code: yup.string().optional(),
    type: yup.string().oneOf(["sale", "purchase"]).required("Type is required"),
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .required("Amount is required"),
    status: yup.string().oneOf(["active", "inactive"]).required(),
  })
  .required();

export type TaxFormValues = yup.InferType<typeof taxSchema>;
