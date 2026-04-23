"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { openingStockService, OpeningStock } from "@/api/openingStocks.service";
import { getColumns } from "@/components/opening-stocks/columns";
import { ApiResponse } from "@/types/api.type";

export default function OpeningStockPage() {
  const router = useRouter();

  const [stocks, setStocks] = useState<OpeningStock[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const { search, page } = watch();
  const { request, loading, error } = useApi<ApiResponse<OpeningStock[]>>();

  const loadStocks = useCallback(async () => {
    const res = await request(() =>
      openingStockService.getAll({
        search: search || undefined,
        page: page,
      }),
    );

    if (res) {
      setStocks(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStocks();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, page, loadStocks]);

  const handleEdit = useCallback(
    (stock: OpeningStock) => {
      router.push(`/auth/opening-stocks/${stock.id}/edit`);
    },
    [router],
  );

  const handleView = useCallback(
    (stock: OpeningStock) => {
      router.push(`/auth/opening-stocks/${stock.id}`);
    },
    [router],
  );

  const handleAdd = () => {
    router.push("/auth/opening-stocks/add");
  };

  // Memoize columns to prevent unnecessary re-renders of ActionCells
  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadStocks),
    [handleEdit, handleView, loadStocks],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search Voucher No..."
        onAddClick={handleAdd}
        addLabel="Add Opening Stock"
      />

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={stocks} />

        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px] rounded-[2rem]">
            <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-bold uppercase tracking-tighter">
                Processing...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
