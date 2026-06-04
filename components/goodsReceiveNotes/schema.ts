import * as yup from "yup";

export const grnSchema = yup
  .object({
    purchase_order_id: yup.string().required("Required"),
    supplier_id: yup.string().required("Required"),
    branch_id: yup.string().required("Required"),
    inventory_id: yup.string().required("Required"),
    currency_id: yup.string().required("Required"),
    grn_date: yup.string().required("Required"),
    fee_allocation_method: yup.string().required("Required"),
    tax_allocation_method: yup.string().required("Required"),
    cargo_tax_amount: yup.number().typeError("Must be a number").default(0),
    discount_amount: yup.number().typeError("Must be a number").default(0),
    remarks: yup.string().optional().nullable(),
    lines: yup
      .array()
      .of(
        yup
          .object({
            purchase_order_line_id: yup.number().required("Required"),
            product_id: yup.number().required("Required"),
            uom_id: yup.number().required("Required"),
            ordered_quantity: yup
              .number()
              .typeError("Must be a number")
              .required("Required"),
            received_quantity: yup
              .number()
              .typeError("Must be a number")
              .required("Required"),
            good_quantity: yup
              .number()
              .typeError("Must be a number")
              .required("Required"),
            unit_price: yup
              .number()
              .typeError("Must be a number")
              .required("Required"),
            line_weight: yup.number().typeError("Must be a number").default(0),
            manual_tax_amount: yup
              .number()
              .typeError("Must be a number")
              .default(0),
            discrepancy_reason: yup.string().default("none"),
            defect_responsibility: yup.string().default("none"),
            remarks: yup.string().optional().nullable(),
          })
          .required(),
      )
      .default([]),
    charges: yup
      .array()
      .of(
        yup
          .object({
            charge_type: yup.string().required("Required"),
            currency_id: yup.number().required("Required"),
            amount: yup
              .number()
              .typeError("Must be a number")
              .required("Required"),
            description: yup.string().optional().nullable(),
          })
          .required(),
      )
      .default([]),
  })
  .required();

export type GrnFormValues = yup.InferType<typeof grnSchema>;
