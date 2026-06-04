import * as yup from "yup";

export const transferSchema = yup
  .object({
    source_account_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Source account is required")
      .positive("Invalid source account"),
    destination_account_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Destination account is required")
      .positive("Invalid destination account"),
    currency_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Currency is required")
      .positive("Invalid currency"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be a positive number"),
    description: yup.string().nullable().notRequired(),
  })
  .required();

export type TransferFormValues = yup.InferType<typeof transferSchema>;

export const cashbookSchema = yup
  .object({
    name: yup
      .string()
      .required("Account name is required")
      .min(3, "Name must be at least 3 characters"),
    branch_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Branch allocation is required")
      .positive("Invalid branch context"),
    currency_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Account functional currency is required")
      .positive("Invalid currency context"),
    type: yup
      .string()
      .oneOf(
        ["cash", "bank", "mobile_wallet", "petty_cash"],
        "Invalid account type classification",
      )
      .required("Account type is required"),
    status: yup
      .string()
      .oneOf(["active", "inactive"])
      .required("Status choice is required"),
    remark: yup.string().nullable().notRequired(),
  })
  .required();

export type CashbookFormValues = yup.InferType<typeof cashbookSchema>;
