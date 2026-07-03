/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  goodReceiptNotesService,
  GoodsReceiveNote,
  CreateGrnPayload,
} from "@/api/goodsReceiveNotes.service";
import { purchaseService } from "@/api/purchaseOrders.service";
import { currencyService } from "@/api/currencies.service";
import { uomService } from "@/api/uom.service";
import { productService } from "@/api/products.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { GrnFormValues, grnSchema } from "./schema";
import { purchaseReturnService } from "@/api/purchaseReturn.service";

interface Props {
  grnData?: GoodsReceiveNote | null;
  onSuccess: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function GrnForm({ grnData, onSuccess, setLoading }: Props) {
  const [documents, setDocuments] = useState<Option[]>([]);
  const [docLines, setDocLines] = useState<Option[]>([]);
  const [rawDocLines, setRawDocLines] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [uoms, setUoms] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);

  const [usePurchaseReturn, setUsePurchaseReturn] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GrnFormValues>({
    resolver: yupResolver(grnSchema),
    defaultValues: {
      purchase_order_id: "",
      supplier_id: "",
      branch_id: "",
      inventory_id: "",
      currency_id: "",
      grn_date: new Date().toISOString().split("T")[0],
      fee_allocation_method: "by_line_value",
      tax_allocation_method: "by_products",
      cargo_tax_amount: 0,
      discount_amount: 0,
      remarks: "",
      charges: [],
      lines: [],
    },
  });

  const {
    fields: lineFields,
    append: appendLine,
    remove: removeLine,
  } = useFieldArray({
    control,
    name: "lines",
  });

