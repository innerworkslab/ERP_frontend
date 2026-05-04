"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { FormMultiSelect } from "@/components/common/FormMultiSelect";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { branchService } from "@/api/branches.service";
import { staffService } from "@/api/staffs.service";
import { departmentService } from "@/api/departments.service";
import { rolesService } from "@/api/roles.service";
import { nrcService, NRC } from "@/api/nrc.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { staffSchema } from "./schema";
import * as yup from "yup";
import { FileInput } from "../common/FileInput";
import PermissionGrid from "./PermissionGrid";
import { Permission, featureService } from "@/api/features.service";
import { featureRecommendationService } from "@/api/featureRecommendationRules.service";

type StaffFormValues = yup.InferType<typeof staffSchema>;

const NRC_TYPES = [
  { id: "(N)", name: "(N) Naing" },
  { id: "(P)", name: "(P) Pyu" },
  { id: "(E)", name: "(E) Eit" },
  { id: "(T)", name: "(T) Tharki" },
];

const NRC_CODES = Array.from({ length: 14 }, (_, i) => ({
  id: (i + 1).toString(),
  name: (i + 1).toString(),
}));

export default function StaffForm() {
  const router = useRouter();
  const params = useParams();
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [nrcTownships, setNrcTownships] = useState<NRC[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const idValue = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const isUpdate = !!idValue && idValue !== "add";
  const numericId = isUpdate ? Number(idValue) : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: yupResolver(staffSchema),
    context: { isUpdate },
    defaultValues: {
      status: "active",
      branch_id: [],
      permission_ids: [],
      employment_information: {
        is_contract: 0,
        salary: 0,
        sale_incentive_amount: 0,
        sale_commission: 0,
      },
    },
  });

  const selectedNrcCode = watch("personal_information.nrc_code_prefix");

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [b, r, d, p] = await Promise.all([
          branchService.getAll({ status: "active" }),
          rolesService.getAll({ status: "active" }),
          departmentService.getAll({ status: "active" }),
          featureService.getAll(),
        ]);
        if (b?.data) setBranches(b.data);
        if (r?.data) setRoles(r.data);
        if (d?.data) setDepartments(d.data);
        if (p?.data) setPermissions(p.data);
      } catch (err) {
        toast.error("Failed to load form metadata");
      }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    if (selectedNrcCode) {
      nrcService.getAll(selectedNrcCode).then((res) => {
        if (res?.data) setNrcTownships(res.data);
      });
    }
  }, [selectedNrcCode]);

  useEffect(() => {
    if (isUpdate && numericId) {
      staffService.getById(numericId).then((res) => {
        if (res?.data) {
          const d = res.data;
          reset({
            name: d.name,
            email: d.email,
            phone_number: d.phone_number,
            role_id: d.role_id,
            branch_id: d.branches?.map((b: any) => b.id) || [],
            department_id: d.department_id,
            status: d.status,
            permission_ids: d.permissions?.map((p: any) => p.id) || [],
            personal_information: {
              date_of_birth:
                d.staff_personal_information?.date_of_birth?.split("T")[0] ||
                "",
              nrc_code_prefix: d.nrc_code?.toString() || "",
              nrc_code: d.township_code?.toString() || "",
              nrc_type: d.nrc_type ? `(${d.nrc_type})` : "(N)",
              id_number: d.id_number || "",
              father_name: d.staff_personal_information?.father_name || "",
              mother_name: d.staff_personal_information?.mother_name || "",
              town: d.staff_personal_information?.town || "",
              township: d.staff_personal_information?.township || "",
              address: d.staff_personal_information?.address || "",
              nrc_image:
                d.staff_personal_information?.nrc_image_url || undefined,
              house_hold_information_image:
                d.staff_personal_information
                  ?.house_hold_information_image_url || undefined,
            },
            employment_information: {
              join_date:
                d.staff_employment_information?.join_date?.split("T")[0] || "",
              is_contract: d.staff_employment_information?.is_contract ? 1 : 0,
              off_day: d.staff_employment_information?.off_day || "",
              overtime_fee_type:
                d.staff_employment_information?.overtime_fee_type || "",
              salary: Number(d.staff_employment_information?.salary || 0),
              sale_incentive_amount: Number(
                d.staff_employment_information?.sale_incentive_amount || 0,
              ),
              sale_commission: Number(
                d.staff_employment_information?.sale_commission || 0,
              ),
            },
            banking_information: {
              bank_name: d.staff_banking_information?.bank_name || "",
              account_number: d.staff_banking_information?.account_number || "",
            },
          });
        }
      });
    }
  }, [numericId, isUpdate, reset]);

  const onSubmit = async (data: StaffFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    if (!isUpdate && data.password) formData.append("password", data.password);
    formData.append("role_id", String(data.role_id));
    formData.append("department_id", String(data.department_id));
    formData.append("status", data.status);

    data.branch_id.forEach((id) => formData.append("branch_id[]", String(id)));
    data.permission_ids?.forEach((id) =>
      formData.append("permission_ids[]", String(id)),
    );

    const p = data.personal_information;
    formData.append("nrc_code", p.nrc_code_prefix);
    formData.append("township_code", p.nrc_code);
    formData.append("nrc_type", p.nrc_type.replace(/[()]/g, ""));
    formData.append("id_number", p.id_number);

    formData.append("personal_information[date_of_birth]", p.date_of_birth);
    formData.append("personal_information[father_name]", p.father_name);
    formData.append("personal_information[mother_name]", p.mother_name);
    formData.append("personal_information[town]", p.town);
    formData.append("personal_information[township]", p.township);
    formData.append("personal_information[address]", p.address);

    if (p.nrc_image?.[0] instanceof File)
      formData.append("personal_information[nrc_image]", p.nrc_image[0]);
    if (p.house_hold_information_image?.[0] instanceof File) {
      formData.append(
        "personal_information[house_hold_information_image]",
        p.house_hold_information_image[0],
      );
    }

    const e = data.employment_information;
    formData.append("employment_information[join_date]", e.join_date);
    formData.append(
      "employment_information[is_contract]",
      String(e.is_contract),
    );
    formData.append("employment_information[off_day]", e.off_day);
    formData.append(
      "employment_information[overtime_fee_type]",
      e.overtime_fee_type,
    );
    formData.append("employment_information[salary]", String(e.salary));
    formData.append(
      "employment_information[sale_incentive_amount]",
      String(e.sale_incentive_amount),
    );
    formData.append(
      "employment_information[sale_commission]",
      String(e.sale_commission),
    );

    const b = data.banking_information;
    formData.append("banking_information[bank_name]", b.bank_name);
    formData.append("banking_information[account_number]", b.account_number);

    try {
      numericId
        ? await staffService.update(numericId, formData)
        : await staffService.create(formData);
      toast.success("Staff saved successfully");
      router.push("/auth/staffs");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          label="Phone"
          registration={register("phone_number")}
          error={errors.phone_number?.message}
        />
        {!isUpdate && (
          <FormInput
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          label="Role"
          value={watch("role_id")?.toString()}
          onValueChange={(val) => setValue("role_id", Number(val))}
          options={roles}
          error={errors.role_id?.message}
        />
        <FormMultiSelect
          label="Branches"
          options={branches.map((b) => ({
            id: b.id.toString(),
            name: b.name,
          }))}
          value={watch("branch_id")?.map(String) || []}
          onValueChange={(vals) => {
            setValue("branch_id", vals.map(Number), { shouldValidate: true });
          }}
          error={errors.branch_id?.message}
        />
        <FormSelect
          label="Department"
          value={watch("department_id")?.toString()}
          onValueChange={(val) => setValue("department_id", Number(val))}
          options={departments}
          error={errors.department_id?.message}
        />
        <FormSelect
          label="Status"
          value={watch("status")}
          onValueChange={(val) => setValue("status", val)}
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
          error={errors.status?.message}
        />
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <FormSelect
            label="State"
            options={NRC_CODES}
            value={watch("personal_information.nrc_code_prefix")}
            onValueChange={(val) => {
              setValue("personal_information.nrc_code_prefix", val);
              setValue("personal_information.nrc_code", "");
            }}
            error={errors.personal_information?.nrc_code_prefix?.message}
          />
          <FormSelect
            label="Township"
            options={nrcTownships.map((n) => ({
              id: n.id.toString(),
              name: `${n.name_en} (${n.name_mm})`,
            }))}
            value={watch("personal_information.nrc_code")}
            onValueChange={(val) =>
              setValue("personal_information.nrc_code", val)
            }
            error={errors.personal_information?.nrc_code?.message}
            placeholder={selectedNrcCode ? "Select" : "Select State First"}
          />
          <FormSelect
            label="Type"
            options={NRC_TYPES}
            value={watch("personal_information.nrc_type")}
            onValueChange={(val) =>
              setValue("personal_information.nrc_type", val)
            }
            error={errors.personal_information?.nrc_type?.message}
          />
          <div className="md:col-span-2">
            <FormInput
              label="ID Number"
              placeholder="123456"
              registration={register("personal_information.id_number")}
              error={errors.personal_information?.id_number?.message}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="DOB"
          type="date"
          registration={register("personal_information.date_of_birth")}
          error={errors.personal_information?.date_of_birth?.message}
        />
        <FormInput
          label="Father Name"
          registration={register("personal_information.father_name")}
          error={errors.personal_information?.father_name?.message}
        />
        <FormInput
          label="Mother Name"
          registration={register("personal_information.mother_name")}
          error={errors.personal_information?.mother_name?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Town"
          registration={register("personal_information.town")}
          error={errors.personal_information?.town?.message}
        />
        <FormInput
          label="Township"
          registration={register("personal_information.township")}
          error={errors.personal_information?.township?.message}
        />
        <FormInput
          label="Address"
          registration={register("personal_information.address")}
          error={errors.personal_information?.address?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileInput
          label="NRC Image"
          registration={register("personal_information.nrc_image")}
          error={errors.personal_information?.nrc_image?.message}
        />
        <FileInput
          label="Household Image"
          registration={register(
            "personal_information.house_hold_information_image",
          )}
          error={
            errors.personal_information?.house_hold_information_image?.message
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Join Date"
          type="date"
          registration={register("employment_information.join_date")}
          error={errors.employment_information?.join_date?.message}
        />
        <FormSelect
          label="Contract"
          value={watch("employment_information.is_contract")?.toString()}
          onValueChange={(val) =>
            setValue("employment_information.is_contract", Number(val))
          }
          options={[
            { id: "1", name: "True" },
            { id: "0", name: "False" },
          ]}
          error={errors.employment_information?.is_contract?.message}
        />
        <FormInput
          label="Off Day"
          registration={register("employment_information.off_day")}
          error={errors.employment_information?.off_day?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          label="Overtime Fee Type"
          value={watch("employment_information.overtime_fee_type")}
          onValueChange={(val) =>
            setValue("employment_information.overtime_fee_type", val)
          }
          options={[
            { id: "hourly", name: "Hourly" },
            { id: "daily", name: "Daily" },
            { id: "monthly", name: "Monthly" },
          ]}
          error={errors.employment_information?.overtime_fee_type?.message}
        />
        <FormInput
          label="Salary"
          type="number"
          registration={register("employment_information.salary", {
            valueAsNumber: true,
          })}
          error={errors.employment_information?.salary?.message}
        />
        <FormInput
          label="Sale Incentive"
          type="number"
          registration={register(
            "employment_information.sale_incentive_amount",
            { valueAsNumber: true },
          )}
          error={errors.employment_information?.sale_incentive_amount?.message}
        />
      </div>

      <FormInput
        label="Commission"
        type="number"
        registration={register("employment_information.sale_commission", {
          valueAsNumber: true,
        })}
        error={errors.employment_information?.sale_commission?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Bank Name"
          registration={register("banking_information.bank_name")}
          error={errors.banking_information?.bank_name?.message}
        />
        <FormInput
          label="Account Number"
          registration={register("banking_information.account_number")}
          error={errors.banking_information?.account_number?.message}
        />
      </div>

      <PermissionGrid
        data={permissions}
        value={watch("permission_ids")}
        onChange={(ids) =>
          setValue("permission_ids", ids, { shouldValidate: true })
        }
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="mr-2" />
          )}
          {isSubmitting ? "Saving..." : "Submit Staff"}
        </Button>
      </div>
    </form>
  );
}
