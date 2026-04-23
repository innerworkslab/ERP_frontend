import * as yup from "yup";

export const categorySchema = yup
  .object({
    name: yup
      .string()
      .required("Category name is required")
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

export type CategoryFormValues = yup.InferType<typeof categorySchema>;
