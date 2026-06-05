import * as yup from "yup";

export const adjustmentSchema = yup.object({
  cashbook_id: yup.string().required("Cashbook is required"),
  type: yup.string().oneOf(["increase", "decrease"]).required(),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  reason: yup.string().required("Reason is required"),
});

export type AdjustmentFormValues = yup.InferType<typeof adjustmentSchema>;
