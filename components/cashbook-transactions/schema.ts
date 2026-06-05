import { renderToStaticMarkup } from "react-dom/server";
import * as yup from "yup";

export const transactionSchema = yup
  .object({
    source_account_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("The source account id field is required.")
      .positive(),
    destination_account_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("The destination account id field is required.")
      .positive()
      .notOneOf(
        [yup.ref("source_account_id")],
        "Source and destination accounts cannot be identical",
      ),
    currency_id: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Currency selection is required")
      .positive(),
    category: yup.string().required("The selected category is invalid."),
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .required("Transfer amount is required")
      .positive("Amount must be greater than zero"),
    description: yup.string().nullable().notRequired(),
    attachments: yup
      .mixed()
      .transform((value, originalValue) => {
        if (originalValue instanceof FileList) return Array.from(originalValue);
        if (originalValue && typeof originalValue === "object")
          return Object.values(originalValue);
        return value;
      })
      .nullable()
      .notRequired(),
  })
  .required();

export type TransactionFormValues = yup.InferType<typeof transactionSchema> & {
  existing_attachment?: any[];
};
