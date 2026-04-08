import * as yup from "yup";

export const stockTransferSchema = yup.object().shape({
  transfer_date: yup.string().required("Transfer date is required"),
  source_inventory_id: yup
    .number()
    .required("Source warehouse is required")
    .positive("Please select a source warehouse"),
  target_inventory_id: yup
    .number()
    .required("Target warehouse is required")
    .positive("Please select a target warehouse")
    .notOneOf(
      [yup.ref("source_inventory_id")],
      "Source and Target warehouse cannot be the same",
    ),
  remarks: yup.string().nullable(),
  lines: yup
    .array()
    .of(
      yup.object().shape({
        product_id: yup
          .number()
          .required("Product is required")
          .positive("Please select a product"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be greater than 0"),
        uom_id: yup.number().required("Unit is required").positive(),
        remarks: yup.string().nullable(),
      }),
    )
    .min(1, "At least one product is required"),
});

export type StockTransferFormValues = yup.InferType<typeof stockTransferSchema>;
