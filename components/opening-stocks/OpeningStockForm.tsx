"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { openingStockSchema, OpeningStockFormValues } from "./schema";
import { inventoryService } from "@/api/inventories.service";
import { productService } from "@/api/products.service";
import { uomService } from "@/api/uom.service";
import { openingStockService, OpeningStock } from "@/api/openingStocks.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { ApiResponse } from "@/types/api.type";

interface Props {
  initialData?: OpeningStock | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function OpeningStockForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [inventories, setInventories] = useState<
    { id: string; name: string }[]
  >([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [uoms, setUoms] = useState<{ id: string; name: string }[]>([]);

  // 1. Initialize useApi with the specific response type
  const { request, loading: apiLoading } = useApi<ApiResponse<OpeningStock>>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OpeningStockFormValues>({
    resolver: yupResolver(openingStockSchema),
    defaultValues: {
      inventory_id: 0,
      remarks: "",
      status: "pending",
      total_amount: 0,
      lines: [
        {
          product_id: 0,
          quantity: 1,
          uom_id: 0,
          purchase_price: 0,
          subtotal: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const watchedLines = useWatch({ control, name: "lines" });

  const calculatedGrandTotal = useMemo(() => {
    return (watchedLines || []).reduce((acc, line) => {
      const qty = Number(line?.quantity) || 0;
      const price = Number(line?.purchase_price) || 0;
      return acc + qty * price;
    }, 0);
  }, [watchedLines]);

  useEffect(() => {
    setValue("total_amount", calculatedGrandTotal);
  }, [calculatedGrandTotal, setValue]);

  // Sync internal apiLoading with parent setLoading
  useEffect(() => setLoading?.(apiLoading), [apiLoading, setLoading]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invRes, prodRes, uomRes] = await Promise.all([
          inventoryService.getAll(),
          productService.getAll(),
          uomService.getAll(),
        ]);

        setInventories(
          invRes.data.map((i) => ({ id: i.id.toString(), name: i.name })),
        );
        setProducts(
          prodRes.data.map((p) => ({
            id: p.id.toString(),
            name: `${p.name} (${p.sku})`,
          })),
        );
        setUoms(uomRes.map((u) => ({ id: u.id.toString(), name: u.name })));

        if (initialData) {
          reset({
            inventory_id: initialData.inventory_id,
            remarks: initialData.remarks || "",
            status: initialData.status,
            total_amount: Number(initialData.total_amount),
            lines: initialData.lines?.map((l) => ({
              product_id: l.product_id,
              quantity: Number(l.quantity),
              uom_id: l.uom_id,
              purchase_price: Number(l.purchase_price),
              subtotal: Number(l.subtotal),
              lot_no: l.lot_no || null,
              expired_date: l.expired_date || null,
              serial_no: l.serial_no || null,
              remarks: l.remarks || null,
            })),
          });
        }
      } catch (err) {
        toast.error("Failed to load dependencies");
      }
    };
    loadData();
  }, [initialData, reset]);

  const onSubmit = async (data: OpeningStockFormValues) => {
    const payload = {
      ...data,
      remarks: data.remarks || null,
      total_amount: calculatedGrandTotal,
      lines: data.lines!.map((line) => ({
        ...line,
        subtotal: Number(line.quantity) * Number(line.purchase_price),
        remarks: line.remarks || null,
        lot_no: line.lot_no || null,
        serial_no: line.serial_no || null,
        expired_date: line.expired_date || null,
      })),
    };

    // 2. Wrap the API call in the request function
    const res = await request(() =>
      initialData
        ? openingStockService.update(initialData.id, payload)
        : openingStockService.create(payload),
    );

    if (res) {
      toast.success(
        res.response?.message ||
          `Opening stock ${initialData ? "updated" : "created"}`,
      );
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="inventory_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Warehouse"
              options={inventories}
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.inventory_id?.message}
            />
          )}
        />
        <FormInput
          label="Remarks"
          registration={register("remarks")}
          placeholder="Notes..."
        />
      </div>

      <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">
            Voucher Lines
          </h3>
          <div className="text-sm font-medium">
            Grand Total:{" "}
            <span className="text-primary font-black">
              {calculatedGrandTotal.toLocaleString()}
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              product_id: 0,
              quantity: 1,
              uom_id: 1,
              purchase_price: 0,
              subtotal: 0,
            })
          }
          className="rounded-md h-8 border border-dashed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {fields.map((field, index) => {
          const rowQty = Number(watchedLines?.[index]?.quantity) || 0;
          const rowPrice = Number(watchedLines?.[index]?.purchase_price) || 0;
          const rowSubtotal = rowQty * rowPrice;

          return (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-3 p-4 rounded-2xl bg-card border border-white/5 items-end transition-all hover:bg-muted/10"
            >
              <div className="col-span-4">
                <Controller
                  name={`lines.${index}.product_id`}
                  control={control}
                  render={({ field: pField }) => (
                    <FormSelect
                      label={index === 0 ? "Product" : ""}
                      options={products}
                      value={pField.value?.toString() || "0"}
                      onValueChange={(val) => pField.onChange(Number(val))}
                      error={errors.lines?.[index]?.product_id?.message}
                    />
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormInput
                  label={index === 0 ? "Qty" : ""}
                  type="number"
                  registration={register(`lines.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="col-span-2">
                <Controller
                  name={`lines.${index}.uom_id`}
                  control={control}
                  render={({ field: uField }) => (
                    <FormSelect
                      label={index === 0 ? "Unit" : ""}
                      options={uoms}
                      value={uField.value?.toString() || "0"}
                      onValueChange={(val) => uField.onChange(Number(val))}
                    />
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormInput
                  label={index === 0 ? "Price" : ""}
                  type="number"
                  registration={register(`lines.${index}.purchase_price`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center h-10 bg-primary/5 rounded-lg border border-primary/10">
                <span className="text-[9px] uppercase font-bold text-primary">
                  Total
                </span>
                <span className="text-sm font-black">
                  {rowSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="col-span-1 flex justify-center pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-destructive hover:bg-destructive/10 h-10 w-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={apiLoading} className="min-w-[140px]">
          {apiLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Update Opening Stock"
          ) : (
            "Create Opening stock"
          )}
        </Button>
      </div>
    </form>
  );
}
