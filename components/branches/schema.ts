import * as yup from "yup";

export const branchSchema = yup
  .object({
    prefix: yup
      .string()
      .required("Prefix is required")
      .min(2, "Min 2 characters")
      .max(5, "Max 5 characters")
      .matches(/^[A-Z0-9]+$/, "Must be uppercase alphanumeric"),
    name: yup
      .string()
      .required("Branch name is required")
      .min(3, "Name is too short"),
    location: yup
      .string()
      .required("Location is required")
      .min(5, "Please provide a more detailed location"),
    status: yup
      .string()
      .oneOf(["active", "inactive"], "Invalid status")
      .required("Status is required"),
  })
  .required();
