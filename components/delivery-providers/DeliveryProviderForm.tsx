"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@/components/common/FormInput";
import { toast } from "sonner";
import { deliveryProvidersService } from "@/api/deliveryProvider.service";
import { deliveryProviderSchema, FormValues } from "../delivery-providers/schema";

interface Props {
  providerId?: number | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function DeliveryProviderForm({
  providerId,
  onSuccess,
  setLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(deliveryProviderSchema),
    defaultValues: {
      name: "",
      default_price: 0,
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (!providerId) return;

    const fetchProviderDetails = async () => {
      try {
        const res = await deliveryProvidersService.getById(providerId);
        if (res?.data) {
          setValue("name", res.data.name);
          setValue("default_price", Number(res.data.default_price || 0));
        }
      } catch (err) {
        console.error("Failed to load delivery provider record:", err);
        toast.error("Could not load provider records.");
      }
    };

    fetchProviderDetails();
  }, [providerId, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      default_price: Number(data.default_price),
    };

    try {
      if (providerId) {
        await deliveryProvidersService.update(providerId, payload);
        toast.success("Delivery provider successfully modified.");
      } else {
        await deliveryProvidersService.create(payload);
        toast.success("Delivery provider successfully registered.");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      id="delivery-provider-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FormInput
        type="text"
        label="Delivery Provider Name"
        placeholder="Enter provider name (e.g., MGL, ArLuPost)"
        registration={register("name")}
        error={errors.name?.message}
      />

      <FormInput
        type="number"
        label="Default Delivery Price"
        placeholder="Enter base service price"
        registration={register("default_price", { valueAsNumber: true })}
        error={errors.default_price?.message}
      />

      <button type="submit" className="hidden" aria-hidden="true" />
    </form>
  );
}
