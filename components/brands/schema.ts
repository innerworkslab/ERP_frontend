import * as yup from "yup";

export const brandSchema = yup
  .object({
    name: yup
      .string()
      .required("Brand name is required")
      .min(3, "Name is too short"),
    description: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test(
        "min-length",
        "Please provide a more detailed description",
        (value) => {
          if (!value) return true;
          return value.length >= 5;
        },
      ),
    status: yup
      .string()
      .oneOf(["active", "inactive"], "Invalid status")
      .required("Status is required"),
  })
  .required();

export type BrandFormValues = yup.InferType<typeof brandSchema>;
