"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { cashbookService, CashbookAdjustment } from "@/api/cashbooks.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdjustmentFormValues, adjustmentSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  adjustmentData?: CashbookAdjustment | null;
  onSuccess: () => void;
}

export default function AdjustmentForm({ adjustmentData, onSuccess }: Props) {
  const [cashbooks, setCashbooks] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustmentFormValues>({
    resolver: yupResolver(adjustmentSchema),
    defaultValues: {
      cashbook_id: "",
      type: "increase",
      amount: 0,
      reason: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await cashbookService.getAll();
        if (res?.data) {
          setCashbooks(
            res.data.map((c) => ({
              id: c.id.toString(),
              name: `${c.name} (${c.currency?.symbol || ""})`,
            })),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (adjustmentData) {
      reset({
        cashbook_id: adjustmentData.cashbook_id.toString(),
        type: adjustmentData.type,
        amount: Number(adjustmentData.amount),
        reason: adjustmentData.reason,
      });
    }
  }, [adjustmentData, reset]);

  const onSubmit = async (data) => {
    const payload = {
      cashbook_id: Number(data.cashbook_id),
      type: data.type as "increase" | "decrease",
      amount: data.amount,
      reason: data.reason,
    };

    const result = adjustmentData
      ? await cashbookService.updateAdjustment(adjustmentData.id, payload)
      : await cashbookService.createAdjustment(payload);

    if (result?.response?.status === "error") {
      toast.error(result.response.message || "Operation failed");
      return;
    }

    toast.success(result?.response?.message || "Success");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="cashbook_id"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <FormSelect
              label="Select Cashbook"
              options={cashbooks}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.cashbook_id?.message}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Adjustment Type"
              options={[
                { id: "increase", name: "Increase" },
                { id: "decrease", name: "Decrease" },
              ]}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.type?.message}
            />
          )}
        />

        <FormInput
          type="number"
          label="Amount"
          registration={register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
          step="0.01"
          placeholder="0.00"
        />

        <div className="col-span-full">
          <FormInput
            label="Reason"
            type="textarea"
            placeholder="Reason..."
            registration={register("reason", { required: "Required" })}
            error={errors.reason?.message}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] rounded-2xl shadow-xl shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : adjustmentData ? (
            "Save Changes"
          ) : (
            "Process Adjustment"
          )}
        </Button>
      </div>
    </form>
  );
}
