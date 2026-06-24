/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema, TransactionFormValues } from "./schema";
import { cashbookService, CashbookTransaction } from "@/api/cashbooks.service";
import { currencyService } from "@/api/currencies.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { FileInput } from "@/components/common/FileInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  transactionData?: CashbookTransaction | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function TransactionForm({
  transactionData,
  onSuccess,
  setLoading,
}: Props) {
  const [cashbooks, setCashbooks] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: yupResolver(transactionSchema) as any,
    defaultValues: {
      category: "income",
      transaction_type: "in",
      remark: "",
      description: "",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadSelectionMatrices = useCallback(async () => {
    try {
      const [cashbookRes, currencyRes] = await Promise.all([
        cashbookService.getAll(),
        currencyService.getAll(),
      ]);

      if (cashbookRes?.data) {
        setCashbooks(
          cashbookRes.data.map((c) => ({
            id: c.id.toString(),
            name: `${c.name} (${c.currency?.symbol || ""})`,
          })),
        );
      }
      if (currencyRes?.data) {
        setCurrencies(
          currencyRes.data.map((c) => ({
            id: c.id.toString(),
            name: `${c.name} (${c.symbol})`,
          })),
        );
      }
    } catch (err) {
      console.error("Failed executing synchronization sequences", err);
    }
  }, []);

  useEffect(() => {
    loadSelectionMatrices();
  }, [loadSelectionMatrices]);

  useEffect(() => {
    if (transactionData) {
      reset({
        source_account_id:
          transactionData.source_account_id || transactionData.cashbook_id,
        destination_account_id: transactionData.destination_account_id || null,
        currency_id: transactionData.currency_id,
        transaction_type:
          (transactionData.transaction_type as "in" | "out") || "in",
        amount: Number(transactionData.amount || 0),
        category: transactionData.category || "income",
        description: transactionData.description || "",
        remark: transactionData.remark || "",
      });

      if (transactionData.attachments) {
        setExistingFiles(transactionData.attachments);
      }
    }
  }, [transactionData, reset]);

  const handleRemoveExistingFile = (fileId: number) => {
    setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const onSubmit = async (data: TransactionFormValues) => {
    const filesArray = data.attachments
      ? data.attachments instanceof FileList
        ? Array.from(data.attachments)
        : Array.isArray(data.attachments)
          ? data.attachments
          : [data.attachments]
      : [];

    const payload: any = {
      cashbook_id: data.source_account_id,
      source_account_id: data.source_account_id,
      category: data.category,
      currency_id: data.currency_id,
      amount: data.amount,
      remark: data.remark || "",
      description: data.description || "",
      attachments: filesArray as File[],
      existing_attachment: existingFiles,
    };

    if (data.destination_account_id) {
      payload.destination_account_id = data.destination_account_id;
    }
    if (data.transaction_type) {
      payload.transaction_type = data.transaction_type;
    }

    try {
      const result = transactionData
        ? await cashbookService.updateTransaction(transactionData.id, payload)
        : await cashbookService.createTransaction(payload);

      const status = result?.response?.status || (result as any)?.status;
      const message = result?.response?.message || (result as any)?.message;

      if (status === "error") {
        toast.error(message || "Validation Error");
        return;
      }

      toast.success(
        message ||
          `Transaction ${transactionData ? "updated" : "posted"} successfully`,
      );
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving the transaction.");
    }
  };

  return (
    <form
      id="transaction-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 py-2"
    >
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="source_account_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Source Cashbook (From)"
              options={cashbooks}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.source_account_id?.message}
            />
          )}
        />
        <Controller
          name="destination_account_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Destination Cashbook (To) - Optional"
              options={cashbooks}
              value={field.value?.toString() || ""}
              onValueChange={(val) => field.onChange(val ? Number(val) : null)}
              error={errors.destination_account_id?.message}
            />
          )}
        />
        <Controller
          name="currency_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Transfer Currency"
              options={currencies}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.currency_id?.message}
            />
          )}
        />
        <Controller
          name="transaction_type"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Transaction Direction"
              options={[
                { id: "in", name: "In (Credit Account)" },
                { id: "out", name: "Out (Debit Account)" },
              ]}
              value={field.value || ""}
              onValueChange={(val) => field.onChange(val || null)}
              error={errors.transaction_type?.message}
            />
          )}
        />
        <FormInput
          type="number"
          label="Transfer Amount"
          registration={register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
          step="0.01"
          placeholder="0.00"
          className="col-span-2"
        />
        <div className="col-span-2">
          <FormSelect
            label="Category"
            value={watch("category") || "income"}
            onValueChange={(val) => setValue("category", val)}
            options={[
              { id: "income", name: "income" },
              { id: "expense", name: "expense" },
            ]}
            error={errors.category?.message}
          />
        </div>
        <div className="col-span-2">
          <FormInput
            label="Description"
            placeholder="Type transaction notes..."
            registration={register("description")}
            error={errors.description?.message}
          />
        </div>
        <div className="col-span-2">
          <FormInput
            label="Remark"
            type="textarea"
            placeholder="Type context remarks..."
            registration={register("remark")}
            error={errors.remark?.message}
          />
        </div>

        <div className="col-span-2">
          <FileInput
            label="Supporting Vouchers / Transfer Slips"
            registration={register("attachments")}
            error={errors.attachments?.message}
            existingAttachments={existingFiles}
            onRemoveExisting={handleRemoveExistingFile}
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
          ) : transactionData ? (
            "Save Changes"
          ) : (
            "Execute Transfer"
          )}
        </Button>
      </div>
    </form>
  );
}
