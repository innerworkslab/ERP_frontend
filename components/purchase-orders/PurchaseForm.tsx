"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema, PurchaseFormValues } from "./schema";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { purchaseService } from "@/api/purchases-orders.service";
import { supplierService } from "@/api/suppliers.service";
import { branchService } from "@/api/branches.service";
import { inventoryService } from "@/api/inventories.service";
import { currencyService } from "@/api/currencies.service";
import { productService } from "@/api/products.service";
import { uomService } from "@/api/uom.service";
import { calculateLineTotal, calculateOrderTotals } from "@/utils/math.utils";

interface Props {
  purchaseData?: any | null;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function PurchaseForm({
  purchaseData,
  onSuccess,
  setLoading,
}: Props) {
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [inventories, setInventories] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [uoms, setUoms] = useState<Option[]>([]);
  const [taxes, setTaxes] = useState<Option[]>([]);
  const [taxRatesMap, setTaxRatesMap] = useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormValues>({
    resolver: yupResolver(purchaseSchema),
    defaultValues: purchaseData
      ? {
          po_date: purchaseData.po_date,
          supplier_id: purchaseData.supplier_id,
          branch_id: purchaseData.branch_id,
          inventory_id: purchaseData.inventory_id,
          currency_id: purchaseData.currency_id,
          subtotal_amount: Number(purchaseData.subtotal_amount),
          discount_amount: Number(purchaseData.discount_amount),
          tax_amount: Number(purchaseData.tax_amount),
          total_amount: Number(purchaseData.total_amount),
          remarks: purchaseData.remarks || "",
          lines:
            purchaseData.lines?.map((line: any) => ({
              product_id: line.product_id,
              uom_id: line.uom_id?.toString(),
              quantity: Number(line.quantity),
              unit_price: Number(line.unit_price),
              discount_type: line.discount_type,
              discount_value: Number(line.discount_value),
              discount_amount: Number(line.discount_amount),
              tax_id: line.tax_id?.toString(),
              tax_amount: Number(line.tax_amount),
              expenses_type: line.expenses_type,
              expenses_amount: Number(line.expenses_amount),
              total_amount: Number(line.total_amount),
            })) || [],
        }
      : {
          po_date: new Date().toISOString().split("T")[0],
          currency_id: 1,
          subtotal_amount: 0,
          discount_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          lines: [
            {
              product_id: 0,
              uom_id: "",
              quantity: 0,
              unit_price: 0,
              discount_type: "fixed",
              discount_value: 0,
              discount_amount: 0,
              tax_id: "",
              tax_amount: 0,
              expenses_type: "none",
              expenses_amount: 0,
              total_amount: 0,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const watchedLines = useWatch({ control, name: "lines" });
  const globalDiscount = watch("discount_amount") || 0;
  const globalTax = watch("tax_amount") || 0;

  useEffect(() => {
    setLoading?.(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    const fetchFormMatrices = async () => {
      try {
        const [
          suppliersRes,
          branchesRes,
          inventoriesRes,
          currenciesRes,
          productsRes,
          uomsRes,
        ] = await Promise.all([
          supplierService.getAll(),
          branchService.getAll(),
          inventoryService.getAll(),
          currencyService.getAll(),
          productService.getAll(),
          uomService.getAll().catch(() => null),
        ]);

        if (suppliersRes?.data) {
          setSuppliers(
            suppliersRes.data.map((s) => ({
              id: s.id.toString(),
              name: s.name,
            })),
          );
        }
        if (branchesRes?.data) {
          setBranches(
            branchesRes.data.map((b) => ({
              id: b.id.toString(),
              name: b.name,
            })),
          );
        }
        if (inventoriesRes?.data) {
          setInventories(
            inventoriesRes.data.map((i) => ({
              id: i.id.toString(),
              name: i.name,
            })),
          );
        }
        if (currenciesRes?.data) {
          setCurrencies(
            currenciesRes.data.map((c) => ({
              id: c.id.toString(),
              name: `${c.name}`,
            })),
          );
        }
        if (productsRes?.data) {
          setRawProducts(productsRes.data);
          setProducts(
            productsRes.data.map((p) => ({
              id: p.id.toString(),
              name: p.name,
            })),
          );

          const extractedTaxesMap: Record<
            string,
            { id: string; name: string; amount: number }
          > = {};

          productsRes.data.forEach((p: any) => {
            if (p.purchase_tax) {
              const taxId = p.purchase_tax.id.toString();
              const amountNum = parseFloat(p.purchase_tax.amount) || 0;
              extractedTaxesMap[taxId] = {
                id: taxId,
                name: `${p.purchase_tax.category} (${amountNum}%)`,
                amount: amountNum / 100,
              };
            }
          });

          const dynamicTaxOptions = Object.values(extractedTaxesMap);
          const dynamicRates: Record<string, number> = {};
          dynamicTaxOptions.forEach((t) => {
            dynamicRates[t.id] = t.amount;
          });

          setTaxes([
            { id: "none", name: "No Tax (0%)" },
            ...dynamicTaxOptions.map(({ id, name }) => ({ id, name })),
          ]);
          setTaxRatesMap(dynamicRates);
        }
        if (uomsRes) {
          const uomDataList = uomsRes?.data || uomsRes || [];
          setUoms(
            uomDataList.map((u: any) => ({
              id: u.id.toString(),
              name: u.name || u.code,
            })),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFormMatrices();
  }, []);

  useEffect(() => {
    if (!watchedLines?.length) return;

    const computedLines = watchedLines.map((line, index) => {
      const quantity = Number(line?.quantity) || 0;
      const unitPrice = Number(line?.unit_price) || 0;
      const discValue = Number(line?.discount_value) || 0;

      const discount_amount =
        line?.discount_type === "percentage"
          ? quantity * unitPrice * (discValue / 100)
          : quantity * discValue;

      const taxRate = line?.tax_id ? taxRatesMap[line.tax_id] || 0 : 0;

      const baseForTax = quantity * unitPrice - discount_amount;
      const tax_amount = baseForTax > 0 ? baseForTax * taxRate : 0;

      const total_amount = calculateLineTotal({
        quantity,
        unit_price: unitPrice,
        discount_amount,
        tax_amount,
      });

      if (line?.discount_amount !== discount_amount) {
        setValue(`lines.${index}.discount_amount`, discount_amount, {
          shouldDirty: false,
        });
      }

      if (line?.tax_amount !== tax_amount) {
        setValue(`lines.${index}.tax_amount`, tax_amount, {
          shouldDirty: false,
        });
      }

      if (line?.total_amount !== total_amount) {
        setValue(`lines.${index}.total_amount`, total_amount, {
          shouldDirty: false,
        });
      }

      return {
        quantity,
        unit_price: unitPrice,
        discount_amount,
        tax_amount,
        total_amount,
      };
    });

    const summary = calculateOrderTotals(
      computedLines,
      Number(globalDiscount) || 0,
      Number(globalTax) || 0,
    );

    setValue("subtotal_amount", summary.subtotal_amount, {
      shouldDirty: false,
    });
    setValue("total_amount", summary.total_amount, { shouldDirty: false });
  }, [watchedLines, globalDiscount, globalTax, taxRatesMap, setValue]);

  const onSubmit = async (data: PurchaseFormValues) => {
    const payload = {
      ...data,
      lines: data.lines.map((l) => ({
        ...l,
        uom_id: l.uom_id ? Number(l.uom_id) : null,
        tax_id: l.tax_id && l.tax_id !== "none" ? Number(l.tax_id) : null,
      })),
    };

    if (purchaseData?.id) {
      await purchaseService.update(purchaseData.id, payload);
      toast.success("Purchase order successfully updated.");
    } else {
      await purchaseService.create(payload);
      toast.success("Purchase order voucher successfully committed.");
    }
    onSuccess();
  };

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-5 gap-4 bg-muted/20 p-6 rounded-3xl border border-white/5">
        <FormInput
          type="date"
          label="PO Execution Date"
          registration={register("po_date")}
          error={errors.po_date?.message}
        />

        <Controller
          name="supplier_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Target Supplier"
              options={suppliers}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.supplier_id?.message}
            />
          )}
        />

        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Origin Unit Branch"
              options={branches}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.branch_id?.message}
            />
          )}
        />

        <Controller
          name="inventory_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Target Warehouse / Storage"
              options={inventories}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.inventory_id?.message}
            />
          )}
        />

        <Controller
          name="currency_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Operating Currency"
              options={currencies}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.currency_id?.message}
            />
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            Item Lines & Services
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() =>
              append({
                product_id: 0,
                uom_id: "",
                quantity: 1,
                unit_price: 0,
                discount_type: "fixed",
                discount_value: 0,
                discount_amount: 0,
                tax_id: "none",
                tax_amount: 0,
                expenses_type: "none",
                expenses_amount: 0,
                total_amount: 0,
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
                name={`lines.${index}.product_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Item / Service"
                    options={products}
                    value={field.value?.toString()}
                    onValueChange={(v) => {
                      const productId = Number(v);
                      field.onChange(productId);
                      const matchingProduct = rawProducts.find(
                        (p) => p.id === productId,
                      );
                      if (matchingProduct) {
                        const cost =
                          matchingProduct.purchase_price ||
                          matchingProduct.cost ||
                          matchingProduct.price ||
                          0;
                        setValue(`lines.${index}.unit_price`, Number(cost));

                        if (matchingProduct.purchase_uom_id) {
                          setValue(
                            `lines.${index}.uom_id`,
                            matchingProduct.purchase_uom_id.toString(),
                          );
                        }
                        if (matchingProduct.purchase_tax_id) {
                          setValue(
                            `lines.${index}.tax_id`,
                            matchingProduct.purchase_tax_id.toString(),
                          );
                        }
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="col-span-2">
              <Controller
                name={`lines.${index}.uom_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="UOM"
                    options={uoms}
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(v)}
                    error={errors.lines?.[index]?.uom_id?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <FormInput
                type="number"
                label="Qty"
                registration={register(`lines.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="col-span-1">
              <FormInput
                type="number"
                label="Unit Cost"
                registration={register(`lines.${index}.unit_price`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="col-span-1">
              <Controller
                name={`lines.${index}.discount_type`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Disc Type"
                    options={[
                      { id: "fixed", name: "Fixed" },
                      { id: "percentage", name: "%" },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <FormInput
                type="number"
                label="Disc Val"
                registration={register(`lines.${index}.discount_value`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="col-span-2">
              <Controller
                name={`lines.${index}.tax_id`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Tax Config"
                    options={taxes}
                    value={field.value?.toString()}
                    onValueChange={(v) => field.onChange(v)}
                    error={errors.lines?.[index]?.tax_id?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Line Total
                </label>
                <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border text-sm font-mono font-bold text-foreground">
                  {Number(
                    watchedLines?.[index]?.total_amount || 0,
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
            <span>{Number(watch("subtotal_amount")).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-rose-400 items-center">
            <span>Global Deductions:</span>
            <span className="w-24">
              <FormInput
                type="number"
                registration={register("discount_amount", {
                  valueAsNumber: true,
                })}
              />
            </span>
          </div>
          <div className="flex justify-between text-emerald-400 items-center">
            <span>Accrued Taxes:</span>
            <span className="w-24">
              <FormInput
                type="number"
                registration={register("tax_amount", { valueAsNumber: true })}
              />
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-primary">
            <span>Grand Total:</span>
            <span>{Number(watch("total_amount")).toLocaleString()}</span>
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
          ) : purchaseData ? (
            "Update Purchase Order"
          ) : (
            "Commit Order"
          )}
        </Button>
      </div>
    </form>
  );
}
