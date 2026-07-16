import * as yup from "yup";

export const deliveryProviderSchema = yup.object().shape({
  name: yup.string().required("Provider name is required"),
  default_price: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value,
    )
    .typeError("Default price must be a valid number")
    .required("Default price is required")
    .min(0, "Price cannot be negative"),
});

export type FormValues = yup.InferType<typeof deliveryProviderSchema>;
