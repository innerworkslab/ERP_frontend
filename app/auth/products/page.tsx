"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { DataTable } from "@/components/data-table/DataTable";
import { BaseFilter } from "@/components/common/BaseFilter";
import { Pagination } from "@/components/common/Pagination";
import { FormSelect } from "@/components/common/FormSelect";
import {
  productService,
  Product,
  ProductListResponse,
} from "@/api/products.service";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { getColumns } from "@/components/products/columns";

export default function ProductListPage() {
  const router = useRouter();

  // 1. Form state for Filters and Pagination
  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      status: "all",
      page: 1,
    },
  });

  const { search, status, page } = watch();
  const [products, setProducts] = useState<Product[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const { request, loading } = useApi<ProductListResponse>();

  // 2. Fetch Logic
  const fetchProducts = useCallback(async () => {
    const res = await request(() =>
      productService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );

    if (res) {
      setProducts(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  // 3. Debounced Search & Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // 4. Handlers for Columns
  const handleEdit = (product: Product) => {
    router.push(`/auth/products/${product.id}/edit`);
  };

  const handleView = (product: Product) => {
    router.push(`/auth/products/${product.id}`);
  };

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => getColumns(handleEdit, handleView, fetchProducts),
    [fetchProducts],
  );

  return (
    <div className="space-y-6 relative min-h-[500px]">
      {/* Filter Section */}
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1); // Reset to page 1 on new search
          setValue("search", val);
        }}
        placeholder="Search by SKU or Name..."
        onAddClick={() => router.push("/auth/products/add")}
        addLabel="New Product"
      >
        <div className="w-[160px]">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                label=""
                options={[
                  { name: "All Status", id: "all" },
                  { name: "Active", id: "active" },
                  { name: "Inactive", id: "inactive" },
                ]}
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  setValue("page", 1); // Reset to page 1 on status change
                }}
              />
            )}
          />
        </div>
      </BaseFilter>

      {/* Table Section */}
      <div className="relative space-y-4">
        <DataTable columns={columns} data={products} />

        {/* Pagination Section */}
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px] z-10">
            <div className="bg-background/80 p-4 rounded-full shadow-xl border">
              <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
