"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uomSchema, UOMFormValues } from "./schema";
import { uomService, UOM } from "@/api/uom.service";
import { toast } from "sonner";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  initialData?: UOM | null;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UomForm({ initialData, onSuccess, setLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UOMFormValues>({
    resolver: zodResolver(uomSchema),
    values: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      status: initialData?.status || "active",
    },
  });

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  const onSubmit = async (values: UOMFormValues) => {
    if (initialData) {
      await uomService.update(initialData.id, values);
      toast.success("UOM updated successfully");
    } else {
      await uomService.create(values);
      toast.success("UOM created successfully");
    }
    onSuccess();
  };

  return (
    <form
      id="uom-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="UOM Name"
          registration={register("name")}
          error={errors.name?.message}
          placeholder="e.g. Kilogram"
        />
        <FormInput
          label="UOM Code"
          registration={register("code")}
          error={errors.code?.message}
          placeholder="e.g. Kg"
        />
        <FormSelect
          label="Status"
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as "active" | "inactive")
          }
        />
      </div>
    </form>
  );
}
