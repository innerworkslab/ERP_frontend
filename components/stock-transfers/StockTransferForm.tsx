"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inventoryService } from "@/api/inventories.service";
import { productService } from "@/api/products.service";
import { uomService } from "@/api/uom.service";
import {
  stockTransferService,
  StockTransfer,
} from "@/api/stockTransfers.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import {
  StockTransferFormValues,
  stockTransferSchema,
} from "../stock-transfers/schema";
import { ApiResponse } from "@/types/api.type";
import { stockBalanceService } from "@/api/stockBalances.service";

interface Props {
  initialData?: StockTransfer | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function StockTransferForm({
  initialData,
  onSuccess,
  setLoading,
}: Props) {
  const [inventories, setInventories] = useState<
    { id: string; name: string }[]
  >([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [uoms, setUoms] = useState<{ id: string; name: string }[]>([]);
  const [lotOptions, setLotOptions] = useState<
    Record<number, { id: string; name: string }[]>
  >({});

  const { request, loading: apiLoading } = useApi<ApiResponse<StockTransfer>>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StockTransferFormValues>({
    resolver: yupResolver(stockTransferSchema),
    defaultValues: {
      transfer_date: new Date().toISOString().split("T")[0],
      source_inventory_id: 0,
      target_inventory_id: 0,
      remarks: "",
      lines: [
        { product_id: 0, quantity: 1, uom_id: 1, lot_no: "", remarks: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const watchedLines = useWatch({ control, name: "lines" });
  const sourceInventoryId = useWatch({
    control,
    name: "source_inventory_id",
  });

  useEffect(() => setLoading?.(apiLoading), [apiLoading, setLoading]);

  useEffect(() => {
    const loadDependencies = async () => {
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
            transfer_date: initialData.transfer_date,
            source_inventory_id: initialData.source_inventory_id,
            target_inventory_id: initialData.target_inventory_id,
            remarks: initialData.remarks || "",
            lines: initialData.lines?.map((l) => ({
              product_id: l.product_id,
              quantity: Number(l.quantity),
              uom_id: l.uom_id,
              lot_no: l.lot_no || "",
              remarks: l.remarks || "",
            })),
          });
        }
      } catch {
        toast.error("Failed to load form dependencies");
      }
    };
    loadDependencies();
  }, [initialData, reset]);

  useEffect(() => {
    const fetchLots = async () => {
      const map: Record<number, { id: string; name: string }[]> = {};

      await Promise.all(
        watchedLines!.map(async (line, index) => {
          if (!line.product_id) {
            map[index] = [];
            return;
          }

          const res = await stockBalanceService.getProductLots(line.product_id);

          map[index] = (res.data || [])
            .filter((l) => Number(l.total_qty) > 0)
            .map((l) => ({
              id: l.lot_no,
              name: `${l.lot_no} (${l.total_qty})`,
            }));
        }),
      );

      console.log("map", map);

      setLotOptions(map);
    };

    fetchLots();
  }, [watchedLines, sourceInventoryId]);

  const onSubmit = async (data: StockTransferFormValues) => {
    const payload = {
      ...data,
      remarks: data.remarks || null,
      lines: data.lines!.map((line) => ({
        ...line,
        remarks: line.remarks || null,
      })),
    };

    const res = await request(() =>
      initialData
        ? stockTransferService.update(initialData.id, payload)
        : stockTransferService.create(payload),
    );

    if (res) {
      toast.success(
        res.response?.message ||
          `Transfer ${initialData ? "updated" : "created"} successfully`,
      );
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="source_inventory_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Source Warehouse"
              options={inventories}
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.source_inventory_id?.message}
            />
          )}
        />
        <Controller
          name="target_inventory_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Target Warehouse"
              options={inventories}
              value={field.value.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
              error={errors.target_inventory_id?.message}
            />
          )}
        />
        <FormInput
          label="Transfer Date"
          type="date"
          registration={register("transfer_date")}
          error={errors.transfer_date?.message}
        />
        <FormInput
          label="Remarks"
          registration={register("remarks")}
          placeholder="Reason for transfer..."
        />
      </div>

      <div className="flex items-center justify-between px-1 border-b border-white/5 pb-4">
        <h3 className="font-bold uppercase tracking-widest text-primary text-xs">
          Transfer Items ({fields.length})
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              product_id: 0,
              quantity: 1,
              uom_id: 1,
              lot_no: "",
              remarks: "",
            })
          }
          className="rounded-md h-8 border border-dashed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {fields.map((field, index) => (
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

            <div className="col-span-3">
              <Controller
                name={`lines.${index}.lot_no`}
                control={control}
                render={({ field: lField }) => (
                  <FormSelect
                    label={index === 0 ? "Lot" : ""}
                    options={lotOptions[index] || []}
                    value={lField.value || ""}
                    onValueChange={lField.onChange}
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
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={apiLoading} className="min-w-[140px]">
          {apiLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Update Stock Transfer"
          ) : (
            "Create stock Transfer"
          )}
        </Button>
      </div>
    </form>
  );
}
