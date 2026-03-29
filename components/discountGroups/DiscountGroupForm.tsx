"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { toast } from "sonner";
import { DiscountGroupFormValues, discountGroupSchema } from "./schema";
import {
  DiscountGroup,
  discountGroupService,
} from "@/api/discountGroups.service";

interface Props {
  initialData?: DiscountGroup | null;
  onSuccess: () => void;
  setLoading: (loading: boolean) => void;
  branches: Option[];
  customerTypes: Option[];
}

export default function PriceGroupForm({
  initialData,
  onSuccess,
  setLoading,
  branches,
  customerTypes,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DiscountGroupFormValues>({
    resolver: zodResolver(discountGroupSchema),
    defaultValues: {
      name: initialData?.name || "",
      branch_id: initialData?.branch_id || "",
      customer_type_id: initialData?.customer_type_id || "",
    },
  });

  const onSubmit = async (values: DiscountGroupFormValues) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        branch_id: Number(values.branch_id),
        customer_type_id: Number(values.customer_type_id),
      };

      if (initialData) {
        await discountGroupService.update(initialData.id, payload);
        toast.success("Discount group updated");
      } else {
        await discountGroupService.create(payload);
        toast.success("Discount group created");
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="discount-group-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">Group Name</label>
        <input
          {...register("name")}
          className="w-full h-11 px-3 rounded-xl border bg-background"
          placeholder="Enter group name"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <FormSelect
        label="Branch"
        options={branches.filter((b) => String(b.id) !== "all")}
        value={watch("branch_id").toString()}
        onValueChange={(val) => setValue("branch_id", val)}
      />

      <FormSelect
        label="Customer Type"
        placeholder={
          customerTypes.length > 0 ? "Select Type" : "Loading types..."
        }
        options={customerTypes}
        value={watch("customer_type_id")?.toString()}
        onValueChange={(val) =>
          setValue("customer_type_id", val, { shouldValidate: true })
        }
      />
    </form>
  );
}
