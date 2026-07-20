/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saleInvoicesService } from "@/api/sale.service";
import { branchService } from "@/api/branches.service";
import { inventoryService } from "@/api/inventories.service";
import { currencyService } from "@/api/currencies.service";
import { customerService } from "@/api/customers.service";
import { priceGroupService } from "@/api/priceGroups.service";
import { taxService } from "@/api/taxes.service";
import { productService } from "@/api/products.service";
import { deliveryProvidersService } from "@/api/deliveryProvider.service";
import { saleInvoiceSchema, SaleInvoiceFormValues } from "./schema";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cashbookService } from "@/api/cashbooks.service";

interface Props {
  invoiceData?: any | null;
}

const discountTypeOptions: Option[] = [
  { id: "fixed", name: "Fixed Amount" },
  { id: "percentage", name: "Percentage (%)" },
];

const deliveryChargePaidOptions: Option[] = [
  { id: "shipper", name: "Paid by Shipper" },
  { id: "receiver", name: "Paid by Receiver" },
];

const txMethodOptions: Option[] = [
  { id: "FIFO", name: "First In, First Out (FIFO)" },
  { id: "LIFO", name: "Last In, First Out (LIFO)" },
  { id: "custom_batch", name: "Custom" },
];

const paymentTermsOptions: Option[] = [
  { id: "due_on_receipt", name: "Due on Receipt" },
  { id: "net_15", name: "Net 15" },
  { id: "net_30", name: "Net 30" },
  { id: "advanced_payment", name: "Advanced Payment" },
  { id: "cash_on_delivery", name: "COD" },
];

const statusOptions: Option[] = [
  { id: "draft", name: "Draft" },
  { id: "pending", name: "Pending" },
  { id: "ordered", name: "Ordered" },
  { id: "reserved", name: "Reserved" },
  { id: "delivered", name: "Delivered" },
];

