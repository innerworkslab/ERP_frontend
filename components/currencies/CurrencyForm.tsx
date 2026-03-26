"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencySchema, CurrencyFormValues } from "./schema";
import { currencyService, Currency } from "@/api/currencies.service";
import { toast } from "sonner";
import { FormInput } from "@/components/common/FormInput";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormCheckbox } from "../common/FormCheckbox";

interface Props {
  initialData?: Currency | null;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function CurrencyForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      symbol: initialData?.symbol || "",
      exchange_rate: Number(initialData?.exchange_rate) || 0,
      is_base_currency: initialData?.is_base_currency || false,
    },
  });

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  const onSubmit: SubmitHandler<CurrencyFormValues> = async (values) => {
    if (initialData) {
      await currencyService.update(initialData.id, values);
      toast.success("Currency updated");
    } else {
      await currencyService.create(values);
      toast.success("Currency created");
    }
    onSuccess();
  };

  return (
    <form
      id="currency-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 py-2"
    >
      <FormInput
        label="Currency Name"
        registration={register("name")}
        error={errors.name?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Currency Code"
          registration={register("code")}
          error={errors.code?.message}
          placeholder="e.g. USD"
        />
        <FormInput
          label="Symbol"
          registration={register("symbol")}
          error={errors.symbol?.message}
          placeholder="e.g. $"
        />
      </div>
      <FormInput
        label="Exchange Rate"
        type="number"
        step="0.0001"
        registration={register("exchange_rate")}
        error={errors.exchange_rate?.message}
      />
      <FormCheckbox
        label="Set as Base Currency"
        checked={watch("is_base_currency")}
        onCheckedChange={(val) => setValue("is_base_currency", !!val)}
      />
    </form>
  );
}