  const {
    fields: chargeFields,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({
    control,
    name: "charges",
  });

  const selectedDocId = watch("purchase_order_id");
  const taxAllocationMethod = watch("tax_allocation_method");
  const cargoTaxAmount = watch("cargo_tax_amount");

  const isByProductTax = taxAllocationMethod === "by_products";

  useEffect(() => {
    if (isByProductTax) {
      lineFields.forEach((_, idx) => {
        setValue(
          `lines.${idx}.manual_tax_amount` as any,
          Number(cargoTaxAmount || 0),
        );
      });
    }
  }, [cargoTaxAmount, isByProductTax, lineFields, setValue]);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const [docRes, currencyRes, uomRes, productRes] = await Promise.all([
          usePurchaseReturn
            ? purchaseReturnService.getAll()
            : purchaseService.getAll(),
          currencyService.getAll(),
          uomService.getAll(),
          productService.getAll(),
        ]);

        setDocuments(
          (docRes?.data || docRes || []).map((item: any) => ({
            id: item.id.toString(),
            name: item.po_number || item.pr_number || `DOC-${item.id}`,
          })),
        );
        setCurrencies(
          (currencyRes?.data || currencyRes || []).map((item) => ({
            id: item.id.toString(),
            name: item.code || item.name || `Currency ${item.id}`,
          })),
        );
        setUoms(
          (uomRes || uomRes || []).map((item) => ({
            id: item.id.toString(),
            name: item.name || item.code || `UOM Token ${item.id}`,
          })),
        );
        setProducts(
          (productRes?.data || productRes || []).map((item) => ({
            id: item.id.toString(),
            name: item.name || `Product ${item.id}`,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdownOptions();
  }, [usePurchaseReturn]);

  useEffect(() => {
    if (!selectedDocId) {
      setDocLines([]);
      setRawDocLines([]);
      return;
    }

    const fetchSelectedDocDetails = async () => {
      try {
        const response = usePurchaseReturn
          ? await purchaseReturnService.getById(Number(selectedDocId))
          : await purchaseService.getById(Number(selectedDocId));

        const docData = response?.data || response;
        const activeLines = docData?.lines || [];

        setRawDocLines(activeLines);
        setDocLines(
          activeLines.map((line: any) => ({
            id: line.id.toString(),
            name: line.product?.name
              ? `Line #${line.id} - ${line.product.name}`
              : `Line Allocation Reference #${line.id}`,
          })),
        );

        if (docData?.branch_id)
          setValue("branch_id", docData.branch_id.toString());
        if (docData?.supplier_id)
          setValue("supplier_id", docData.supplier_id.toString());
        if (docData?.inventory_id)
          setValue("inventory_id", docData.inventory_id.toString());
        if (docData?.currency_id)
          setValue("currency_id", docData.currency_id.toString());
      } catch (err) {
        console.error(err);
      }
    };

    fetchSelectedDocDetails();
  }, [selectedDocId, usePurchaseReturn, setValue]);

  useEffect(() => {
    if (grnData) {
      const isPrMode = !!(grnData as any).purchase_return_id;
      setUsePurchaseReturn(isPrMode);

      reset({
        purchase_order_id:
          (isPrMode
            ? (grnData as any).purchase_return_id
            : grnData.purchase_order_id
          )?.toString() || "",
        supplier_id: grnData.supplier_id?.toString() || "",
        branch_id: grnData.branch_id?.toString() || "",
        inventory_id: grnData.inventory_id?.toString() || "",
        currency_id: grnData.currency_id?.toString() || "",
        grn_date: grnData.grn_date,
        fee_allocation_method: grnData.fee_allocation_method,
        tax_allocation_method: grnData.tax_allocation_method,
        cargo_tax_amount: Number(grnData.cargo_tax_amount || 0),
        discount_amount: Number(grnData.discount_amount || 0),
        remarks: grnData.remarks || "",
        charges:
          grnData.charges?.map((c) => ({
            charge_type: c.charge_type,
            currency_id: Number(c.currency_id),
            amount: Number(c.amount),
            description: c.description || "",
          })) || [],
        lines: grnData.lines?.map((l) => ({
          purchase_order_line_id:
            (
              l.purchase_order_line_id || (l as any).purchase_return_line_id
            )?.toString() || "",
          product_id: Number(l.product_id),
          uom_id: l.uom_id?.toString() || "",
          ordered_quantity: Number(l.ordered_quantity || 0),
          received_quantity: Number(l.received_quantity || 0),
          good_quantity: Number(l.good_quantity || 0),
          unit_price: Number(l.unit_price || 0),
          line_weight: Number(l.line_weight || 0),
          manual_tax_amount: Number(
            l.manual_tax_amount || l.allocated_tax_amount || 0,
          ),
          discrepancy_reason: l.discrepancy_reason || "none",
          defect_responsibility: l.defect_responsibility || "none",
          remarks: l.remarks || "",
        })) as any,
      });
    }
  }, [grnData, reset]);

  const onSubmit = async (data: GrnFormValues) => {
    setLoading(true);

    const payload: any = {
      supplier_id: Number(data.supplier_id),
      branch_id: Number(data.branch_id),
      inventory_id: Number(data.inventory_id),
      currency_id: Number(data.currency_id),
      grn_date: data.grn_date,
      fee_allocation_method: data.fee_allocation_method,
      tax_allocation_method: data.tax_allocation_method,
      cargo_tax_amount: Number(data.cargo_tax_amount || 0),
      discount_amount: Number(data.discount_amount || 0),
      remarks: data.remarks || "",
      charges: (data.charges || []).map((c) => ({
        charge_type: c.charge_type,
        currency_id: Number(c.currency_id),
        amount: Number(c.amount),
        description: c.description || "",
      })),
      lines: (data.lines || []).map((l) => {
        const lineItem: any = {
          product_id: Number(l.product_id),
          uom_id: Number(l.uom_id),
          ordered_quantity: Number(l.ordered_quantity || 0),
          received_quantity: Number(l.received_quantity || 0),
          good_quantity: Number(l.good_quantity || 0),
          unit_price: Number(l.unit_price || 0),
          line_weight: Number(l.line_weight || 0),
          manual_tax_amount: Number(l.manual_tax_amount || 0),
          discrepancy_reason: l.discrepancy_reason || "none",
          defect_responsibility: l.defect_responsibility || "none",
          remarks: l.remarks || "",
        };

        if (usePurchaseReturn) {
          lineItem.purchase_return_line_id = Number(l.purchase_order_line_id);
        } else {
          lineItem.purchase_order_line_id = Number(l.purchase_order_line_id);
        }
        return lineItem;
      }),
    };

    if (usePurchaseReturn) {
      payload.purchase_return_id = Number(data.purchase_order_id);
    } else {
      payload.purchase_order_id = Number(data.purchase_order_id);
    }

    try {
      const result = grnData
        ? await goodReceiptNotesService.update(grnData.id, payload)
        : await goodReceiptNotesService.create(payload);

      if (result?.response?.status === "error") {
        toast.error(result.response.message || "Operation failed");
        setLoading(false);
        return;
      }

      toast.success(result?.response?.message || "Success");
      setLoading(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            Receipt Note Configurations
          </h3>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-muted-foreground select-none">
            <input
              type="checkbox"
              className="rounded border-white/10 accent-primary"
              checked={usePurchaseReturn}
              onChange={(e) => {
                setUsePurchaseReturn(e.target.checked);
                setValue("purchase_order_id", "");
                setDocLines([]);
                setRawDocLines([]);
              }}
            />
            Process as Purchase Return (PR)
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Controller
            name="purchase_order_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label={
                  usePurchaseReturn
                    ? "Target Purchase Return"
                    : "Target Purchase Order"
                }
                options={documents}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.purchase_order_id?.message}
              />
            )}
          />

          <FormInput
            type="date"
            label="GRN Execution Date"
            registration={register("grn_date")}
            error={errors.grn_date?.message}
          />

          <Controller
            name="currency_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="System Settlement Currency"
                options={currencies}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.currency_id?.message}
              />
            )}
          />

          <Controller
            name="fee_allocation_method"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Fee Allocation Method"
                options={[
                  { id: "by_line_value", name: "By Line Value" },
                  { id: "by_quantity", name: "By Quantity" },
                  { id: "by_weight", name: "By Weight" },
                ]}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.fee_allocation_method?.message}
              />
            )}
          />

          <Controller
            name="tax_allocation_method"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Tax Allocation Method"
                options={[
                  { id: "by_products", name: "By Product" },
                  { id: "by_weight", name: "By Weight" },
                  { id: "manual", name: "Manual Override" },
                ]}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.tax_allocation_method?.message}
              />
            )}
          />

          <FormInput
            type="number"
            label="Cargo Tax Amount"
            registration={register("cargo_tax_amount")}
            error={errors.cargo_tax_amount?.message}
            step="0.01"
            placeholder="0.00"
          />

          <FormInput
            type="number"
            label="Global Deductions Value"
            registration={register("discount_amount")}
            error={errors.discount_amount?.message}
            step="0.01"
            placeholder="0.00"
          />

          <div className="md:col-span-2 lg:col-span-3">
            <FormInput
              label="Audit Internal Narrative / Remarks"
              type="textarea"
              placeholder="Enter ledger entry annotations..."
              registration={register("remarks")}
              error={errors.remarks?.message}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            Received Consignment Variations
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1 h-8"
            onClick={() =>
              appendLine({
                purchase_order_line_id: "",
                product_id: "",
                uom_id: "",
                ordered_quantity: 0,
                received_quantity: 0,
                good_quantity: 0,
                unit_price: 0,
                line_weight: 0,
                discrepancy_reason: "none",
                defect_responsibility: "none",
                remarks: "",
                manual_tax_amount: isByProductTax
                  ? Number(cargoTaxAmount || 0)
                  : 0,
              } as any)
            }
          >
            <Plus className="w-3.5 h-3.5" /> Add Product Row
          </Button>
        </div>

        {lineFields.map((field, idx) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-muted/10 p-5 rounded-2xl border border-white/5 relative pt-10 sm:pt-6"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded-lg w-7 h-7"
              onClick={() => removeLine(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Controller
              name={`lines.${idx}.purchase_order_line_id` as const}
              control={control}
              render={({ field: selectField }) => (
                <FormSelect
                  label={
                    usePurchaseReturn
                      ? "PR Line Selection"
                      : "PO Line Selection"
                  }
                  placeholder={
                    selectedDocId ? "Select line" : "Select source first"
                  }
                  options={docLines}
                  value={selectField.value?.toString() || ""}
                  onValueChange={(val) => {
                    selectField.onChange(val);
                    const matched = rawDocLines.find(
                      (l) => l.id.toString() === val,
                    );
                    if (matched) {
                      setValue(
                        `lines.${idx}.ordered_quantity`,
                        Number(matched.quantity || 0),
                      );
                      setValue(
                        `lines.${idx}.unit_price`,
                        Number(matched.unit_price || 0),
                      );
                      if (matched.product_id)
                        setValue(
                          `lines.${idx}.product_id`,
                          Number(matched.product_id),
                        );
                      if (matched.uom_id)
                        setValue(
                          `lines.${idx}.uom_id`,
                          matched.uom_id.toString(),
                        );
                    }
                  }}
                  error={errors.lines?.[idx]?.purchase_order_line_id?.message}
                />
              )}
            />

            <Controller
              name={`lines.${idx}.product_id` as const}
              control={control}
              render={({ field: selectField }) => (
                <FormSelect
                  label="Product Reference"
                  placeholder="Select Product"
                  options={products}
                  value={selectField.value?.toString() || ""}
                  onValueChange={(val) => selectField.onChange(Number(val))}
                  error={errors.lines?.[idx]?.product_id?.message}
                />
              )}
            />

            <Controller
              name={`lines.${idx}.uom_id` as const}
              control={control}
              render={({ field: selectField }) => (
                <FormSelect
                  label="UOM Token Allocation"
                  placeholder="Select UOM"
                  options={uoms}
                  value={selectField.value?.toString() || ""}
                  onValueChange={selectField.onChange}
                  error={errors.lines?.[idx]?.uom_id?.message}
                />
              )}
            />

            <FormInput
              type="number"
              label="Ordered Qty"
              disabled={true}
              registration={register(`lines.${idx}.ordered_quantity` as const, {
                valueAsNumber: true,
              })}
              error={errors.lines?.[idx]?.ordered_quantity?.message}
            />
            <FormInput
              type="number"
              label="Received Qty"
              registration={register(
                `lines.${idx}.received_quantity` as const,
                { valueAsNumber: true },
              )}
              error={errors.lines?.[idx]?.received_quantity?.message}
            />
            <FormInput
              type="number"
              label="Accepted Good Qty"
              registration={register(`lines.${idx}.good_quantity` as const, {
                valueAsNumber: true,
              })}
              error={errors.lines?.[idx]?.good_quantity?.message}
            />
            <FormInput
              type="number"
              step="0.01"
              label="Unit Price"
              registration={register(`lines.${idx}.unit_price` as const, {
                valueAsNumber: true,
              })}
              error={errors.lines?.[idx]?.unit_price?.message}
            />
            <FormInput
              type="number"
              step="0.01"
              label="Mass Volume (kg)"
              registration={register(`lines.${idx}.line_weight` as const, {
                valueAsNumber: true,
              })}
              error={errors.lines?.[idx]?.line_weight?.message}
            />
            <FormInput
              type="number"
              step="0.01"
              label="Manual Line Tax"
              disabled={isByProductTax}
              registration={register(
                `lines.${idx}.manual_tax_amount` as const,
                { valueAsNumber: true },
              )}
              error={errors.lines?.[idx]?.manual_tax_amount?.message}
            />

            <Controller
              name={`lines.${idx}.discrepancy_reason` as const}
              control={control}
              render={({ field: selectField }) => (
                <FormSelect
                  label="Variance Code"
                  options={[
                    { id: "none", name: "None" },
                    { id: "defect", name: "Defect" },
                    { id: "shortage", name: "Shortage" },
                  ]}
                  value={selectField.value || "none"}
                  onValueChange={selectField.onChange}
                  error={errors.lines?.[idx]?.discrepancy_reason?.message}
                />
              )}
            />

            <Controller
              name={`lines.${idx}.defect_responsibility` as const}
              control={control}
              render={({ field: selectField }) => (
                <FormSelect
                  label="Fault Allocation"
                  options={[
                    { id: "none", name: "N/A" },
                    { id: "supplier_side", name: "Supplier Side" },
                    { id: "carrier_side", name: "Carrier Unit" },
                  ]}
                  value={selectField.value || "none"}
                  onValueChange={selectField.onChange}
                  error={errors.lines?.[idx]?.defect_responsibility?.message}
                />
              )}
            />

            <FormInput
              type="text"
              label="Row Remarks"
              placeholder="Notes..."
              registration={register(`lines.${idx}.remarks` as const)}
              error={errors.lines?.[idx]?.remarks?.message}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            Mapped Overhead Freights
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1 h-8"
            onClick={() =>
              appendCharge({
                charge_type: "cargo",
                currency_id: "",
                amount: 0,
                description: "",
              } as any)
            }
          >
            <Plus className="w-3.5 h-3.5" /> Add Charge Entry
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chargeFields.map((field, idx) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/10 p-4 rounded-2xl border border-white/5 relative pt-10 sm:pt-4"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded-lg w-6 h-6"
                onClick={() => removeCharge(idx)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>

              <FormInput
                type="text"
                label="Charge Vector Type"
                placeholder="e.g., cargo"
                registration={register(`charges.${idx}.charge_type` as const)}
                error={errors.charges?.[idx]?.charge_type?.message}
              />

              <Controller
                name={`charges.${idx}.currency_id` as const}
                control={control}
                render={({ field: selectField }) => (
                  <FormSelect
                    label="Currency Token"
                    placeholder="Select Currency"
                    options={currencies}
                    value={selectField.value?.toString() || ""}
                    onValueChange={(val) => selectField.onChange(Number(val))}
                    error={errors.charges?.[idx]?.currency_id?.message}
                  />
                )}
              />

              <FormInput
                type="number"
                step="0.01"
                label="Overhead Fee Cost"
                placeholder="0.00"
                registration={register(`charges.${idx}.amount` as const, {
                  valueAsNumber: true,
                })}
                error={errors.charges?.[idx]?.amount?.message}
              />
              <div className="sm:col-span-3">
                <FormInput
                  type="text"
                  label="Charge Description Narrative"
                  placeholder="Freight specification detail..."
                  registration={register(`charges.${idx}.description` as const)}
                  error={errors.charges?.[idx]?.description?.message}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] rounded-2xl shadow-xl shadow-primary/20"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : grnData ? (
            "Save Changes"
          ) : (
            "Process Receipt Note"
          )}
        </Button>
      </div>
    </form>
  );
}
