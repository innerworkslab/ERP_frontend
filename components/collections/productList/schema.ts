import * as yup from "yup";

export const addProductSchema = yup.object({
  products: yup
    .array()
    .of(
      yup.object({
        product_id: yup
          .number()
          .min(1, "Please select a product")
          .required("Required"),
        product_qty: yup
          .number()
          .typeError("Must be a number")
          .min(1, "Min quantity is 1")
          .required("Required"),
      }),
    )
    .min(1, "Add at least one product")
    .required(),
});

export type AddProductFormValues = yup.InferType<typeof addProductSchema>;
