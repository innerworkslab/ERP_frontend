/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseReturnSchema, PurchaseReturnFormValues } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { purchaseReturnService } from "@/api/purchaseReturn.service";
import { goodReceiptNotesService } from "@/api/goodsReceiveNotes.service";

interface Props {
  returnData?: any | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

const returnTypeOptions: Option[] = [
  { id: "exchange", name: "Exchange / Substitution" },
  { id: "fully_returned", name: "Full Reversal Return" },
];

const exchangeTypeOptions: Option[] = [
  { id: "partial", name: "Partial Exchange" },
  { id: "full", name: "Full Exchange" },
];

const reasonOptions: Option[] = [
  { id: "damaged", name: "Damaged Consignment" },
  { id: "quality_issue", name: "Quality Standard Breach" },
  { id: "wrong_item", name: "Incorrect Item Delivered" },
  { id: "expired", name: "Expired Batch Inventory" },
];

export default function PurchaseReturnForm({
  returnData,
  onSuccess,
  setLoading,
}: Props) {
  const [grnOptions, setGrnOptions] = useState<Option[]>([]);
  const [rawGrnLines, setRawGrnLines] = useState<any[]>([]);
  const [selectedGrnLinesOptions, setSelectedGrnLinesOptions] = useState<
    Option[]
  >([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(purchaseReturnSchema),
    defaultValues: returnData
      ? {
          goods_receive_note_id: returnData.goods_receive_note_id,
          return_date: returnData.return_date,
          return_type: returnData.return_type,
          exchange_type: returnData.exchange_type || "partial",
          remarks: returnData.remarks || "",
          lines:
            returnData.lines?.map((line: any) => ({
              goods_receive_note_line_id: line.goods_receive_note_line_id,
              return_quantity: Number(line.return_quantity),
              reason: line.reason,
              remarks: line.remarks || "",
              unit_price: Number(line.unit_price || 0),
              tax_amount: Number(line.tax_amount || 0),
              line_total: Number(line.line_total || 0),
            })) || [],
        }
      : {
          return_date: new Date().toISOString().split("T")[0],
          return_type: "exchange",
          exchange_type: "partial",
          remarks: "",
          lines: [
            {
              goods_receive_note_line_id: 0,
              return_quantity: 0,
              reason: "damaged",
              remarks: "",
              unit_price: 0,
              tax_amount: 0,
              line_total: 0,
            },
          ],
        },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "lines",
  });

  const watchedLines = useWatch({ control, name: "lines" });
  const selectedGrnId = watch("goods_receive_note_id");
  const returnType = watch("return_type");

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    const fetchGrnLedger = async () => {
      try {
        const response = await goodReceiptNotesService.getAll();
        if (response?.data) {
          const approvedGrns = response.data.filter(
            (grn: any) => grn.status?.toLowerCase() === "approved",
          );

          setGrnOptions(
            approvedGrns.map((grn: any) => ({
              id: grn.id.toString(),
              name: `${grn.grn_no} (${grn.supplier?.name || grn.supplier || "Vendor"})`,
            })),
          );
        }
      } catch (err) {
        console.error("Failed loading target operational GRN dataset:", err);
      }
    };
    fetchGrnLedger();
  }, []);

  useEffect(() => {
    if (!selectedGrnId) return;

    const fetchGrnDetails = async () => {
      try {
        const response = await goodReceiptNotesService.getById(
          Number(selectedGrnId),
        );
        const linesData = response?.data?.lines || [];
        setRawGrnLines(linesData);

        setSelectedGrnLinesOptions(
          linesData.map((l: any) => ({
            id: l.id.toString(),
            name: `${l.product?.name || "Product"} — Max returnable: ${l.good_quantity || l.received_quantity || 0}`,
          })),
        );
      } catch (err) {
        console.error(
          "Failed loading specific document row context metadata:",
          err,
        );
      }
    };

    fetchGrnDetails();
  }, [selectedGrnId]);

  useEffect(() => {
    if (!watchedLines?.length || !rawGrnLines.length) return;

    let totalSubtotal = 0;
    let totalTax = 0;
    let totalGrand = 0;

    watchedLines.forEach((line, index) => {
      const matchGrnLine = rawGrnLines.find(
        (l) => l.id === Number(line?.goods_receive_note_line_id),
      );
      if (!matchGrnLine) return;

      const basePrice = Number(matchGrnLine.unit_price) || 0;
      const taxAllocationUnit =
        (Number(matchGrnLine.allocated_tax_amount) ||
          Number(matchGrnLine.tax_amount) ||
          0) / (Number(matchGrnLine.received_quantity) || 1);
      const qty = Number(line?.return_quantity) || 0;

      const calcTaxAmount = qty * taxAllocationUnit;
      const calcLineTotal = qty * basePrice + calcTaxAmount;

      totalSubtotal += qty * basePrice;
      totalTax += calcTaxAmount;
      totalGrand += calcLineTotal;

      if (line?.unit_price !== basePrice) {
        setValue(`lines.${index}.unit_price`, basePrice, {
          shouldDirty: false,
        });
      }
      if (line?.tax_amount !== calcTaxAmount) {
        setValue(`lines.${index}.tax_amount`, calcTaxAmount, {
          shouldDirty: false,
        });
      }
      if (line?.line_total !== calcLineTotal) {
        setValue(`lines.${index}.line_total`, calcLineTotal, {
          shouldDirty: false,
        });
      }
    });

    setValue("subtotal_amount", totalSubtotal, { shouldDirty: false });
    setValue("tax_amount", totalTax, { shouldDirty: false });
    setValue("total_amount", totalGrand, { shouldDirty: false });
  }, [watchedLines, rawGrnLines, setValue]);

  const onSubmit = async (data: any) => {
    const payload: any = {
      goods_receive_note_id: Number(data.goods_receive_note_id),
      return_date: data.return_date,
      return_type: data.return_type,
      remarks: data.remarks || "",
      lines: data.lines.map((l: any) => ({
        goods_receive_note_line_id: Number(l.goods_receive_note_line_id),
        return_quantity: Number(l.return_quantity),
        reason: l.reason,
      })),
    };

    if (data.return_type === "exchange") {
      payload.exchange_type = data.exchange_type || "partial";
    }

    try {
      if (returnData?.id) {
        await purchaseReturnService.update(returnData.id, payload);
        toast.success("Purchase return document successfully modified.");
      } else {
        await purchaseReturnService.create(payload);
        toast.success("Purchase return document successfully recorded.");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div
        className={`grid gap-4 bg-muted/20 p-6 rounded-3xl border border-white/5 ${returnType === "exchange" ? "grid-cols-4" : "grid-cols-3"}`}
      >
        <Controller
          name="goods_receive_note_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Source GRN Mapping Reference"
              options={grnOptions}
              value={field.value?.toString()}
              onValueChange={(v) => {
                field.onChange(Number(v));
                replace([
                  {
                    goods_receive_note_line_id: 0,
                    return_quantity: 0,
                    reason: "damaged",
                    remarks: "",
                    unit_price: 0,
                    tax_amount: 0,
                    line_total: 0,
                  },
                ]);
              }}
              error={errors.goods_receive_note_id?.message}
            />
          )}
        />

        <FormInput
          type="date"
          label="Return Execution Date"
          registration={register("return_date")}
          error={errors.return_date?.message}
        />

        <Controller
          name="return_type"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Return Classification Block"
              options={returnTypeOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.return_type?.message}
            />
          )}
        />

        {returnType === "exchange" && (
          <Controller
            name="exchange_type"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Exchange Scope Type"
                options={exchangeTypeOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.exchange_type?.message}
              />
            )}
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            Returned Lines Segment Allocation
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={!selectedGrnId}
            onClick={() =>
              append({
                goods_receive_note_line_id: 0,
                return_quantity: 0,
                reason: "damaged",
                remarks: "",
                unit_price: 0,
                tax_amount: 0,
                line_total: 0,
              })
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Append Row Item
          </Button>
        </div>

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="relative grid grid-cols-6 gap-4 p-4 pt-10 bg-card rounded-2xl border border-white/5 items-end"
          >
            <div className="absolute top-3 right-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="col-span-2">
              <Controller
                name={`lines.${index}.goods_receive_note_line_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Item / Service"
                    options={selectedGrnLinesOptions}
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(Number(v))}
                    error={
                      errors.lines?.[index]?.goods_receive_note_line_id?.message
                    }
                  />
                )}
              />
            </div>

            <div className="col-span-2">
              <Controller
                name={`lines.${index}.reason`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Reason"
                    options={reasonOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.lines?.[index]?.reason?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <FormInput
                type="number"
                label="Qty"
                registration={register(`lines.${index}.return_quantity`, {
                  valueAsNumber: true,
                })}
                error={errors.lines?.[index]?.return_quantity?.message}
              />
            </div>

            <div className="col-span-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Unit Cost
                </label>
                <div className="h-10 px-3 flex items-center bg-muted/20 rounded-xl border text-sm font-mono">
                  {Number(
                    watchedLines?.[index]?.unit_price || 0,
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <FormInput
                type="text"
                label="Remarks"
                registration={register(`lines.${index}.remarks`)}
              />
            </div>

            <div className="col-span-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Line Total
                </label>
                <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border text-sm font-mono font-bold text-foreground">
                  {Number(
                    watchedLines?.[index]?.line_total || 0,
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
        <div className="col-span-2">
          <FormInput
            label="Remarks"
            type="textarea"
            registration={register("remarks")}
          />
        </div>
        <div className="bg-card/40 p-4 rounded-2xl border border-white/5 space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>
              {Number(watch("subtotal_amount") || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-emerald-400 items-center">
            <span>Accrued Taxes:</span>
            <span>{Number(watch("tax_amount") || 0).toLocaleString()}</span>
            <span className="hidden">
              <FormInput
                type="number"
                registration={register("tax_amount", { valueAsNumber: true })}
                disabled
              />
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-primary">
            <span>Grand Total:</span>
            <span>{Number(watch("total_amount") || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] rounded-2xl"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : returnData ? (
            "Modify Reversal Record"
          ) : (
            "Commit Return Ledger"
          )}
        </Button>
      </div>
    </form>
  );
}
