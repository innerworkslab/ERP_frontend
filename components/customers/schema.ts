import * as yup from "yup";

export const customerSchema = yup.object({
  name: yup.string().required("Customer name is required"),
  company_name: yup.string().required("Company name is required"),
  phone_number: yup.string().required("Phone number is required"),
  country: yup.string().required("Country is required"),
  town: yup.string().required("Town is required"),
  township: yup.string().required("Township is required"),
  address: yup.string().required("Address is required"),
  bank_acc: yup.string().nullable(),
  branch_id: yup.number().required("Branch is required"),
  credit_limit: yup.number().required(),
  opening: yup.number().required(),
  type: yup.string().required(),
  birthday: yup.string().nullable(),
  payment_terms: yup.string().nullable(),
  payment_due: yup.string().nullable(),
  status: yup.string().required(),
});
