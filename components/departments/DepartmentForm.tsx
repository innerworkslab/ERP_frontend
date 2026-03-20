"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentService, Department } from "@/api/departments.service";
import { branchService } from "@/api/branches.service";
import { departmentSchema } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import * as yup from "yup";

type DepartmentFormValues = yup.InferType<typeof departmentSchema>;

interface DepartmentFormProps {
  departmentData: Department | null;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function DepartmentForm({
  departmentData,
  onSuccess,
  setLoading,
}: DepartmentFormProps) {
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: yupResolver(departmentSchema),
    defaultValues: {
      status: "active",
    },
  });

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setBranches(res.data);
    });
  }, []);

  useEffect(() => {
    if (departmentData) {
      reset({
        code: departmentData.code,
        name: departmentData.name,
        branch_id: departmentData.branch?.id || departmentData.branch_id,
        status: departmentData.status as "active" | "inactive",
      });
    } else {
      reset({
        code: "",
        name: "",
        branch_id: undefined,
        status: "active",
      });
    }
  }, [departmentData, reset]);

  const onSubmit = async (data: DepartmentFormValues) => {
    const res = departmentData
      ? await departmentService.update(departmentData.id, data)
      : await departmentService.create(data);

    if (res) onSuccess();
  };

  return (
    <form
      id="department-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Department Code"
          placeholder="e.g. ITD"
          registration={register("code")}
          error={errors.code?.message}
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
          label="Department Name"
          placeholder="e.g. IT Department"
          registration={register("name")}
          error={errors.name?.message}
        />

        <FormSelect
          label="Branch Assignment"
          placeholder="Select Branch"
          value={watch("branch_id")?.toString()}
          onValueChange={(val) => setValue("branch_id", Number(val))}
          options={branches}
          error={errors.branch_id?.message}
        />
      </div>
    </form>
  );
}
