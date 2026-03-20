"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchService, Branch } from "@/api/branches.service";
import { branchSchema } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import * as yup from "yup";

type BranchFormValues = yup.InferType<typeof branchSchema>;

interface BranchFormProps {
  branchData?: Branch | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function BranchForm({
  branchData,
  onSuccess,
  setLoading,
}: BranchFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: yupResolver(branchSchema),
    defaultValues: {
      prefix: "",
      name: "",
      location: "",
      status: "active",
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (branchData) {
      reset({
        prefix: branchData.prefix,
        name: branchData.name,
        location: branchData.location,
        status: branchData.status as "active" | "inactive",
      });
    } else {
      reset({
        prefix: "",
        name: "",
        location: "",
        status: "active",
      });
    }
  }, [branchData, reset]);

  const onSubmit = async (data: BranchFormValues) => {
    const res = branchData
      ? await branchService.update(branchData.id, data)
      : await branchService.create(data);

    if (res) {
      onSuccess();
    }
  };

  return (
    <form
      id="branch-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Branch Prefix"
          placeholder="e.g. YGN"
          registration={register("prefix")}
          error={errors.prefix?.message}
        />

        <FormSelect
          label="Operational Status"
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as "active" | "inactive")
          }
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          error={errors.status?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Branch Name"
          placeholder="e.g. Yangon Main Branch"
          registration={register("name")}
          error={errors.name?.message}
        />

        <FormInput
          label="Location Address"
          placeholder="City, Street address"
          registration={register("location")}
          error={errors.location?.message}
        />
      </div>
    </form>
  );
}
