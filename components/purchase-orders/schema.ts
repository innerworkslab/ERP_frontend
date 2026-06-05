import * as yup from "yup";

export const purchaseSchema = yup
  .object({
    po_date: yup.string().required("Order placement date is required"),
    supplier_id: yup
      .number()
      .typeError("Supplier selection is required")
      .required("Supplier selection is required")
      .positive(),
    branch_id: yup
      .number()
      .typeError("Operational unit branch is required")
      .required("Operational unit branch is required")
      .positive(),
    inventory_id: yup
      .number()
      .typeError("Target warehouse destination is required")
      .required("Target warehouse destination is required")
      .positive(),
    currency_id: yup
      .number()
      .typeError("Valuation currency is required")
      .required("Valuation currency is required")
      .positive(),
    subtotal_amount: yup
      .number()
      .typeError("Must be a number")
      .required()
      .min(0),
    discount_amount: yup
      .number()
      .typeError("Must be a number")
      .required()
      .min(0),
    tax_amount: yup.number().typeError("Must be a number").required().min(0),
    total_amount: yup.number().typeError("Must be a number").required().min(0),
    remarks: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .notRequired(),
    lines: yup
      .array()
      .of(
        yup.object({
          product_id: yup
            .number()
            .typeError("Required")
            .required("Required")
            .positive(),
          uom_id: yup
            .number()
            .typeError("Required")
            .required("Required")
            .positive(),
          quantity: yup
            .number()
            .typeError("Must be a number")
            .required("Required")
            .positive("Must be greater than 0"),
          unit_price: yup
            .number()
            .typeError("Must be a number")
            .required("Required")
            .min(0),
          discount_type: yup.string().oneOf(["fixed", "percentage"]).required(),
          discount_value: yup
            .number()
            .typeError("Must be a number")
            .required()
            .min(0),
          discount_amount: yup
            .number()
            .typeError("Must be a number")
            .required()
            .min(0),
          tax_id: yup
            .number()
            .typeError("Required")
            .required("Required")
            .positive(),
          tax_amount: yup
            .number()
            .typeError("Must be a number")
            .required()
            .min(0),
          expenses_type: yup
            .string()
            .oneOf(["none", "transport", "other"])
            .required(),
          expenses_amount: yup
            .number()
            .typeError("Must be a number")
            .required()
            .min(0),
          total_amount: yup
            .number()
            .typeError("Must be a number")
            .required()
            .min(0),
        }),
      )
      .min(1, "At least one resource line must be listed"),
  })
  .required();

export type PurchaseFormValues = yup.InferType<typeof purchaseSchema>;
