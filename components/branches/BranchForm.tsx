"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchSchema, BranchFormValues } from "./schema";
import { branchService, Branch } from "@/api/branches.service";
import { stateService } from "@/api/states.service";
import { cityService } from "@/api/cities.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
    defaultValues: {
      status: "active",
      mobile_phones: [""], // Initialize with one empty input
    },
  });

  // Manage dynamic phone inputs
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mobile_phones" as never,
  });

  const selectedState = watch("state_id");

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadInitialData = useCallback(async () => {
    const stateRes = await stateService.getAll();
    setStates(
      stateRes.data.map((s) => ({ id: s.id.toString(), name: s.name })),
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
        mobile_phones: branchData.mobile_phones || [""],
      });
    }
  }, [branchData, reset]);

  const onSubmit = async (data: BranchFormValues) => {
    const res = branchData
      ? await branchService.update(branchData.id, data)
      : await branchService.create(data);
    if (res) {
      toast.success(res.response?.message || "Success");
      onSuccess();
    }
  };

  return (
    <form
      id="branch-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 py-2"
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

        <div className="col-span-2">
          <FormInput
            type="textarea"
            label="Address"
            registration={register("address")}
            error={errors.address?.message}
          />
        </div>

        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Phones
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
              className="h-7 px-2 rounded-xl text-[10px]"
            >
              <Plus className="mr-1 h-3 w-3" /> Add Phone
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <FormInput
                    placeholder="09..."
                    registration={register(`mobile_phones.${index}` as const)}
                    error={errors.mobile_phones?.[index]?.message}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-1 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.mobile_phones?.root?.message && (
            <p className="text-[10px] text-destructive">
              {errors.mobile_phones.root.message}
            </p>
          )}
        </div>

        <FormInput
          label="Email"
          registration={register("email")}
          error={errors.email?.message}
        />
        <FormInput
          label="Website"
          registration={register("website")}
          error={errors.website?.message}
        />
        <FormInput
          label="Facebook"
          registration={register("facebook")}
          error={errors.facebook?.message}
        />
        <span></span>
        <FormInput
          label="Latitude"
          registration={register("latitude")}
          error={errors.latitude?.message}
        />
        <FormInput
          label="Longitude"
          registration={register("longitude")}
          error={errors.longitude?.message}
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
            "Save Branch"
          )}
        </Button>
      </div>
    </form>
  );
}
