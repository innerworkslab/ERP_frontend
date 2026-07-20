import * as yup from "yup";

export const saleInvoiceSchema = yup.object().shape({
  cashbook_id: yup
    .number()
    .typeError("Cashbook is required")
    .moreThan(0, "Cashbook is required"),
  branch_id: yup
    .number()
    .typeError("Branch is required")
    .moreThan(0, "Branch is required"),
  inventory_id: yup
    .number()
    .typeError("Inventory storage is required")
    .moreThan(0, "Inventory storage is required"),
  customer_id: yup
    .number()
    .typeError("Customer is required")
    .moreThan(0, "Customer is required"),
  currency_id: yup
    .number()
    .typeError("Currency is required")
    .moreThan(0, "Currency is required"),
  selling_price_group_id: yup
    .number()
    .typeError("Selling price group is required")
    .moreThan(0, "Selling price group is required"),
  inventory_transaction_method: yup
    .string()
    .required("Transaction method is required"),
  invoice_date: yup.string().required("Invoice date is required"),
  payment_terms: yup.string().required("Payment terms are required"),
  payment_due_date: yup.string().required("Payment due date is required"),
  status: yup.string().required("Status is required"),
  remarks: yup.string().nullable().optional(),
  sell_tax_id: yup
    .number()
    .typeError("Tax configuration is required")
    .moreThan(0, "Tax configuration is required"),
  invoice_discount_type: yup.string().required("Discount type is required"),
  invoice_discount_amount: yup
    .number()
    .typeError("Discount amount must be a number")
    .min(0, "Discount cannot be negative")
    .required("Discount amount is required"),
  paid_amount: yup
    .number()
    .typeError("Paid amount must be a number")
    .min(0, "Paid amount cannot be negative")
    .required("Paid amount is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        product_id: yup
          .number()
          .typeError("Product is required")
          .moreThan(0, "Product is required"),
        uom_id: yup
          .number()
          .typeError("UOM is required")
          .moreThan(0, "UOM is required"),
        quantity: yup
          .number()
          .typeError("Quantity must be a number")
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        unit_price: yup
          .number()
          .typeError("Unit price must be a number")
          .min(0, "Unit price cannot be negative")
          .required("Unit price is required"),
        discount_type: yup.string().required("Line discount type is required"),
        discount_amount: yup
          .number()
          .typeError("Line discount must be a number")
          .min(0, "Line discount cannot be negative")
          .required("Line discount is required"),
        remarks: yup.string().nullable().optional(),
      }),
    )
    .min(1, "At least one line item is required")
    .required("Items are required"),
  delivery: yup.object().shape({
    delivery_provider_id: yup
      .number()
      .typeError("Delivery provider is required")
      .moreThan(0, "Delivery provider is required"),
    delivery_charge_paid: yup
      .string()
      .required("Delivery charge payment terms are required"),
    delivery_charge: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .when("delivery_charge_paid", {
        is: "shipper",
        then: (schema) =>
          schema
            .required("Delivery charge is required.")
            .min(0, "Delivery charge cannot be negative."),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
    receiver_name: yup.string().required("Receiver name is required"),
    receiver_phone: yup.string().required("Receiver phone is required"),
    receiver_address: yup.string().required("Receiver address is required"),
    receiver_note: yup.string().nullable().optional(),
  }),
});

export type SaleInvoiceFormValues = yup.InferType<typeof saleInvoiceSchema>;
