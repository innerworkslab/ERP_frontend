"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { branchService } from "@/api/branches.service";
import { staffService } from "@/api/staffs.service";
import * as yup from "yup";
import { staffSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileInput } from "../common/FileInput";
import { departmentService } from "@/api/departments.service";
import { rolesService } from "@/api/roles.service";

type StaffFormValues = yup.InferType<typeof staffSchema>;

export default function StaffForm() {
  const router = useRouter();
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const params = useParams();
  const idParam = params?.id;
  const idValue = Array.isArray(idParam) ? idParam[0] : idParam;
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
    defaultValues: {
      status: "active",
      employment_information: {
        is_contract: 0,
        salary: 0,
        sale_incentive_amount: 0,
        sale_commission: 0,
      },
    },
  });

  useEffect(() => {
    if (isUpdate && numericId) {
      const fetchCustomer = async () => {
        const res = await staffService.getById(numericId);

        if (res && res.data) {
          const d = res.data;

          reset({
            name: d.name,
            email: d.email,
            phone_number: d.phone_number,
            role_id: d.role_id,
            branch_id: d.branch_id,
            department_id: d.department_id,
            status: d.status,

            personal_information: {
              date_of_birth:
                d.staff_personal_information?.date_of_birth?.split("T")[0] ||
                "",
              nrc_number: d.staff_personal_information?.nrc_number || "",
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
      };
      fetchCustomer();
    }
  }, [numericId, isUpdate, reset]);

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setBranches(res.data);
    });
    rolesService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setRoles(res.data);
    });
    departmentService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setDepartments(res.data);
    });
  }, []);

  const onSubmit = async (data: StaffFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    if (!isUpdate) {
      formData.append("password", data.password);
    }
    formData.append("role_id", String(data.role_id));
    formData.append("branch_id", String(data.branch_id));
    formData.append("department_id", String(data.department_id));
    formData.append("status", data.status);

    const p = data.personal_information;
    formData.append("personal_information[date_of_birth]", p.date_of_birth);
    formData.append("personal_information[nrc_number]", p.nrc_number);
    formData.append("personal_information[father_name]", p.father_name);
    formData.append("personal_information[mother_name]", p.mother_name);
    formData.append("personal_information[town]", p.town);
    formData.append("personal_information[township]", p.township);
    formData.append("personal_information[address]", p.address);

    if (p.nrc_image?.[0]) {
      formData.append("personal_information[nrc_image]", p.nrc_image[0]);
    }

    if (p.house_hold_information_image?.[0]) {
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

    if (!numericId) {
      formData.append("authorized_features[0][feature_id]", "1");
      formData.append("authorized_features[0][recommended_by_rule]", "rule");
      formData.append("authorized_features[0][access_type]", "manual");
      formData.append("authorized_features[0][permission_level]", "write");
    }

    try {
      const res = numericId
        ? await staffService.update(numericId, formData)
        : await staffService.create(formData);

      toast.success(res.response?.message || "Success");
      router.push("/auth/staffs");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

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
        <FormSelect
          label="Branch"
          value={watch("branch_id")?.toString()}
          onValueChange={(val) => setValue("branch_id", Number(val))}
          options={branches}
          error={errors.branch_id?.message}
        />
        <FormSelect
          label="Department"
          value={watch("department_id")?.toString()}
          onValueChange={(val) => setValue("department_id", Number(val))}
          options={departments}
          error={errors.department_id?.message}
        />
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="DOB"
          type="date"
          registration={register("personal_information.date_of_birth")}
          error={errors.personal_information?.date_of_birth?.message}
        />
        <FormInput
          label="NRC"
          registration={register("personal_information.nrc_number")}
          error={errors.personal_information?.nrc_number?.message}
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
      </div>

      <FormInput
        label="Address"
        registration={register("personal_information.address")}
        error={errors.personal_information?.address?.message}
      />

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

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="mr-2" />
          )}
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
