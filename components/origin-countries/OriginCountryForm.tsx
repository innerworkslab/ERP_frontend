"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { originCountrySchema, OriginCountryFormValues } from "./schema";
import {
  originCountryService,
  OriginCountry,
} from "@/api/originCountries.service";
import { FormInput } from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  countryData?: OriginCountry | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function OriginCountryForm({
  countryData,
  onSuccess,
  setLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OriginCountryFormValues>({
    resolver: yupResolver(originCountrySchema),
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (countryData) {
      reset({ name: countryData.name });
    } else {
      reset({ name: "" });
    }
  }, [countryData, reset]);

  const onSubmit = async (data: OriginCountryFormValues) => {
    const res = countryData
      ? await originCountryService.update(countryData.id, data)
      : await originCountryService.create(data);
    if (res) onSuccess();
  };

  return (
    <form
      id="origin-country-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 py-2"
    >
      <FormInput
        label="Country Name"
        placeholder="e.g. Myanmar"
        registration={register("name")}
        error={errors.name?.message}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {countryData ? "Update Country" : "Save Country"}
        </Button>
      </div>
    </form>
  );
}