export default function SaleInvoiceForm({ invoiceData }: Props) {
  const router = useRouter();
  const [cashbookAccounts, setCashbookAccounts] = useState<Option[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [inventories, setInventories] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [customers, setCustomers] = useState<Option[]>([]);
  const [sellingPriceGroups, setSellingPriceGroups] = useState<Option[]>([]);
  const [taxes, setTaxes] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [fullProducts, setFullProducts] = useState<any[]>([]);
  const [deliveryProviders, setDeliveryProviders] = useState<Option[]>([]);
  const [fullDeliveryProviders, setFullDeliveryProviders] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SaleInvoiceFormValues>({
    resolver: yupResolver(saleInvoiceSchema),
    defaultValues: invoiceData
      ? {
          cashbook_id: invoiceData.cashbook_id,
          branch_id: invoiceData.branch_id,
          inventory_id: invoiceData.inventory_id,
          customer_id: invoiceData.customer_id,
          currency_id: invoiceData.currency_id,
          selling_price_group_id: invoiceData.selling_price_group_id,
          inventory_transaction_method:
            invoiceData.inventory_transaction_method,
          invoice_date: invoiceData.invoice_date?.split("T")[0],
          payment_terms: invoiceData.payment_terms,
          payment_due_date: invoiceData.payment_due_date?.split("T")[0],
          status: invoiceData.status,
          remarks: invoiceData.remarks || "",
          sell_tax_id: invoiceData.sell_tax_id,
          invoice_discount_type: invoiceData.invoice_discount_type,
          invoice_discount_amount: Number(invoiceData.invoice_discount_amount),
          paid_amount: Number(invoiceData.paid_amount),
          items:
            invoiceData.items?.map((item: any) => ({
              product_id: Number(item.product_id),
              uom_id: Number(item.uom_id),
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              discount_type: item.discount_type,
              discount_amount: Number(item.discount_amount) || 0,
              remarks: item.remarks || "",
            })) || [],
          delivery: {
            delivery_provider_id: Number(
              invoiceData.delivery?.delivery_provider_id,
            ),
            delivery_charge_paid: invoiceData.delivery?.delivery_charge_paid,
            delivery_charge: Number(invoiceData.delivery?.delivery_charge || 0),
            receiver_name: invoiceData.delivery?.receiver_name || "",
            receiver_phone: invoiceData.delivery?.receiver_phone || "",
            receiver_address: invoiceData.delivery?.receiver_address || "",
            receiver_note: invoiceData.delivery?.receiver_note || "",
          },
        }
      : {
          invoice_date: new Date().toISOString().split("T")[0],
          payment_due_date: new Date().toISOString().split("T")[0],
          inventory_transaction_method: "FIFO",
          payment_terms: "due_on_receipt",
          status: "draft",
          invoice_discount_type: "fixed",
          invoice_discount_amount: 0,
          paid_amount: 0,
          items: [
            {
              product_id: 0,
              uom_id: 0,
              quantity: 1,
              unit_price: 0,
              discount_type: "fixed",
              discount_amount: 0,
              remarks: "",
            },
          ],
          delivery: {
            delivery_provider_id: 0,
            delivery_charge_paid: "shipper",
            delivery_charge: 0,
            receiver_name: "",
            receiver_phone: "",
            receiver_address: "",
            receiver_note: "",
          },
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });

  useEffect(() => {
    cashbookService.getAll().then((res) => {
      if (res?.data)
        setCashbookAccounts(
          res.data.map((c) => ({ id: c.id.toString(), name: c.name })),
        );
    });
    branchService.getAll().then((res) => {
      if (res?.data)
        setBranches(
          res.data.map((b) => ({ id: b.id.toString(), name: b.name })),
        );
    });
    inventoryService.getAll().then((res) => {
      if (res?.data)
        setInventories(
          res.data.map((i) => ({ id: i.id.toString(), name: i.name })),
        );
    });
    currencyService.getAll().then((res) => {
      if (res?.data)
        setCurrencies(
          res.data.map((c) => ({ id: c.id.toString(), name: c.name })),
        );
    });
    customerService.getAll().then((res) => {
      if (res?.data)
        setCustomers(
          res.data.map((c) => ({ id: c.id.toString(), name: c.name })),
        );
    });
    priceGroupService.getAll().then((res) => {
      if (res?.data)
        setSellingPriceGroups(
          res.data.map((s) => ({ id: s.id.toString(), name: s.name })),
        );
    });
    taxService.getAll().then((res) => {
      if (res?.data)
        setTaxes(
          res.data
            .filter((t) => t.type === "sale")
            .map((t) => ({ id: t.id.toString(), name: t.category })),
        );
    });
    productService.getAll().then((res) => {
      if (res?.data) {
        setFullProducts(res.data);
        setProducts(
          res.data.map((p) => ({ id: p.id.toString(), name: p.name })),
        );
      }
    });
    deliveryProvidersService.getAll().then((res) => {
      if (res?.data) {
        setFullDeliveryProviders(res.data);
        setDeliveryProviders(
          res.data.map((d) => ({ id: d.id.toString(), name: d.name })),
        );
      }
    });
  }, []);

  const deliveryChargePaid = watch("delivery.delivery_charge_paid");

  const onSubmit = async (data: SaleInvoiceFormValues) => {
    try {
      if (invoiceData?.id) {
        await saleInvoicesService.update(invoiceData.id, data as any);
        toast.success("Sale invoice updated successfully.");
      } else {
        await saleInvoicesService.create(data as any);
        toast.success("Sale invoice created successfully.");
      }
      router.push("/auth/sale-invoices");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-4 gap-4 bg-muted/20 p-6 rounded-3xl border border-white/5">
        <Controller
          name="cashbook_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Cashbook Account"
              options={cashbookAccounts}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.cashbook_id?.message}
            />
          )}
        />
        <FormInput
          type="date"
          label="Invoice Date"
          registration={register("invoice_date")}
          error={errors.invoice_date?.message}
        />
        <Controller
          name="branch_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Branch"
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
              label="Inventory Storage"
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
              label="Currency"
              options={currencies}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.currency_id?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 bg-muted/10 p-6 rounded-3xl border border-white/5">
        <Controller
          name="customer_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Customer"
              options={customers}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.customer_id?.message}
            />
          )}
        />
        <Controller
          name="selling_price_group_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Selling Price Group"
              options={sellingPriceGroups}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.selling_price_group_id?.message}
            />
          )}
        />
        <Controller
          name="inventory_transaction_method"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Inventory Tx Method"
              options={txMethodOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.inventory_transaction_method?.message}
            />
          )}
        />
        <Controller
          name="payment_terms"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Payment Terms"
              options={paymentTermsOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.payment_terms?.message}
            />
          )}
        />
        <FormInput
          type="date"
          label="Payment Due Date"
          registration={register("payment_due_date")}
          error={errors.payment_due_date?.message}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={statusOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />
        <Controller
          name="sell_tax_id"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Sale Tax configuration"
              options={taxes}
              value={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
              error={errors.sell_tax_id?.message}
            />
          )}
        />
        <Controller
          name="invoice_discount_type"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Discount Type"
              options={discountTypeOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.invoice_discount_type?.message}
            />
          )}
        />
        <FormInput
          type="number"
          label="Discount Amount"
          registration={register("invoice_discount_amount", {
            valueAsNumber: true,
          })}
          error={errors.invoice_discount_amount?.message}
        />
        <FormInput
          type="number"
          label="Paid Amount"
          registration={register("paid_amount", { valueAsNumber: true })}
          error={errors.paid_amount?.message}
        />
        <div className="col-span-2">
          <FormInput
            type="text"
            label="Remarks"
            registration={register("remarks")}
            error={errors.remarks?.message}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            Line Items
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                product_id: 0,
                uom_id: 0,
                quantity: 1,
                unit_price: 0,
                discount_type: "fixed",
                discount_amount: 0,
                remarks: "",
              })
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        {fields.map((item, index) => {
          const currentProd = fullProducts.find(
            (p) => p.id === Number(watchedItems[index]?.product_id),
          );
          return (
            <div
              key={item.id}
              className="relative grid grid-cols-6 gap-4 p-4 pt-10 bg-card rounded-2xl border border-white/5 items-end"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="col-span-2">
                <Controller
                  name={`items.${index}.product_id`}
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      label="Product"
                      options={products}
                      value={field.value?.toString()}
                      onValueChange={(v) => {
                        const productId = Number(v);
                        field.onChange(productId);

                        const selected = fullProducts.find(
                          (p) => p.id === productId,
                        );

                        if (selected) {
                          setValue(
                            `items.${index}.uom_id`,
                            selected.sale_uom.id,
                          );
                          setValue(
                            `items.${index}.unit_price`,
                            Number(selected.sale_price),
                          );
                        } else {
                          setValue(`items.${index}.uom_id`, 0);
                          setValue(`items.${index}.unit_price`, 0);
                        }
                      }}
                      error={errors.items?.[index]?.product_id?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                  UOM
                </Label>

                <Input
                  value={currentProd?.stock_uom?.code ?? ""}
                  disabled
                  className="bg-background/50 border-none h-[40px] rounded-2xl"
                />
              </div>
              <FormInput
                type="number"
                label="Qty"
                registration={register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                error={errors.items?.[index]?.quantity?.message}
              />
              <FormInput
                type="number"
                label="Unit Price"
                disabled={true}
                registration={register(`items.${index}.unit_price`, {
                  valueAsNumber: true,
                })}
                error={errors.items?.[index]?.unit_price?.message}
              />
              <Controller
                name={`items.${index}.discount_type`}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Disc Type"
                    options={discountTypeOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.items?.[index]?.discount_type?.message}
                  />
                )}
              />
              <FormInput
                type="number"
                label="Disc Amt"
                registration={register(`items.${index}.discount_amount`, {
                  valueAsNumber: true,
                })}
                error={errors.items?.[index]?.discount_amount?.message}
              />
              <div className="col-span-5">
                <FormInput
                  type="text"
                  label="Remarks"
                  registration={register(`items.${index}.remarks`)}
                  error={errors.items?.[index]?.remarks?.message}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/10 p-6 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
          Delivery Details
        </h3>

        <div className="grid grid-cols-4 gap-4">
          <Controller
            name="delivery.delivery_provider_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Delivery Provider"
                options={deliveryProviders}
                value={field.value?.toString()}
                onValueChange={(v) => {
                  const providerId = Number(v);
                  field.onChange(providerId);

                  const selected = fullDeliveryProviders.find(
                    (p) => p.id === providerId,
                  );

                  if (selected) {
                    setValue(
                      "delivery.delivery_charge",
                      Number(selected.default_price),
                    );
                  } else {
                    setValue("delivery.delivery_charge", 0);
                  }
                }}
                error={errors.delivery?.delivery_provider_id?.message}
              />
            )}
          />

          <Controller
            name="delivery.delivery_charge_paid"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Charge Paid By"
                options={deliveryChargePaidOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.delivery?.delivery_charge_paid?.message}
              />
            )}
          />

          {deliveryChargePaid === "shipper" && (
            <FormInput
              type="number"
              label="Delivery Charge"
              registration={register("delivery.delivery_charge", {
                valueAsNumber: true,
              })}
              error={errors.delivery?.delivery_charge?.message}
            />
          )}

          <FormInput
            type="text"
            label="Receiver Name"
            registration={register("delivery.receiver_name")}
            error={errors.delivery?.receiver_name?.message}
          />

          <FormInput
            type="text"
            label="Receiver Phone"
            registration={register("delivery.receiver_phone")}
            error={errors.delivery?.receiver_phone?.message}
          />

          <FormInput
            type="text"
            label="Receiver Address"
            registration={register("delivery.receiver_address")}
            error={errors.delivery?.receiver_address?.message}
          />

          <div className="col-span-2">
            <FormInput
              type="text"
              label="Receiver Note"
              registration={register("delivery.receiver_note")}
              error={errors.delivery?.receiver_note?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/sale-invoices")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : invoiceData ? (
            "Save Invoice Modification"
          ) : (
            "Create Invoice"
          )}
        </Button>
      </div>
    </form>
  );
}
