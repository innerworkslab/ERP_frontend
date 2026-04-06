import * as yup from "yup";

export const inventorySchema = yup
  .object({
    name: yup.string().required("Inventory name is required"),
    branch_ids: yup
      .array()
      .of(yup.number())
      .min(1, "Select at least one branch")
      .required("Branches are required"),
  })
  .required();

export type InventoryFormValues = yup.InferType<typeof inventorySchema>;
