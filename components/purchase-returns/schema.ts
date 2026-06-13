import * as yup from "yup";

export const purchaseReturnSchema = yup.object().shape({
  goods_receive_note_id: yup
    .number()
    .required("Target Goods Receive Note is required")
    .positive()
    .integer(),
  return_date: yup.string().required("Return execution date is required"),
  return_type: yup.string().required("Return classification type is required"),
  remarks: yup.string().nullable().optional(),
  lines: yup
    .array()
    .of(
      yup.object().shape({
        goods_receive_note_line_id: yup
          .number()
          .required()
          .positive()
          .integer(),
        return_quantity: yup
          .number()
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
