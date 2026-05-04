import * as yup from "yup";

export const staffSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  permission_ids: yup.array().of(yup.number()).default([]),
  password: yup.string().when(["$isUpdate"], {
    is: (isUpdate: boolean) => !isUpdate,
    then: (schema) =>
      schema
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  role_id: yup.number().required("Role is required"),
  branch_id: yup
    .array()
    .of(yup.number())
    .min(1, "Select at least one branch")
    .required("Branch is required"),
  department_id: yup.number().required("Department is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
  personal_information: yup.object({
    date_of_birth: yup.string().required("Date of birth is required"),
    nrc_code_prefix: yup.string().required("Required"),
    nrc_code: yup.string().required("Required"),
    nrc_type: yup.string().required("Required"),
    id_number: yup
      .string()
      .required("Required")
      .matches(/^\d{6}$/, "Must be 6 digits"),
    father_name: yup.string().required("Father name is required"),
    mother_name: yup.string().required("Mother name is required"),
    town: yup.string().required("Town is required"),
    township: yup.string().required("Township is required"),
    address: yup.string().required("Address is required"),
    nrc_image: yup
      .mixed()
      .test("required", "NRC image is required", (value) => {
        if (typeof value === "string") return true;
        return value instanceof FileList && value.length > 0;
      }),
    house_hold_information_image: yup
      .mixed()
      .test("required", "Household image is required", (value) => {
        if (typeof value === "string") return true;
        return value instanceof FileList && value.length > 0;
      }),
  }),
  employment_information: yup.object({
    join_date: yup.string().required("Join date is required"),
    is_contract: yup.number().oneOf([0, 1]).required("Required"),
    off_day: yup.string().required("Off day is required"),
    overtime_fee_type: yup
      .string()
      .oneOf(["hourly", "daily", "monthly"])
      .required("Required"),
    salary: yup.number().typeError("Must be a number").required("Required"),
    sale_incentive_amount: yup
      .number()
      .typeError("Must be a number")
      .required("Required"),
    sale_commission: yup
      .number()
      .typeError("Must be a number")
      .required("Required"),
  }),
  banking_information: yup.object({
    bank_name: yup.string().required("Bank name is required"),
    account_number: yup.string().required("Account number is required"),
  }),
});
