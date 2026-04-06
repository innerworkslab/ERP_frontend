"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema, AddProductFormValues } from "./schema";
import {
  collectionsService,
  AddProductsRequest,
} from "@/api/collections.service";
import { productService } from "@/api/products.service";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  collectionId: number;
  onSuccess: () => void;
  setLoading?: (loading: boolean) => void;
}

export default function AddProductForm({
  collectionId,
  onSuccess,
  setLoading,
}: Props) {
  const [productOptions, setProductOptions] = useState<Option[]>([]);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const isFetched = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: yupResolver(addProductSchema),
    defaultValues: {
      products: [], // Start empty while fetching
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    setLoading?.(isSubmitting || fetchingExisting);
  }, [isSubmitting, fetchingExisting, setLoading]);

  const loadInitialData = useCallback(async () => {
    try {
      setFetchingExisting(true);

      // Fetch both product options and current collection products
      const [allProductsRes, existingProductsRes] = await Promise.all([
        productService.getAll(),
        collectionsService.getProductList(collectionId),
      ]);

      // 1. Map options for the dropdown
      const options = allProductsRes.data.map((p) => ({
        id: p.id.toString(),
        name: `${p.name} (${p.sku})`,
      }));
      setProductOptions(options);

      // 2. Map existing products to form values
      if (existingProductsRes.data && existingProductsRes.data.length > 0) {
        const existingItems = existingProductsRes.data.map((p) => ({
          product_id: p.id,
          product_qty: Number(p.pivot.product_qty),
        }));
        reset({ products: existingItems });
      } else {
        // If no existing products, add one empty row
        reset({ products: [{ product_id: 0, product_qty: 1 }] });
      }
    } catch (err) {
      toast.error("Failed to load collection products");
    } finally {
      setFetchingExisting(false);
    }
  }, [collectionId, reset]);

  useEffect(() => {
    if (!isFetched.current) {
      loadInitialData();
      isFetched.current = true;
    }
  }, [loadInitialData]);

  const onSubmit = async (data: AddProductFormValues) => {
    const payload: AddProductsRequest = {
      products: data.products.map((p) => ({
        product_id: Number(p.product_id),
        product_qty: Number(p.product_qty),
      })),
    };

    try {
      const res = await collectionsService.addProducts(collectionId, payload);
      if (res) {
        toast.success("Collection items updated");
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to update collection");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[100px] relative">
        {fetchingExisting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 items-end transition-all hover:bg-muted/50"
          >
            <div className="col-span-7">
              <Controller
                name={`products.${index}.product_id`}
                control={control}
                render={({ field: selectField }) => (
                  <FormSelect
                    label={index === 0 ? "Product" : ""}
                    options={productOptions}
                    value={selectField.value?.toString()}
                    onValueChange={(val) => selectField.onChange(Number(val))}
                    error={errors.products?.[index]?.product_id?.message}
                  />
                )}
              />
            </div>

            <div className="col-span-4">
              <FormInput
                label={index === 0 ? "Qty" : ""}
                type="number"
                registration={register(`products.${index}.product_qty`)}
                error={errors.products?.[index]?.product_qty?.message}
              />
            </div>

            <div className="col-span-1 pb-1 flex justify-center">
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

        {!fetchingExisting && fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs italic">
            No products in this collection.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-dashed py-6 rounded-2xl flex gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
          onClick={() => append({ product_id: 0, product_qty: 1 })}
          disabled={fetchingExisting}
        >
          <Plus className="h-4 w-4" /> Add Another Item
        </Button>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || fetchingExisting}
            className="w-full md:w-auto px-10"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Update Collection"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
