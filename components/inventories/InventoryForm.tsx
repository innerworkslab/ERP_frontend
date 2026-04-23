"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inventorySchema, InventoryFormValues } from "./schema";
import { Inventory, inventoryService } from "@/api/inventories.service";
import { branchService } from "@/api/branches.service";
import { FormInput } from "@/components/common/FormInput";
import { FormMultiSelect } from "../common/FormMultiSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialData?: Inventory | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function InventoryForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      name: "",
      branch_ids: [],
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  // ✅ load branches + set initial data
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await branchService.getAll();

        setBranches(
          res.data.map((b) => ({
            id: b.id.toString(),
            name: b.name,
          })),
        );

        if (initialData) {
          reset({
            name: initialData.name,
            branch_ids: initialData.branches.map((b) => b.id),
          });
        }
      } catch (err) {
        toast.error("Failed to load branches");
      }
    };

    loadBranches();
  }, [initialData, reset]);

  const onSubmit = async (data: InventoryFormValues) => {
    const payload = {
      name: data.name,
      branch_ids: data.branch_ids as number[],
    };

    const res = initialData
      ? await inventoryService.update(initialData.id, payload)
      : await inventoryService.create(payload);

    if (res) {
      toast.success(`Inventory ${initialData ? "updated" : "created"}`);
      onSuccess();
    }
  };

  return (
    <form
      id="inventory-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 py-2"
    >
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Inventory Name"
          registration={register("name")}
          error={errors.name?.message}
          placeholder="e.g. Central Warehouse"
        />

        <Controller
          name="branch_ids"
          control={control}
          render={({ field }) => (
            <FormMultiSelect
              label="Assign Branches"
              options={branches}
              value={field.value.map(String)}
              onValueChange={(vals) => field.onChange(vals.map(Number))}
              error={errors.branch_ids?.message}
              placeholder="Select one or more branches"
            />
          )}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Update Inventory"
          ) : (
            "Create Inventory"
          )}
        </Button>
      </div>
    </form>
  );
}
