"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/api.type";
import { StockBalance, stockBalanceService } from "@/api/stockBalances.service";
import { getColumns } from "@/components/stock-balances/columns";

export default function StockBalancePage() {
  const router = useRouter();
  const [balances, setBalances] = useState<StockBalance[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const { search, page } = watch();
  const { request, loading, error } = useApi<ApiResponse<StockBalance[]>>();

  const loadBalances = useCallback(async () => {
    const res = await request(() =>
      stockBalanceService.getBalanceList({
        search: search || undefined,
        page: page,
      }),
    );

    if (res) {
      setBalances(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(loadBalances, 400);
    return () => clearTimeout(timer);
  }, [search, page, loadBalances]);

  // const handleView = useCallback(
  //   (balance: StockBalance) => {
  //     router.push(`/inventory/stock-ledger/${balance.product_id}`);
  //   },
  //   [router],
  // );

  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search product, SKU, batch or warehouse..."
      />

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={balances} />

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
                Syncing Balances...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
