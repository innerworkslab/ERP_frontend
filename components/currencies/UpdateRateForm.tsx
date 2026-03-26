"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { currencyService, Currency } from "@/api/currencies.service";
import { toast } from "sonner";
import { FormInput } from "@/components/common/FormInput";
import { Dispatch, SetStateAction, useEffect } from "react";

const updateRateSchema = z.object({
  exchange_rate: z.coerce.number().min(0, "Rate must be positive"),
});

type UpdateRateValues = z.infer<typeof updateRateSchema>;

interface Props {
  currency: Currency;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UpdateRateForm({
  currency,
  onSuccess,
  setLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRateValues>({
    resolver: zodResolver(updateRateSchema),
    defaultValues: {
      exchange_rate: Number(currency.exchange_rate),
    },
  });

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  const onSubmit: SubmitHandler<UpdateRateValues> = async (values) => {
    await currencyService.updateRate(currency.id, values.exchange_rate);
    toast.success("Exchange rate updated");
    onSuccess();
  };

  return (
    <form
      id="update-rate-form"
      onSubmit={handleSubmit(onSubmit)}
      className="py-4"
    >
      <FormInput
        label={`Current Rate for ${currency.code}`}
        type="number"
        step="0.0001"
        registration={register("exchange_rate")}
        error={errors.exchange_rate?.message}
      />
    </form>
  );
}
