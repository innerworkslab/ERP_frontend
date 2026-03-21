"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerSchema } from "./schema";
import { customerService } from "@/api/customers.service";
import { branchService } from "@/api/branches.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import * as yup from "yup";
import { Button } from "../ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

type CustomerFormValues = yup.InferType<typeof customerSchema>;

export default function CustomerForm() {
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const router = useRouter();
  const params = useParams();

  const idParam = params?.id;
  const idValue = Array.isArray(idParam) ? idParam[0] : idParam;
  const isUpdate = !!idValue && idValue !== "add";
  const numericId = isUpdate ? Number(idValue) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      name: "",
      company_name: "",
      phone_number: "",
      country: "",
      town: "",
      township: "",
      address: "",
      status: "active",
      type: "customer",
      credit_limit: 0,
      opening: 0,
      bank_acc: "",
      birthday: "",
      payment_terms: "",
      payment_due: "",
      branch_id: undefined,
    },
  });

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setBranches(res.data);
    });
  }, []);

  useEffect(() => {
    if (isUpdate && numericId) {
      const fetchCustomer = async () => {
        const res = await customerService.getById(numericId);

        if (res && res.data) {
          reset({
            name: res.data.name,
            company_name: res.data.company_name,
            phone_number: res.data.phone_number,
            country: res.data.country,
            town: res.data.town,
            township: res.data.township,
            address: res.data.address,
            status: res.data.status,
            type: res.data.type,
            credit_limit: Number(res.data.credit_limit),
            opening: Number(res.data.opening),
            bank_acc: res.data.bank_acc || "",
            birthday: res.data.birthday || "",
            payment_terms: res.data.payment_terms || "",
            payment_due: res.data.payment_due || "",
            branch_id: res.data.branch?.id || res.data.branch_id,
          });
        }
      };
      fetchCustomer();
    }
  }, [numericId, isUpdate, reset]);

  const onSubmit = async (data: CustomerFormValues) => {
    const res = numericId
      ? await customerService.update(numericId, data)
      : await customerService.create(data);

    toast.success(res.response?.message || "Success");
    router.push("/auth/customers");
    router.refresh();
  };

  return (
    <form
      id="customer-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 py-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Operational Status"
          value={watch("status")}
          onValueChange={(val) =>
            setValue("status", val as "Active" | "Inactive")
          }
          options={[
            { id: "Active", name: "Active" },
            { id: "Inactive", name: "Inactive" },
          ]}
          error={errors.status?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Customer Name"
          placeholder="e.g. ABC Customer"
          registration={register("name")}
          error={errors.name?.message}
        />

        <FormInput
          label="Company Name"
          placeholder="e.g. ABC Co., Ltd"
          registration={register("company_name")}
          error={errors.company_name?.message}
        />

        <FormInput
          label="Phone Number"
          placeholder="e.g. 0912345678"
          registration={register("phone_number")}
          error={errors.phone_number?.message}
        />

        <FormInput
          label="Bank Account"
          placeholder="Optional"
          registration={register("bank_acc")}
          error={errors.bank_acc?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Country"
          registration={register("country")}
          error={errors.country?.message}
        />

        <FormInput
          label="Town"
          registration={register("town")}
          error={errors.town?.message}
        />

        <FormInput
          label="Township"
          registration={register("township")}
          error={errors.township?.message}
        />
      </div>

      <FormInput
        label="Address"
        registration={register("address")}
        error={errors.address?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Credit Limit"
          type="number"
          registration={register("credit_limit", { valueAsNumber: true })}
          error={errors.credit_limit?.message}
        />

        <FormInput
          label="Opening Balance"
          type="number"
          registration={register("opening", { valueAsNumber: true })}
          error={errors.opening?.message}
        />

        <FormSelect
          label="Customer Type"
          value={watch("type")}
          onValueChange={(val) => setValue("type", val)}
          options={[{ id: "Retail", name: "Retail" }]}
          error={errors.type?.message}
        />
      </div>

      <FormSelect
        label="Branch"
        placeholder="Select Branch"
        value={watch("branch_id")?.toString()}
        onValueChange={(val) => setValue("branch_id", Number(val))}
        options={branches}
        error={errors.branch_id?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Birthday"
          type="date"
          registration={register("birthday")}
          error={errors.birthday?.message}
        />

        <FormInput
          label="Payment Terms"
          registration={register("payment_terms")}
          error={errors.payment_terms?.message}
        />

        <FormInput
          label="Payment Due"
          registration={register("payment_due")}
          error={errors.payment_due?.message}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-8 text-xs font-bold rounded-xl transition-all active:scale-[0.95] bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
