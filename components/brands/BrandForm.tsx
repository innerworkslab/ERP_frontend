"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BrandFormValues, brandSchema } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Brand, brandService } from "@/api/brands.service";

interface BrandFormProps {
  brandData?: Brand | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function BrandForm({
  brandData,
  onSuccess,
  setLoading,
}: BrandFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: yupResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (brandData) {
      reset({
        name: brandData.name,
        description: brandData.description || "",
        status: brandData.status as "active" | "inactive",
      });
    } else {
      reset({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [brandData, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    const res = brandData
      ? await brandService.update(brandData.id, data)
      : await brandService.create(data);

    if (res) {
      onSuccess();
    }
  };

  return (
    <form
      id="brand-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Brand Name"
          placeholder="Enter brand name"
          registration={register("name")}
          error={errors.name?.message}
        />

        <FormSelect
          label="Operational Status"
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as "active" | "inactive")
          }
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          error={errors.status?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="Brand Description"
          placeholder="Enter brand description"
          registration={register("description")}
          error={errors.description?.message}
        />
      </div>
    </form>
  );
}
