import * as yup from "yup";

export const deliveryNoteSchema = yup.object({
  sale_invoice_id: yup.number().required("Invoice is required"),
  delivery_provider_id: yup.number().required("Provider is required"),
  delivery_date: yup.string().required("Date is required"),
  receiver_name: yup.string().required("Required"),
  receiver_phone: yup.string().required("Required"),
  receiver_address: yup.string().required("Required"),
  items: yup
    .array()
    .of(
      yup.object({
        sale_invoice_item_id: yup.number().required(),
        product_id: yup.number().required(),
        quantity: yup.number().required(),
        remark: yup.string(),
      }),
    )
    .min(1, "At least one item required"),
});

export type FormValues = yup.InferType<typeof deliveryNoteSchema>;
