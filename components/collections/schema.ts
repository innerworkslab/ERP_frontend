import * as yup from "yup";

export const collectionSchema = yup.object({
  name: yup.string().required("Name is required"),
  purchase_price: yup
    .number()
    .typeError("Must be a number")
    .required("Required"),
  purchase_currency_id: yup.number().required("Required"),
  purchase_tax_id: yup.number().required("Required"),
  purchase_uom_id: yup.number().required("Required"),
  sale_price: yup.number().typeError("Must be a number").required("Required"),
  sale_currency_id: yup.number().required("Required"),
  sale_tax_id: yup.number().required("Required"),
  sale_uom_id: yup.number().required("Required"),
  status: yup.string().required("Required"),
});

export type CollectionFormValues = yup.InferType<typeof collectionSchema>;
