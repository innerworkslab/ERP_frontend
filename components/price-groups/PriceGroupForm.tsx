"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { toast } from "sonner";
import { PriceGroup, priceGroupService } from "@/api/priceGroups.service";
import { PriceGroupFormValues, priceGroupSchema } from "./schema";

interface Props {
  initialData?: PriceGroup | null;
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
  } = useForm<PriceGroupFormValues>({
    resolver: zodResolver(priceGroupSchema),
    defaultValues: {
      name: initialData?.name || "",
      branch_id: initialData?.branch_id || "",
      customer_type_id: initialData?.customer_type_id || "",
    },
  });

  const onSubmit = async (values: PriceGroupFormValues) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        branch_id: Number(values.branch_id),
        customer_type_id: Number(values.customer_type_id),
      };

      if (initialData) {
        await priceGroupService.update(initialData.id, payload);
        toast.success("Price group updated");
      } else {
        await priceGroupService.create(payload);
        toast.success("Price group created");
      }
      onSuccess();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="price-group-form"
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
