import * as yup from "yup";

export const purchaseReturnSchema = yup.object().shape({
  goods_receive_note_id: yup
    .number()
    .typeError("Target Goods Receive Note is required")
    .required("Target Goods Receive Note is required")
    .positive()
    .integer(),
  return_date: yup.string().required("Return execution date is required"),
  return_type: yup.string().required("Return classification type is required"),
  exchange_type: yup
    .string()
    .nullable()
    .optional()
    .when("return_type", {
      is: "exchange",
      then: (schema) =>
        schema.required("Exchange scope specification is required"),
      otherwise: (schema) => schema.nullable().optional(),
    }),
  remarks: yup.string().nullable().optional(),
  lines: yup
    .array()
    .of(
      yup.object().shape({
        goods_receive_note_line_id: yup
          .number()
          .typeError("Item choice required")
          .required("Item choice required")
          .positive()
          .integer(),
        return_quantity: yup
          .number()
          .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? undefined : value,
          )
          .typeError("Quantity must be a valid number")
          .required("Qty required")
          .min(1, "Must return at least 1 unit"),
        reason: yup.string().required("Reason required"),
        remarks: yup.string().nullable().optional(),
        unit_price: yup.number().optional(),
        tax_amount: yup.number().optional(),
        line_total: yup.number().optional(),
      }),
    )
    .required()
    .min(1, "At least one row item must be returned"),
});

export type PurchaseReturnFormValues = yup.InferType<
  typeof purchaseReturnSchema
>;
