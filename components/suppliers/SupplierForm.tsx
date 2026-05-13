"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supplierSchema } from "./schema";
import { supplierService } from "@/api/suppliers.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import * as yup from "yup";
import { Button } from "../ui/button";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { State, stateService } from "@/api/states.service";
import { City, cityService } from "@/api/cities.service";

type SupplierFormValues = yup.InferType<typeof supplierSchema>;

export default function SupplierForm() {
  const router = useRouter();
  const params = useParams();

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLocLoading, setIsLocLoading] = useState(false);

  const idValue = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const isUpdate = !!idValue && idValue !== "add";
  const numericId = isUpdate ? Number(idValue) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      name: "",
      company_name: "",
      phone_number: "",
      state_id: undefined,
      city_id: undefined,
      address: "",
      status: "Active",
      supplier_type_id: 1,
      credit_limit: 0,
      opening: 0,
      bank_accounts: [{ bank_name: "", account_number: "", holder_name: "" }],
      birthday: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bank_accounts",
  });

  const selectedState = watch("state_id");

  useEffect(() => {
    stateService.getAll().then((res) => {
      if (res?.data) setStates(res.data);
    });
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    setIsLocLoading(true);
    cityService.getAll({ state_id: selectedState }).then((res) => {
      setCities(res.data || []);
      setIsLocLoading(false);
    });
  }, [selectedState]);

  useEffect(() => {
    if (isUpdate && numericId) {
      supplierService.getById(numericId).then((res) => {
        const formattedBirthday = res.data.birthday
          ? res.data.birthday.split("T")[0]
          : "";

        if (res && res.data) {
          reset({
            ...res.data,
            birthday: formattedBirthday,
            supplier_type_id: Number(res.data.supplier_type_id),
            state_id: Number(res.data.state_id),
            city_id: Number(res.data.city_id),
            bank_accounts: res.data.bank_accounts?.length
              ? res.data.bank_accounts
              : [{ bank_name: "", account_number: "", holder_name: "" }],
          });
        }
      });
    }
  }, [numericId, isUpdate, reset]);

  const onSubmit = async (data: SupplierFormValues) => {
    const res = numericId
      ? await supplierService.update(numericId, data)
      : await supplierService.create(data);
    toast.success(res.response?.message || "Success");
    router.push("/auth/suppliers");
    router.refresh();
  };

  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Supplier Name"
          registration={register("name")}
          error={errors.name?.message}
        />
        <FormInput
          label="Company Name"
          registration={register("company_name")}
          error={errors.company_name?.message}
        />
        <FormInput
          label="Phone Number"
          registration={register("phone_number")}
          error={errors.phone_number?.message}
        />
        <FormSelect
          label="Status"
          value={watch("status")}
          onValueChange={(val) => setValue("status", val)}
          options={[
            { id: "Active", name: "Active" },
            { id: "Inactive", name: "Inactive" },
          ]}
          error={errors.status?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          label="State"
          value={watch("state_id")?.toString()}
          onValueChange={(val) => {
            setValue("state_id", Number(val));
            setValue("city_id", undefined as any);
          }}
          options={states.map((s) => ({ id: s.id.toString(), name: s.name }))}
          error={errors.state_id?.message}
        />
        <FormSelect
          label="City"
          value={watch("city_id")?.toString()}
          onValueChange={(val) => setValue("city_id", Number(val))}
          options={cities.map((c) => ({ id: c.id.toString(), name: c.name }))}
          loading={isLocLoading}
          disabled={!selectedState}
          error={errors.city_id?.message}
        />
      </div>

      <FormInput
        label="Address"
        registration={register("address")}
        error={errors.address?.message}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Bank Accounts
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ bank_name: "", account_number: "", holder_name: "" })
            }
            className="h-7 text-[10px] uppercase font-bold"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Bank
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-xl bg-muted/10 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <FormInput
                label="Bank Name"
                registration={register(`bank_accounts.${index}.bank_name`)}
                error={errors.bank_accounts?.[index]?.bank_name?.message}
              />
              <FormInput
                label="Holder Name"
                registration={register(`bank_accounts.${index}.holder_name`)}
                error={errors.bank_accounts?.[index]?.holder_name?.message}
              />
              <div className="flex gap-2">
                <FormInput
                  label="A/C Number"
                  className="flex-1"
                  registration={register(
                    `bank_accounts.${index}.account_number`,
                  )}
                  error={errors.bank_accounts?.[index]?.account_number?.message}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mb-1 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
          label="Supplier Type"
          value={watch("supplier_type_id")?.toString()}
          onValueChange={(val) => setValue("supplier_type_id", Number(val))}
          options={[
            { id: "1", name: "Wholesale" },
            { id: "2", name: "Retail" },
          ]}
          error={errors.supplier_type_id?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Birthday"
          type="date"
          registration={register("birthday")}
          error={errors.birthday?.message}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-8 text-xs font-bold rounded-xl bg-primary shadow-md"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
