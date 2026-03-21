import * as yup from "yup";

export const staffSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  password: yup.string().min(6).required("Password is required"),

  role_id: yup.number().required("Role is required"),
  branch_id: yup.number().required("Branch is required"),
  department_id: yup.number().required("Department is required"),

  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),

  personal_information: yup.object({
    date_of_birth: yup.string().required("Date of birth is required"),
    nrc_number: yup.string().required("NRC number is required"),
    father_name: yup.string().required("Father name is required"),
    mother_name: yup.string().required("Mother name is required"),
    town: yup.string().required("Town is required"),
    township: yup.string().required("Township is required"),
    address: yup.string().required("Address is required"),

    nrc_image: yup
      .mixed<FileList>()
      .test("required", "NRC image is required", (value) => {
        return value && value.length > 0;
      }),

    house_hold_information_image: yup
      .mixed<FileList>()
      .test("required", "Household image is required", (value) => {
        return value && value.length > 0;
      }),
  }),

  employment_information: yup.object({
    join_date: yup.string().required("Join date is required"),

    is_contract: yup
      .number()
      .oneOf([0, 1])
      .required("Contract type is required"),

    off_day: yup.string().required("Off day is required"),

    overtime_fee_type: yup
      .string()
      .oneOf(["hourly", "daily", "monthly"])
      .required("Overtime type is required"),

    salary: yup
      .number()
      .typeError("Salary must be a number")
      .required("Salary is required"),

    sale_incentive_amount: yup
      .number()
      .typeError("Incentive must be a number")
      .required("Sale incentive is required"),

    sale_commission: yup
      .number()
      .typeError("Commission must be a number")
      .required("Sale commission is required"),
  }),

  banking_information: yup.object({
    bank_name: yup.string().required("Bank name is required"),
    account_number: yup.string().required("Account number is required"),
  }),
});
