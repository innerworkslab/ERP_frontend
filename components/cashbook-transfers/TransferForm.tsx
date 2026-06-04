"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cashbookService, CashbookTransferItem } from "@/api/cashbooks.service";
import { currencyService } from "@/api/currencies.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as yup from "yup";

const transferSchema = yup.object({
  source_cashbook_id: yup.number().required(),
  destination_cashbook_id: yup.number().required(),
  amount: yup.number().required(),
  currency_id: yup.number().required(),
  remark: yup.string().optional(),
});

interface Props {
  initialData?: CashbookTransferItem | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function TransferForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [cashbooks, setCashbooks] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(transferSchema),
    defaultValues: {
      remark: "",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (initialData) {
      reset({
        source_cashbook_id: initialData.source_cashbook_id,
        destination_cashbook_id: initialData.destination_cashbook_id,
        currency_id: initialData.currency_id,
        amount: Number(initialData.amount),
        remark: initialData.remark || "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cbRes, currRes] = await Promise.all([
          cashbookService.getAll(),
          currencyService.getAll(),
        ]);
        if (cbRes?.data)
          setCashbooks(
            cbRes.data.map((c) => ({
              id: c.id.toString(),
              name: `${c.name} (${c.currency?.symbol || ""})`,
            })),
          );
        if (currRes?.data)
          setCurrencies(
            currRes.data.map((c) => ({
              id: c.id.toString(),
              name: `${c.name} (${c.symbol})`,
            })),
          );
      } catch (err) {
        toast.error("Failed to load options");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const result = initialData
        ? await cashbookService.updateTransfer(initialData.id, data)
        : await cashbookService.createTransfer(data);

      if (result?.response?.status === "error") {
        toast.error(result.response.message || "Operation failed");
        return;
      }

      toast.success("Transfer posted successfully");
      onSuccess();
    } catch (err) {
      toast.error("Execution processing error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="source_cashbook_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Source Cashbook"
              options={cashbooks}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.source_cashbook_id?.message}
            />
          )}
        />
        <Controller
          name="destination_cashbook_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Destination Cashbook"
              options={cashbooks}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.destination_cashbook_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="currency_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Currency"
              options={currencies}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.currency_id?.message}
            />
          )}
        />
        <FormInput
          type="number"
          label="Amount"
          registration={register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
          step="0.01"
        />
      </div>

      <FormInput
        label="Remark"
        type="textarea"
        registration={register("remark")}
        error={errors.remark?.message}
      />

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] rounded-2xl"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Post Transfer"
          )}
        </Button>
      </div>
    </form>
  );
}
