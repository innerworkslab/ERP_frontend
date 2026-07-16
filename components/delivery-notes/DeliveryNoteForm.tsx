"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { deliveryNoteService } from "@/api/deliveryNotes.service";
import { saleInvoicesService } from "@/api/sale.service";
import { deliveryProvidersService } from "@/api/deliveryProvider.service";
import { productService } from "@/api/products.service";

import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { deliveryNoteSchema, FormValues } from "./schema";

export default function DeliveryNoteForm({
  initialData = null,
}: {
  initialData?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleIdFromUrl = searchParams.get("sale_invoice_id");

  const [invoices, setInvoices] = useState<{ id: number; name: string }[]>([]);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [fullInvoiceItems, setFullInvoiceItems] = useState<any[]>([]);

  const isUpdate = !!initialData;
  const forcedSaleId =
    initialData?.sale_invoice_id ||
    (saleIdFromUrl ? Number(saleIdFromUrl) : null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(deliveryNoteSchema),
    defaultValues: {
      sale_invoice_id: forcedSaleId || 0,
      items: [
        { sale_invoice_item_id: 0, product_id: 0, quantity: 0, remark: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const formValues = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else if (forcedSaleId) {
      setValue("sale_invoice_id", forcedSaleId);
    }
  }, [initialData, reset, forcedSaleId, setValue]);

  useEffect(() => {
    Promise.all([
      saleInvoicesService.getAll(),
      deliveryProvidersService.getAll(),
      productService.getAll(),
    ]).then(([inv, prov, prod]) => {
      setInvoices(
        (inv.data || []).map((i: any) => ({
          id: i.id,
          name: i.invoice_number,
        })),
      );
      setProviders(
        (prov.data || []).map((i: any) => ({ id: i.id, name: i.name })),
      );
      setProducts(
        (prod.data || []).map((i: any) => ({ id: i.id, name: i.name })),
      );
    });
  }, []);

  useEffect(() => {
    if (formValues.sale_invoice_id) {
      saleInvoicesService
        .getById(Number(formValues.sale_invoice_id))
        .then((res) => {
          setFullInvoiceItems(res.data?.items || []);
        });
    }
  }, [formValues.sale_invoice_id]);

  const handleItemChange = (index: number, itemId: number) => {
    const selectedItem = fullInvoiceItems.find((i) => i.id === itemId);
    if (selectedItem) {
      setValue(`items.${index}.product_id`, selectedItem.product_id);
    }
  };

  const onSubmit = async (data: FormValues) => {
      if (isUpdate) {
        await deliveryNoteService.update(initialData.id, data);
        toast.success("Delivery Note updated successfully");
      } else {
        await deliveryNoteService.create(data);
        toast.success("Delivery Note created successfully");
      }
      router.push(`/auth/delivery-notes${saleIdFromUrl ? `?sale_invoice_id=${saleIdFromUrl}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!forcedSaleId && (
          <Controller
            name="sale_invoice_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Sale Invoice"
                options={invoices}
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
                error={errors.sale_invoice_id?.message}
              />
            )}
          />
        )}
        <Controller
          name="delivery_provider_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Provider"
              options={providers}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.delivery_provider_id?.message}
            />
          )}
        />
        <FormInput
          label="Delivery Date"
          type="date"
          registration={register("delivery_date")}
          error={errors.delivery_date?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Receiver Name"
          registration={register("receiver_name")}
          error={errors.receiver_name?.message}
        />
        <FormInput
          label="Receiver Phone"
          registration={register("receiver_phone")}
          error={errors.receiver_phone?.message}
        />
        <FormInput
          label="Address"
          registration={register("receiver_address")}
          error={errors.receiver_address?.message}
        />
      </div>

      <div className="space-y-4 border rounded-xl p-4 bg-muted/10">
        <div className="flex justify-between items-center">
          <Label>Delivery Items</Label>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              append({
                sale_invoice_item_id: 0,
                product_id: 0,
                quantity: 0,
                remark: "",
              })
            }
          >
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>
        {fields.map((field, index) => {
          const selectedItem = fullInvoiceItems.find(
            (i) => i.id === formValues.items[index]?.sale_invoice_item_id,
          );
          const maxQty = selectedItem ? Number(selectedItem.quantity) : 0;

          return (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4"
            >
              <Controller
                name={`items.${index}.sale_invoice_item_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Invoice Item"
                    options={fullInvoiceItems.map((i) => ({
                      id: i.id,
                      name: `${i.product.name} (Max: ${i.quantity})`,
                    }))}
                    value={field.value?.toString()}
                    onValueChange={(v) => {
                      field.onChange(Number(v));
                      handleItemChange(index, Number(v));
                    }}
                    error={errors.items?.[index]?.sale_invoice_item_id?.message}
                  />
                )}
              />
              <Controller
                name={`items.${index}.product_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Product"
                    options={products}
                    disabled
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(Number(v))}
                  />
                )}
              />
              <FormInput
                label={`Quantity (Max: ${maxQty})`}
                type="number"
                registration={register(`items.${index}.quantity` as const)}
              />
              <div className="flex items-center gap-2">
                <FormInput
                  label="Remark"
                  registration={register(`items.${index}.remark` as const)}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Saving..."
            : isUpdate
              ? "Update Delivery Note"
              : "Create Delivery Note"}
        </Button>
      </div>
    </form>
  );
}
