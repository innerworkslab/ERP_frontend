"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taxSchema, TaxFormValues } from "./schema";
import { taxService, Tax } from "@/api/taxes.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  taxData?: Tax | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function TaxForm({ taxData, onSuccess, setLoading }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaxFormValues>({
    resolver: yupResolver(taxSchema),
    defaultValues: { status: "active", type: "sale" },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (taxData) {
      reset({
        category: taxData.category,
        code: taxData.code,
        type: taxData.type,
        amount: Number(taxData.amount),
        status: taxData.status,
      });
    }
  }, [taxData, reset]);

  const onSubmit = async (data: TaxFormValues) => {
    const res = taxData
      ? await taxService.update(taxData.id, data)
      : await taxService.create(data);
    if (res) onSuccess();
  };

  return (
    <form id="tax-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="Tax Category"
          placeholder="e.g. Commercial Tax"
          registration={register("category")}
          error={errors.category?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Tax Type"
                options={[
                  { id: "sale", name: "Sale" },
                  { id: "purchase", name: "Purchase" },
                ]}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.type?.message}
              />
            )}
          />
          <FormInput
            label="Amount (%)"
            type="number"
            step="0.01"
            registration={register("amount")}
            error={errors.amount?.message}
          />
        </div>

        <FormSelect
          label="Status"
          value={watch("status")}
          onValueChange={(val) => setValue("status", val as "active" | "inactive")}
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {taxData ? "Update Tax" : "Save Tax"}
        </Button>
      </div>
    </form>
  );
}