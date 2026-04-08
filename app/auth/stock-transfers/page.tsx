"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import {
  stockTransferService,
  StockTransfer,
} from "@/api/stockTransfers.service";
import { getColumns } from "@/components/stock-transfers/columns";
import { ApiResponse } from "@/types/api.type";

export default function StockTransferPage() {
  const router = useRouter();

  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const { search, page } = watch();

  // FIX 1: Ensure the generic matches the standard list response structure
  const { request, loading, error } = useApi<ApiResponse<StockTransfer[]>>();

  const loadTransfers = useCallback(async () => {
    // FIX 2: Pass search and page as a single object (matching your service signature)
    const res = await request(() =>
      stockTransferService.getAll({
        search: search || undefined,
        page: page,
      }),
    );

    if (res) {
      // res is the ApiResponse object, so res.data is the array
      setTransfers(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransfers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, page, loadTransfers]);

  const handleEdit = useCallback(
    (transfer: StockTransfer) => {
      // FIX 3: Ensure route consistency with your sidebar (/inventory/ not /auth/)
      router.push(`/inventory/stock-transfers/${transfer.id}/edit`);
    },
    [router],
  );

  const handleView = useCallback(
    (transfer: StockTransfer) => {
      router.push(`/inventory/stock-transfers/${transfer.id}`);
    },
    [router],
  );

  const handleAdd = () => {
    router.push("/inventory/stock-transfers/add");
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadTransfers),
    [handleEdit, handleView, loadTransfers],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search Reference ID..."
        onAddClick={handleAdd}
        addLabel="Add Stock Transfer"
      />

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={transfers} />

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
              <span className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">
                Syncing List...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
