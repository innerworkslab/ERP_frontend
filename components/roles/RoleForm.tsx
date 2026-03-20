"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchService } from "@/api/branches.service";
import {
  departmentService,
  DepartmentsFilter,
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
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [parentRoles, setParentRoles] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

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

  const selectedBranchId = watch("branch_id");

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    const fetchMeta = async () => {
      const [b, r] = await Promise.all([
        branchService.getAll({ status: "active" }),
        rolesService.getAllWithoutPagination(),
      ]);
      if (b?.data) setBranches(b.data);
      if (r?.data) setParentRoles(r.data);
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (selectedBranchId) {
      const fetchDeps = async () => {
        setLoadingDeps(true);
        const res = await departmentService.getByBranch({
          branch_id: selectedBranchId,
          status: "active",
        } as DepartmentsFilter);
        if (res?.data) setDepartments(res.data);
        setLoadingDeps(false);
      };
      fetchDeps();
    } else {
      setDepartments([]);
    }
  }, [selectedBranchId]);

  useEffect(() => {
    if (roleId) {
      rolesService.getById(roleId).then(async (res) => {
        if (res?.data) {
          const roleData = res.data;

          if (roleData.branch_id) {
            setLoadingDeps(true);
            const depRes = await departmentService.getByBranch({
              branch_id: roleData.branch_id,
              status: "active",
            } as DepartmentsFilter);

            if (depRes?.data) {
              setDepartments(depRes.data);
            }
            setLoadingDeps(false);
          }
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
          label="Branch Assignment"
          placeholder="Select Branch"
          value={watch("branch_id")?.toString()}
          onValueChange={(val) => {
            setValue("branch_id", Number(val));
            setValue("department_id", 0);
          }}
          options={branches}
          error={errors.branch_id?.message}
        />

        <FormSelect
          label="Department"
          placeholder="Select Dept"
          loading={loadingDeps}
          disabled={!selectedBranchId}
          value={watch("department_id")?.toString()}
          onValueChange={(val) => setValue("department_id", Number(val))}
          options={departments}
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
            .map((r) => ({ id: r.id, name: r.name })),
        ]}
        error={errors.parent_role_id?.message}
      />
    </form>
  );
}
