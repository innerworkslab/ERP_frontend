"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variationSchema, VariationFormValues } from "./schema";
import { variationService, Variation } from "@/api/variations.service";
import { toast } from "sonner";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Label } from "@/components/ui/label";
import { Category, categoryService } from "@/api/categories.service";
import { FormMultiSelect } from "../common/FormMultiSelect";

interface Props {
  initialData?: Variation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VariationForm({
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const isUpdate = !!initialData;
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<VariationFormValues>({
    resolver: zodResolver(variationSchema),
    defaultValues: {
      name: initialData?.name || "",
      value_data_type: initialData?.value_data_type || "String",
      status: initialData?.status || "active",
      product_category_ids:
        initialData?.product_categories?.map((c) => c.id) || [],
    },
  });

  const selectedCategoryIds = watch("product_category_ids").map(String);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll({ status: "active" });
        setCategories(res.data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (values: VariationFormValues) => {
    try {
      if (initialData) {
        await variationService.update(initialData.id, values);
        toast.success("Variation updated successfully");
      } else {
        await variationService.create(values);
        toast.success("Variation created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="Variation Name"
          registration={register("name")}
          error={errors.name?.message}
          placeholder="e.g. Color"
        />

        <div className="space-y-2">
          <FormMultiSelect
            label="Product Categories"
            options={categories.map((cat) => ({
              id: cat.id.toString(),
              name: cat.name,
            }))}
            value={selectedCategoryIds}
            onValueChange={(ids) =>
              setValue("product_category_ids", ids.map(Number), {
                shouldValidate: true,
              })
            }
            placeholder="Select categories..."
            error={errors.product_category_ids?.message}
          />
        </div>

        <FormSelect
          label="Value Data Type"
          options={[
            { id: "String", name: "String" },
            { id: "Number", name: "Number" },
            { id: "Boolean", name: "Boolean" },
            { id: "Date", name: "Date" },
          ]}
          value={watch("value_data_type")}
          onValueChange={(val) =>
            setValue(
              "value_data_type",
              val as VariationFormValues["value_data_type"],
            )
          }
          error={errors.value_data_type?.message}
        />

        <FormSelect
          label="Status"
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as VariationFormValues["status"])
          }
          error={errors.status?.message}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 h-11 rounded-xl bg-primary text-primary-foreground font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 transition-all shadow-md shadow-primary/20"
        >
          {isSubmitting
            ? "Processing..."
            : isUpdate
              ? "Update Variation"
              : "Save Variation"}
        </button>
      </div>
    </form>
  );
}
