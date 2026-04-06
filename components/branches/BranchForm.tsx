"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchSchema, BranchFormValues } from "./schema";
import { branchService, Branch } from "@/api/branches.service";
import { stateService } from "@/api/states.service";
import { cityService } from "@/api/cities.service";
import { priceGroupService } from "@/api/priceGroups.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  branchData?: Branch | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function BranchForm({
  branchData,
  onSuccess,
  setLoading,
}: Props) {
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [priceGroups, setPriceGroups] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: yupResolver(branchSchema),
    defaultValues: { status: "active" },
  });

  const selectedState = watch("state_id");

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadInitialData = useCallback(async () => {
    const [stateRes, pgRes] = await Promise.all([
      stateService.getAll(),
      priceGroupService.getAll(),
    ]);
    setStates(
      stateRes.data.map((s) => ({ id: s.id.toString(), name: s.name })),
    );
    setPriceGroups(
      pgRes.data.map((p) => ({ id: p.id.toString(), name: p.name })),
    );
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedState) {
      cityService.getAll({ state_id: selectedState }).then((res) => {
        setCities(res.data.map((c) => ({ id: c.id.toString(), name: c.name })));
      });
    }
  }, [selectedState]);

  useEffect(() => {
    if (branchData) {
      reset({
        ...branchData,
        state_id: branchData.state_id,
        city_id: branchData.city_id,
        default_selling_price_group_id:
          branchData.default_selling_price_group_id,
      });
    }
  }, [branchData, reset]);

  const onSubmit = async (data: BranchFormValues) => {
    const res = branchData
      ? await branchService.update(branchData.id, data)
      : await branchService.create(data);
    if (res) {
      toast.success(
        res.response?.message || branchData
          ? "Branch updated successfully."
          : "Branch created successfully.",
      );
      onSuccess();
    }
  };

  return (
    <form
      id="branch-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 py-2"
    >
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Prefix"
          registration={register("prefix")}
          error={errors.prefix?.message}
        />
        <FormInput
          label="Name"
          registration={register("name")}
          error={errors.name?.message}
        />
        <FormInput
          label="Email"
          registration={register("email")}
          error={errors.email?.message}
        />
        <FormInput
          label="Mobile"
          registration={register("mobile")}
          error={errors.mobile?.message}
        />

        <Controller
          name="state_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="State"
              options={states}
              value={field.value?.toString()}
              onValueChange={(val) => {
                field.onChange(Number(val));
                setValue("city_id", 0);
              }}
              error={errors.state_id?.message}
            />
          )}
        />

        <Controller
          name="city_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="City"
              options={cities}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.city_id?.message}
              disabled={!selectedState}
            />
          )}
        />

        <Controller
          name="default_selling_price_group_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Default Price Group"
              options={priceGroups}
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.default_selling_price_group_id?.message}
            />
          )}
        />

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

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Branch"
          )}
        </Button>
      </div>
    </form>
  );
}
