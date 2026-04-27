import * as yup from "yup";

export const departmentSchema = yup
  .object({
    code: yup
      .string()
      .required("Code is required")
      .min(2, "Min 2 characters")
      .max(10, "Max 10 characters"),
    name: yup
      .string()
      .required("Department name is required")
      .min(3, "Name is too short"),
    branch_id: yup
      .number()
      .min(1, "Branch is required")
      .required("Branch is required"),
    status: yup
      .string()
      .oneOf(["active", "inactive"], "Invalid status")
      .required("Status is required"),
  })
  .required();
