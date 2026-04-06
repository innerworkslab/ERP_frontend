"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { collectionSchema, CollectionFormValues } from "./schema";
import { collectionsService, Collection } from "@/api/collections.service";
import { currencyService } from "@/api/currencies.service";
import { taxService } from "@/api/taxes.service";
import { uomService } from "@/api/uom.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, ReceiptEuro, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialData?: Collection | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function CollectionForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [taxes, setTaxes] = useState<Option[]>([]);
  const [uoms, setUoms] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormValues>({
    resolver: yupResolver(collectionSchema),
    defaultValues: { status: "active" },
  });

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  const loadInitialData = useCallback(async () => {
    const [currRes, taxRes, uomRes] = await Promise.all([
      currencyService.getAll(),
      taxService.getAll(),
      uomService.getAll(),
    ]);

    setCurrencies(
      currRes.data.map((c) => ({
        id: c.id.toString(),
        name: `${c.name} (${c.symbol})`,
      })),
    );
    setTaxes(
      taxRes.data.map((t) => ({ id: t.id.toString(), name: t.category })),
    );
    setUoms(uomRes.map((u) => ({ id: u.id.toString(), name: u.name })));
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        purchase_price: Number(initialData.purchase_price),
        sale_price: Number(initialData.sale_price),
        purchase_currency_id: initialData.purchase_currency_id,
        purchase_tax_id: initialData.purchase_tax_id,
        purchase_uom_id: initialData.purchase_uom_id,
        sale_currency_id: initialData.sale_currency_id,
        sale_tax_id: initialData.sale_tax_id,
        sale_uom_id: initialData.sale_uom_id,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CollectionFormValues) => {
    const res = initialData
      ? await collectionsService.update(initialData.id, data)
      : await collectionsService.create(data);
    if (res) {
      toast.success(
        res.response?.message || initialData
          ? "Collection updated successfully."
          : "Collection created successfully.",
      );
      onSuccess();
    }
  };

  return (
    <form
      id="collection-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 py-2"
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FormInput
            label="Collection Name"
            registration={register("name")}
            error={errors.name?.message}
            placeholder="e.g. Summer Collection 2026"
          />
        </div>

        <div>
          <FormSelect
            label="Status"
            value={watch("status")}
            onValueChange={(val) => setValue("status", val)}
            options={[
              { id: "active", name: "Active" },
              { id: "inactive", name: "Inactive" },
            ]}
          />
        </div>

        <div className="col-span-2 grid grid-cols-4 gap-6">
          <FormInput
            label="Purchase Price"
            type="number"
            registration={register("purchase_price")}
            error={errors.purchase_price?.message}
          />

          <Controller
            name="purchase_currency_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Purchase Currency"
                options={currencies}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.purchase_currency_id?.message}
              />
            )}
          />

          <Controller
            name="purchase_tax_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Purchase Tax"
                options={taxes}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.purchase_tax_id?.message}
              />
            )}
          />

          <Controller
            name="purchase_uom_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Purchase UOM"
                options={uoms}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.purchase_uom_id?.message}
              />
            )}
          />
        </div>

        <div className="col-span-2 grid grid-cols-4 gap-6">
          <FormInput
            label="Sale Price"
            type="number"
            registration={register("sale_price")}
            error={errors.sale_price?.message}
          />

          <Controller
            name="sale_currency_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Sale Currency"
                options={currencies}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.sale_currency_id?.message}
              />
            )}
          />

          <Controller
            name="sale_tax_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Sale Tax"
                options={taxes}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.sale_tax_id?.message}
              />
            )}
          />

          <Controller
            name="sale_uom_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Sale UOM"
                options={uoms}
                value={field.value?.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
                error={errors.sale_uom_id?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : initialData ? (
            "Update Collection"
          ) : (
            "Save Collection"
          )}
        </Button>
      </div>
    </form>
  );
}
