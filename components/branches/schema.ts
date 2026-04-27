import * as yup from "yup";

export const branchSchema = yup
  .object({
    prefix: yup.string().required("Prefix is required"),
    name: yup.string().required("Branch name is required"),
    address: yup.string().required("Address is required"),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
    mobile_phones: yup
      .array()
      .of(yup.string().required("Phone number is required"))
      .min(1, "At least one phone number is required")
      .required(),
    email: yup.string().email("Invalid email").nullable(),
    website: yup.string().url("Invalid URL").nullable(),
    facebook: yup.string().nullable(),
    state_id: yup.number().required("State is required"),
    city_id: yup.number().required("City is required"),
    status: yup.string().oneOf(["active", "inactive"]).required(),
  })
  .required();

export type BranchFormValues = yup.InferType<typeof branchSchema>;
