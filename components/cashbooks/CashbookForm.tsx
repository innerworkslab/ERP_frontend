"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cashbookSchema, CashbookFormValues } from "./schema";
import { cashbookService, Cashbook } from "@/api/cashbooks.service";
import { branchService } from "@/api/branches.service";
import { currencyService } from "@/api/currencies.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  cashbookData?: Cashbook | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function CashbookForm({
  cashbookData,
  onSuccess,
  setLoading,
}: Props) {
  const [branches, setBranches] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CashbookFormValues>({
    resolver: yupResolver(cashbookSchema),
    defaultValues: {
      status: "active",
      remark: "",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadInitialOptions = useCallback(async () => {
    try {
      const [branchRes, currencyRes] = await Promise.all([
        branchService.getAll({ status: "active" }),
        currencyService.getAll(),
      ]);

      if (branchRes?.data) {
        setBranches(
          branchRes.data.map((b) => ({ id: b.id.toString(), name: b.name })),
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
      console.error("Failed loading configuration frameworks", err);
    }
  }, []);

  useEffect(() => {
    loadInitialOptions();
  }, [loadInitialOptions]);

  useEffect(() => {
    if (cashbookData) {
      reset({
        name: cashbookData.name,
        branch_id: cashbookData.branch_id,
        currency_id: cashbookData.currency_id,
        type: cashbookData.type,
        status: cashbookData.status as "active" | "inactive",
        remark: cashbookData.remark || "",
      });
    }
  }, [cashbookData, reset]);

  const onSubmit = async (data: CashbookFormValues) => {
    const res = cashbookData
      ? await cashbookService.update(cashbookData.id, data)
      : await cashbookService.create(data);
    if (res) {
      toast.success(
        res.response?.message ||
          "Cashbook configuration synchronized successfully",
      );
      onSuccess();
    }
  };

  return (
    <form
      id="cashbook-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 py-2"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormInput
            label="Account Name"
            registration={register("name")}
            error={errors.name?.message}
          />
        </div>

        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Branch Allocation"
              options={branches}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.branch_id?.message}
            />
          )}
        />

        <Controller
          name="currency_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Account Currency"
              options={currencies}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.currency_id?.message}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Account Type"
              options={[
                { id: "cash", name: "Cash on Hand" },
                { id: "bank", name: "Bank Account" },
                { id: "mobile_wallet", name: "Mobile Wallet" },
                { id: "petty_cash", name: "Petty Cash" },
              ]}
              value={field.value}
              onValueChange={(val) => field.onChange(val)}
              error={errors.type?.message}
            />
          )}
        />

        <div>
          <FormSelect
            label="Status"
            value={watch("status")}
            onValueChange={(val) =>
              setValue("status", val as "active" | "inactive")
            }
            options={[
              { id: "active", name: "Active" },
              { id: "inactive", name: "Inactive" },
            ]}
          />
        </div>

        <div className="col-span-2">
          <FormInput
            type="textarea"
            label="Account Remarks"
            registration={register("remark")}
            error={errors.remark?.message}
            placeholder="Optional tracking notes..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[150px] rounded-2xl shadow-xl shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Cashbook"
          )}
        </Button>
      </div>
    </form>
  );
}
