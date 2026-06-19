"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useParams } from "next/navigation";
import { productService } from "@/api/products.service";
import { categoryService } from "@/api/categories.service";
import { brandService } from "@/api/brands.service";
import { taxService } from "@/api/taxes.service";
import { originCountryService } from "@/api/originCountries.service";
import { currencyService } from "@/api/currencies.service";
import { variationService } from "@/api/variations.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import CategoryForm from "../categories/CategoryForm";
import BrandForm from "../brands/BrandForm";
import OriginCountryForm from "../origin-countries/OriginCountryForm";
import {
  UOMConversion,
  uomConversionService,
} from "@/api/uomConversions.service";
import { productSchema } from "./schema";

export default function ProductForm() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id && params.id !== "create";

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lookups, setLookups] = useState<{
    categories?: Option[];
    brands?: Option[];
    purchaseTaxes?: Option[];
    saleTaxes?: Option[];
    origins?: Option[];
    currencies?: Option[];
    conversionOptions?: Option[];
    uomConversions?: UOMConversion[];
    variationDefinitions?: Option[];
  }>({});
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(productSchema),
    context: { isEdit },
    defaultValues: { status: "active", variations: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const selectedCategoryId = watch("category_id");

  const loadData = useCallback(async () => {
    try {
      const [cats, brds, txs, origins, uomCon, curs] = await Promise.all([
        categoryService.getAll(),
        brandService.getAll(),
        taxService.getAll(),
        originCountryService.getAll(),
        uomConversionService.getAll(),
        currencyService.getAll({}),
      ]);

      const purchaseTaxes = txs.data
        .filter((t: any) => t.type?.toLowerCase() === "purchase")
        .map((t: any) => ({ id: t.id.toString(), name: t.category }));

      const saleTaxes = txs.data
        .filter((t: any) => t.type?.toLowerCase() === "sale")
        .map((t: any) => ({ id: t.id.toString(), name: t.category }));

      let activeVariations: any[] = [];
      if (selectedCategoryId) {
        const vars = await variationService
          .getAll({ product_category_id: selectedCategoryId })
          .catch(() => ({ data: [] }));
        activeVariations = (vars?.data || []).filter(
          (v: any) => v.status === "active",
        );
      }

      setLookups({
        categories: cats.data.map((c) => ({
          id: c.id.toString(),
          name: c.name,
        })),
        brands: brds.data.map((b) => ({
          id: b.id.toString(),
          name: b.name,
        })),
        purchaseTaxes,
        saleTaxes,
        origins: origins.data.map((o) => ({
          id: o.id.toString(),
          name: o.name,
        })),
        currencies: curs.data.map((curr) => ({
          id: curr.id.toString(),
          name: curr.code,
        })),
        uomConversions: uomCon.data,
        conversionOptions: uomCon.data.map((uc) => ({
          id: uc.id.toString(),
          name: uc.conversions_name,
        })),
        variationDefinitions: activeVariations.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
        })),
      });

      if (isEdit && fetching) {
        const res = await productService.getById(Number(params.id));
        if (res.data) {
          reset({
            ...res.data,
            alert_quantity: Number(res.data.alert_quantity),
            purchase_price: Number(res.data.purchase_price),
            sale_price: Number(res.data.sale_price),
            variations:
              (res.data.product_variations || res.data.variations)?.map(
                (v: any) => ({
                  variation_id: Number(v.variation_id),
                  variation_value: v.variation_value,
                }),
              ) || [],
          });
          setImagePreview(res.data.image_url);
        }
      }
    } finally {
      setFetching(false);
    }
  }, [isEdit, params.id, reset, selectedCategoryId, fetching]);

  useEffect(() => {
    loadData();
  }, [selectedCategoryId]);

  const selectedConversionId = watch("conversion_uom_id");

  const filteredUoms = useMemo(() => {
    const conversions = lookups.uomConversions || [];

    if (!selectedConversionId) {
      const map = new Map<number, any>();
      conversions.forEach((uc) => {
        map.set(uc.base_unit.id, uc.base_unit);
        map.set(uc.conversion_unit.id, uc.conversion_unit);
      });
      return Array.from(map.values()).map((u) => ({
        id: u.id.toString(),
        name: u.name,
      }));
    }

    const selected = conversions.find(
      (uc) => uc.id === Number(selectedConversionId),
    );

    if (!selected) return [];

    return [
      {
        id: selected.base_unit.id.toString(),
        name: selected.base_unit.name,
      },
      {
        id: selected.conversion_unit.id.toString(),
        name: selected.conversion_unit.name,
      },
    ];
  }, [selectedConversionId, lookups.uomConversions]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else if (
        key !== "variations" &&
        value !== undefined &&
        value !== null
      ) {
        formData.append(key, String(value));
      }
    });

    data.variations?.forEach((item: any, index: number) => {
      formData.append(
        `variations[${index}][variation_id]`,
        String(item.variation_id),
      );
      formData.append(
        `variations[${index}][variation_value]`,
        item.variation_value,
      );
    });

    const res = isEdit
      ? await productService.update(Number(params.id), formData)
      : await productService.create(formData);

    if (res) {
      toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
      router.push("/auth/products");
    }
  };

  if (fetching)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="space-y-4">
          <div className="p-3 space-y-4">
            <h3 className="font-bold text-sm text-primary uppercase tracking-widest">
              Media
            </h3>
            <div className="space-y-2">
              <div className="border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="object-cover w-full h-full"
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload product image
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("image", file, { shouldValidate: true });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              {errors.image?.message && (
                <p className="text-xs font-semibold text-destructive">
                  {String(errors.image.message)}
                </p>
              )}
            </div>
            <FormInput
              label="Alert Quantity"
              type="number"
              registration={register("alert_quantity")}
              error={errors.alert_quantity?.message}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Status"
                  options={[
                    { id: "active", name: "Active" },
                    { id: "inactive", name: "Inactive" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-4 grid grid-cols-2 gap-4">
            <FormInput
              label="Product Name"
              registration={register("name")}
              error={errors.name?.message}
            />
            <FormInput
              label="SKU"
              registration={register("sku")}
              error={errors.sku?.message}
            />
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Category"
                  options={lookups.categories || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  onRefresh={loadData}
                  error={errors.category_id?.message}
                  renderCreateForm={(close) => (
                    <div className="space-y-4">
                      <CategoryForm onSuccess={close} />
                      <Button
                        form="category-form"
                        type="submit"
                        className="w-full"
                      >
                        Save Category
                      </Button>
                    </div>
                  )}
                />
              )}
            />
            <Controller
              name="brand_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Brand"
                  options={lookups.brands || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  onRefresh={loadData}
                  error={errors.brand_id?.message}
                  renderCreateForm={(close) => (
                    <div className="space-y-4">
                      <BrandForm onSuccess={close} />
                      <Button
                        form="brand-form"
                        type="submit"
                        className="w-full"
                      >
                        Save Brand
                      </Button>
                    </div>
                  )}
                />
              )}
            />
            <Controller
              name="origin_country_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Origin Country"
                  options={lookups.origins || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  onRefresh={loadData}
                  error={errors.origin_country_id?.message}
                  renderCreateForm={(close) => (
                    <OriginCountryForm onSuccess={close} />
                  )}
                />
              )}
            />
            <Controller
              name="conversion_uom_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Conversion UOM"
                  options={lookups.conversionOptions || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                />
              )}
            />
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
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
                  options={lookups.currencies || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.purchase_currency_id?.message}
                />
              )}
            />
            <Controller
              name="purchase_uom_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Purchase UOM"
                  options={filteredUoms}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.purchase_uom_id?.message}
                />
              )}
            />
            <Controller
              name="purchase_tax_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Purchase Tax"
                  options={lookups.purchaseTaxes || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.purchase_tax_id?.message}
                />
              )}
            />
            <Controller
              name="stock_uom_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Stock UOM"
                  options={filteredUoms}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.stock_uom_id?.message}
                />
              )}
            />
          </div>

          <div className="p-4 grid grid-cols-2 gap-4">
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
                  options={lookups.currencies || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.sale_currency_id?.message}
                />
              )}
            />
            <Controller
              name="sale_uom_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Sale UOM"
                  options={filteredUoms}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.sale_uom_id?.message}
                />
              )}
            />
            <Controller
              name="sale_tax_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="Sale Tax"
                  options={lookups.saleTaxes || []}
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  error={errors.sale_tax_id?.message}
                />
              )}
            />
          </div>

          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-widest text-primary">
                Variations Setup
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() =>
                  append({ variation_id: "", variation_value: "" })
                }
              >
                <Plus className="w-4 h-4 mr-1" /> Append Variation
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-4 items-end bg-card p-3 rounded-2xl border border-white/5 relative"
              >
                <div className="col-span-5">
                  <Controller
                    name={`variations.${index}.variation_id`}
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        label="Variation Type"
                        options={lookups.variationDefinitions || []}
                        value={field.value?.toString()}
                        onValueChange={(val) => field.onChange(Number(val))}
                        error={
                          errors.variations?.[index]?.variation_id?.message
                        }
                      />
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormInput
                    label="Value"
                    registration={register(
                      `variations.${index}.variation_value`,
                    )}
                    error={errors.variations?.[index]?.variation_value?.message}
                  />
                </div>
                <div className="col-span-1 flex justify-center pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 h-10 w-10 rounded-xl"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-start-2 md:col-span-2 flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px] rounded-2xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>Save changes</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
