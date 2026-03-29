"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CategoryFormValues, categorySchema } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Category, categoryService } from "@/api/categories.service";

interface CategoryFormProps {
  categoryData?: Category | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function CategoryForm({
  categoryData,
  onSuccess,
  setLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
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
    if (categoryData) {
      reset({
        name: categoryData.name,
        description: categoryData.description || "",
        status: categoryData.status as "active" | "inactive",
      });
    } else {
      reset({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [categoryData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    const res = categoryData
      ? await categoryService.update(categoryData.id, data)
      : await categoryService.create(data);

    if (res) {
      onSuccess();
    }
  };

  return (
    <form
      id="category-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Category Name"
          placeholder="Enter category name"
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
          label="Category Description"
          placeholder="Enter category description"
          registration={register("description")}
          error={errors.description?.message}
        />
      </div>
    </form>
  );
}
