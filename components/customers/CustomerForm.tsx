"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerSchema } from "./schema";
import { customerService } from "@/api/customers.service";
import { branchService } from "@/api/branches.service";
import { stateService, State } from "@/api/states.service";
import { cityService, City } from "@/api/cities.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import * as yup from "yup";
import { Button } from "../ui/button";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { customerTypeService } from "@/api/customerTypes.service";

type CustomerFormValues = yup.InferType<typeof customerSchema>;

export default function CustomerForm() {
  const router = useRouter();
  const params = useParams();

  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [customerTypes, setCustomerTypes] = useState<
    { id: number; name: string }[]
  >([]);
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
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      name: "",
      company_name: "",
      phone_number: "",
      status: "Active",
      customer_type_id: 1,
      credit_limit: 0,
      opening: 0,
      bank_accounts: [{ bank_name: "", account_number: "", holder_name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bank_accounts",
  });

  const selectedState = watch("state_id");

  const fetchCustomerTypes = useCallback(async () => {
    const res = await customerTypeService.getAll();
    if (res?.data) setCustomerTypes(res.data);
  }, []);

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) setBranches(res.data);
    });
    stateService.getAll().then((res) => {
      if (res?.data) setStates(res.data);
    });
    fetchCustomerTypes();
  }, [fetchCustomerTypes]);

  useEffect(() => {
    if (selectedState) {
      setIsLocLoading(true);
      cityService.getAll({ state_id: selectedState }).then((res) => {
        setCities(res.data || []);
        setIsLocLoading(false);
      });
    } else {
      setCities([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (isUpdate && numericId) {
      customerService.getById(numericId).then((res) => {
        if (res?.data) {
          const formattedBirthday = res.data.birthday
            ? new Date(res.data.birthday).toISOString().split("T")[0]
            : "";

          reset({
            ...res.data,
            birthday: formattedBirthday,
            state_id: res.data.state_id,
            city_id: res.data.city_id,
            customer_type_id: res.data.customer_type_id,
            branch_id: res.data.branch_id,
            bank_accounts: res.data.bank_accounts?.length
              ? res.data.bank_accounts
              : [{ bank_name: "", account_number: "", holder_name: "" }],
          });
        }
      });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Customer Name"
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

      <div className="space-y-4 border rounded-xl p-4 bg-muted/10">
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
            className="h-7 text-[10px] uppercase"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Bank
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b pb-4 last:border-0 last:pb-0"
          >
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
                registration={register(`bank_accounts.${index}.account_number`)}
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
          label="Customer Type"
          value={watch("customer_type_id")?.toString()}
          onValueChange={(val) => setValue("customer_type_id", Number(val))}
          options={customerTypes.map((t) => ({
            id: t.id.toString(),
            name: t.name,
          }))}
          onRefresh={fetchCustomerTypes}
          renderCreateForm={(close) => {
            const [typeName, setTypeName] = useState("");
            const [isSaving, setIsSaving] = useState(false);
            const handleCreateType = async () => {
              if (!typeName) return toast.error("Name is required");
              setIsSaving(true);
              try {
                await customerTypeService.create({ name: typeName });
                toast.success("Type added");
                close();
              } catch {
                toast.error("Error creating type");
              } finally {
                setIsSaving(false);
              }
            };
            return (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Type Name</Label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="e.g. Wholesale"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateType}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Type
                </Button>
              </div>
            );
          }}
          error={errors.customer_type_id?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Branch"
          value={watch("branch_id")?.toString()}
          onValueChange={(val) => setValue("branch_id", Number(val))}
          options={branches.map((b) => ({ id: b.id.toString(), name: b.name }))}
          error={errors.branch_id?.message}
        />
        <FormInput
          label="Birthday"
          type="date"
          registration={register("birthday")}
          error={errors.birthday?.message}
        />
      </div>

      <div className="flex justify-end pt-2">
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
