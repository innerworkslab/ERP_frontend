import * as yup from "yup";

const numberField = (label: string) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value,
    )
    .typeError(`${label} must be a number`)
    .required(`${label} is required`);

const optionalNumberField = (label: string) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value,
    )
    .typeError(`${label} must be a number`)
    .optional()
    .nullable();

export const productSchema = yup
  .object({
    name: yup.string().required("Product name is required"),
    sku: yup.string().nullable(),

    category_id: numberField("Category").min(1, "Category is required"),
    brand_id: numberField("Brand").min(1, "Brand is required"),
    origin_country_id: numberField("Origin country").min(
      1,
      "Origin country is required",
    ),

    conversion_uom_id: optionalNumberField("Conversion UOM"),

    alert_quantity: numberField("Alert quantity"),

    purchase_price: optionalNumberField("Purchase price"),
    purchase_currency_id: numberField("Purchase currency"),
    purchase_tax_id: optionalNumberField("Purchase tax"),
    purchase_uom_id: numberField("Purchase UOM"),

    stock_uom_id: numberField("Stock UOM"),

    sale_price: optionalNumberField("Sale price"),
    sale_currency_id: numberField("Sale currency"),
    sale_tax_id: optionalNumberField("Sale tax"),
    sale_uom_id: numberField("Sale UOM"),

    status: yup
      .string()
      .oneOf(["active", "inactive"])
      .required("Status is required"),

    image: yup.mixed().optional(),
    variations: yup.array().of(
      yup.object().shape({
        variation_id: yup.number().required(),
        variation_value: yup.string().required(),
      }),
    ),
  })
  .required();

export type ProductFormValues = yup.InferType<typeof productSchema>;
