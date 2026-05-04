"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { toast } from "sonner";
import { PriceGroup, priceGroupService } from "@/api/priceGroups.service";
import { PriceGroupFormValues, priceGroupSchema } from "./schema";
import { FormMultiSelect } from "../common/FormMultiSelect";

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
    reset,
  } = useForm<PriceGroupFormValues>({
    resolver: zodResolver(priceGroupSchema),
    defaultValues: {
      name: "",
      branch_id: [],
      customer_type_id: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        branch_id: initialData.branches?.map((b) => b.id.toString()) || [],
        customer_type_id: initialData.customer_type_id.toString(),
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values: PriceGroupFormValues) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        branch_id: values.branch_id.map((id) => Number(id)),
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
          className="w-full h-11 px-3 rounded-xl border bg-background transition-all focus:ring-2 focus:ring-primary/10 outline-none"
          placeholder="Enter group name"
        />
        {errors.name && (
          <p className="text-[10px] font-bold text-destructive uppercase italic ml-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <FormMultiSelect
        label="Branch"
        options={branches.filter((b) => String(b.id) !== "all")}
        value={watch("branch_id") || []}
        onValueChange={(val) =>
          setValue("branch_id", val, { shouldValidate: true })
        }
        error={errors.branch_id?.message}
      />

      <FormSelect
        label="Customer Type"
        placeholder={customerTypes.length > 0 ? "Select Type" : "Loading..."}
        options={customerTypes}
        value={watch("customer_type_id")?.toString()}
        onValueChange={(val) =>
          setValue("customer_type_id", val, { shouldValidate: true })
        }
        error={errors.customer_type_id?.message}
      />
    </form>
  );
}
