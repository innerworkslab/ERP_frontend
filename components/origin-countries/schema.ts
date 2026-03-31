import * as yup from "yup";

export const originCountrySchema = yup
  .object({
    name: yup.string().required("Country name is required"),
  })
  .required();

export type OriginCountryFormValues = yup.InferType<typeof originCountrySchema>;
