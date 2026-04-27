import * as yup from "yup";

export const roleSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name is too short")
    .required("Role name is required"),

  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),

  department_id: yup
    .number()
    .typeError("Please select a department")
    .required("Department is required")
    .min(1, "Please select a department"),

  parent_role_id: yup
    .number()
    .nullable()
    .transform((v) => (v === 0 || v === "" ? null : v))
    .default(null),
});

export type RoleFormValues = yup.InferType<typeof roleSchema>;
