import * as yup from "yup";

export const customerSchema = yup.object({
  name: yup.string().required("Name is required"),
  company_name: yup.string().required("Company name is required"),
  phone_number: yup.string().required("Phone number is required"),
  state_id: yup.number().required("State is required"),
  city_id: yup.number().required("City is required"),
  address: yup.string().required("Address is required"),
  branch_id: yup.number().required("Branch is required"),
  credit_limit: yup.number().required(),
  opening: yup.number().required(),
  customer_type_id: yup.number().required("Type is required"),
  birthday: yup.string().nullable(),
  status: yup.string().required(),
  bank_accounts: yup.array().of(
    yup.object({
      bank_name: yup.string().required("Bank name is required"),
      account_number: yup.string().required("Account number is required"),
      holder_name: yup.string().required("Holder name is required"),
    }),
  ),
});
