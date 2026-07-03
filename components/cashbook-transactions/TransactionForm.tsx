/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  // Can accept a full database row (Update) OR a partial shell from the list view click (Create)
  transactionData?: Partial<CashbookTransaction> | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

const STATIC_EMPTY_ATTACHMENTS: any[] = [];

export default function TransactionForm({
  transactionData,
  onSuccess,
  setLoading,
}: Props) {
  const [chartOfAccounts, setChartOfAccounts] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);

  // Flag derived on render: If there's an explicit transaction ID, we are in Edit/Update mode
  const isEditMode = useMemo(() => !!transactionData?.id, [transactionData]);

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
      remark: "",
      description: "",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadSelectionMatrices = useCallback(async () => {
    try {
      const [currencyRes, cashbookRes] = await Promise.all([
        currencyService.getAll(),
        cashbookService.getCashbookAccounts({ status: "active" }),
      ]);

      if (currencyRes?.data) {
        setCurrencies(
          currencyRes.data.map((c) => ({
            id: c.id.toString(),
            name: `${c.name} (${c.symbol})`,
          })),
        );
      }

      if (cashbookRes?.data) {
        setChartOfAccounts(
          cashbookRes.data.map((c) => ({
            id: c.id.toString(),
            name: `${c.name} [${c.name || "No Name"}]`,
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

  // Handles data loading/resetting depending on dynamic mode flags
  useEffect(() => {
    if (transactionData) {
      reset({
        source_account_id:
          transactionData.source_account_id || transactionData.cashbook_id,
        destination_account_id: transactionData.destination_account_id || null,
        currency_id: transactionData.currency_id,
        amount: transactionData.amount
          ? Number(transactionData.amount)
          : undefined,
        category: transactionData.category || "income",
        description: transactionData.description || "",
        remark: transactionData.remark || "",
      } as any);

      if (transactionData.attachments) {
        setExistingFiles(transactionData.attachments);
      } else {
        setExistingFiles([]);
      }
    } else {
      reset({
        category: "income",
        remark: "",
        description: "",
      } as any);
      setExistingFiles([]);
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
      transaction_type: data.category === "income" ? "in" : "out",
      category: data.category,
      currency_id: data.currency_id,
      amount: data.amount,
      remark: data.remark || "",
      description: data.description || "",
      attachments: filesArray as File[],
    };

    if (data.destination_account_id) {
      payload.destination_account_id = data.destination_account_id;
    }

    // Attach current existing vouchers state if we are tracking an edit session
    if (isEditMode) {
      payload.existing_attachment = existingFiles;
    }

    try {
      const result =
        isEditMode && transactionData?.id
          ? await cashbookService.updateTransaction(transactionData.id, payload)
          : await cashbookService.createTransaction(payload);

      const status = result?.response?.status || (result as any)?.status;
      const message = result?.response?.message || (result as any)?.message;

      if (status === "error" || result?.status === "error") {
        toast.error(message || "Validation Error");
        return;
      }

      toast.success(
        message ||
          `Transaction ${isEditMode ? "updated" : "posted"} successfully`,
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
          name="destination_account_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Destination Account (Chart of Accounts) - Optional"
              options={chartOfAccounts}
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
              value={field.value?.toString() || ""}
              onValueChange={(val) => field.onChange(val ? Number(val) : null)}
              error={errors.currency_id?.message}
            />
          )}
        />

        <FormInput
          type="number"
          label="Transaction Amount"
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
              { id: "income", name: "Income" },
              { id: "expense", name: "Expense" },
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
            existingAttachments={
              isEditMode ? existingFiles : STATIC_EMPTY_ATTACHMENTS
            }
            onRemoveExisting={isEditMode ? handleRemoveExistingFile : undefined}
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
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Post Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}
