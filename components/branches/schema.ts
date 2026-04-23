import * as yup from "yup";

export const branchSchema = yup
  .object({
    prefix: yup.string().required("Prefix is required"),
    name: yup.string().required("Branch name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().required("Mobile is required"),
    alternate_phone: yup.string().nullable(),
    website: yup.string().url("Invalid URL").nullable(),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
    state_id: yup.number().required("State is required"),
    city_id: yup.number().required("City is required"),
    default_selling_price_group_id: yup
      .number()
      .required("Price group is required"),
    status: yup.string().oneOf(["active", "inactive"]).required(),
  })
  .required();

export type BranchFormValues = yup.InferType<typeof branchSchema>;
