import * as yup from "yup";

export const productSchema = yup
  .object({
    name: yup.string().required("Product name is required"),
    sku: yup.string().required("SKU is required"),
    category_id: yup.number().min(1, "Category is required").required(),
    brand_id: yup.number().min(1, "Brand is required").required(),
    origin_country_id: yup
      .number()
      .min(1, "Origin country is required")
      .required(),
    alert_quantity: yup.number().required(),
    purchase_price: yup.number().required(),
    purchase_currency_id: yup.number().required(),
    purchase_tax_id: yup.number().required(),
    purchase_uom_id: yup.number().required(),
    sale_price: yup.number().required(),
    sale_currency_id: yup.number().required(),
    sale_tax_id: yup.number().required(),
    sale_uom_id: yup.number().required(),
    status: yup.string().oneOf(["active", "inactive"]).required(),
    image: yup.mixed().optional(),
  })
  .required();

export type ProductFormValues = yup.InferType<typeof productSchema>;
