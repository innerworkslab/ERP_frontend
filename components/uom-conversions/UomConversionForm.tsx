"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uomConversionSchema, UOMConversionFormValues } from "./schema";
import {
  uomConversionService,
  UOMConversion,
} from "@/api/uomConversions.service";
import { uomService } from "@/api/uom.service";
import { toast } from "sonner";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  initialData?: UOMConversion | null;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UOMConversionForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [uoms, setUoms] = useState<{ id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UOMConversionFormValues>({
    resolver: zodResolver(uomConversionSchema),
    defaultValues: {
      base_unit_id: initialData?.base_unit_id?.toString() || "",
      conversions_name: initialData?.conversions_name || "",
      conversion_unit_id: initialData?.conversion_unit_id?.toString() || "",
      conversion_rate: Number(initialData?.conversion_rate) || 0,
      status: initialData?.status || "active",
    },
  });

  const baseUnitId = watch("base_unit_id");
  const conversionUnitId = watch("conversion_unit_id");
  const conversionName = watch("conversions_name");

  useEffect(() => {
    const fetchUoms = async () => {
      const res = await uomService.getAll({});
      setUoms(res.map((u) => ({ id: u.id.toString(), name: u.name })));
    };
    fetchUoms();
  }, []);

  useEffect(() => {
    if (baseUnitId && conversionUnitId && !initialData && !conversionName) {
      const baseName = uoms.find((u) => u.id === baseUnitId)?.name || "";
      const convName = uoms.find((u) => u.id === conversionUnitId)?.name || "";
      if (baseName && convName) {
        setValue("conversions_name", `${baseName} to ${convName}`, {
          shouldValidate: true,
        });
      }
    }
  }, [
    baseUnitId,
    conversionUnitId,
    uoms,
    setValue,
    initialData,
    conversionName,
  ]);

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  const onSubmit = async (values: UOMConversionFormValues) => {
    const payload = {
      ...values,
      base_unit_id: Number(values.base_unit_id),
      conversion_unit_id: Number(values.conversion_unit_id),
    };
    if (initialData) {
      await uomConversionService.update(initialData.id, payload);
      toast.success("Conversion updated");
    } else {
      await uomConversionService.create(payload);
      toast.success("Conversion created");
    }
    onSuccess();
  };

  return (
    <form
      id="uom-conversion-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          label="Conversion Name"
          type="text"
          registration={register("conversions_name")}
          error={errors.conversions_name?.message}
        />
        <FormSelect
          label="Base Unit"
          options={uoms}
          value={baseUnitId}
          onValueChange={(val) =>
            setValue("base_unit_id", val, { shouldValidate: true })
          }
        />
        <FormSelect
          label="Conversion Unit"
          options={uoms}
          value={conversionUnitId}
          onValueChange={(val) =>
            setValue("conversion_unit_id", val, { shouldValidate: true })
          }
        />
        <FormInput
          label="Conversion Rate"
          type="number"
          registration={register("conversion_rate", { valueAsNumber: true })}
          error={errors.conversion_rate?.message}
        />
        <FormSelect
          label="Status"
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as "active" | "inactive", {
              shouldValidate: true,
            })
          }
        />
      </div>
    </form>
  );
}
