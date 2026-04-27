"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  departmentService,
  DepartmentsFilters,
} from "@/api/departments.service";
import { roleSchema, RoleFormValues } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { rolesService } from "@/api/roles.service";

interface RoleFormProps {
  roleId?: number | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function RoleForm({
  roleId,
  onSuccess,
  setLoading,
}: RoleFormProps) {
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [parentRoles, setParentRoles] = useState<
    { id: number; name: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      status: "active",
      parent_role_id: null,
    },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    const fetchMeta = async () => {
      const [rolesRes, depRes] = await Promise.all([
        rolesService.getAllWithoutPagination(),
        departmentService.getAll({ status: "active" } as DepartmentsFilters),
      ]);

      if (rolesRes?.data) setParentRoles(rolesRes.data);
      if (depRes?.data) setDepartments(depRes.data);
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (roleId) {
      rolesService.getById(roleId).then((res) => {
        if (res?.data) {
          const roleData = res.data;
          reset({
            name: roleData.name,
            status: roleData.status,
            branch_id: roleData.branch_id,
            department_id: roleData.department_id,
            parent_role_id: roleData.parent_role_id ?? null,
          });
        }
      });
    }
  }, [roleId, reset]);

  const onSubmit = async (data: RoleFormValues) => {
    const res = roleId
      ? await rolesService.update(roleId, data)
      : await rolesService.create(data);
    if (res) onSuccess();
  };

  return (
    <form
      id="role-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Role Designation"
          placeholder="e.g. Senior Manager"
          registration={register("name")}
          error={errors.name?.message}
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

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Department"
          placeholder="Select Dept"
          value={watch("department_id")?.toString()}
          onValueChange={(val) => setValue("department_id", Number(val))}
          options={departments.map((d) => ({
            id: d.id.toString(),
            name: d.name,
          }))}
          error={errors.department_id?.message}
        />
      </div>

      <FormSelect
        label="Reporting To (Parent Role)"
        placeholder="None (Top Level)"
        value={watch("parent_role_id")?.toString() || "0"}
        onValueChange={(val) =>
          setValue("parent_role_id", val === "0" ? null : Number(val))
        }
        options={[
          { id: "0", name: "None (Root Role)" },
          ...parentRoles
            .filter((r) => r.id !== roleId)
            .map((r) => ({ id: r.id.toString(), name: r.name })),
        ]}
        error={errors.parent_role_id?.message}
      />
    </form>
  );
}
