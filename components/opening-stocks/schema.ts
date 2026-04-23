import * as yup from "yup";

export const openingStockSchema = yup.object({
  inventory_id: yup.number().min(1, "Inventory is required").required(),
  remarks: yup.string().optional(),
  status: yup.string().default("pending"),
  total_amount: yup.number().required(),
  lines: yup
    .array()
    .of(
      yup.object({
        product_id: yup.number().min(1, "Product is required").required(),
        quantity: yup.number().min(0.01, "Qty must be > 0").required(),
        uom_id: yup.number().required(),
        purchase_price: yup.number().min(0).required(),
        subtotal: yup.number().required(),
        lot_no: yup.string().nullable(),
        expired_date: yup.string().nullable(),
        serial_no: yup.string().nullable(),
        remarks: yup.string().nullable(),
      }),
    )
    .min(1, "At least one product line is required"),
});

export type OpeningStockFormValues = yup.InferType<typeof openingStockSchema>;
