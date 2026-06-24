"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { FormSelect, Option } from "@/components/common/FormSelect";
import {
  cashbookService,
  LedgerTransaction,
  LedgerResponse,
} from "@/api/cashbooks.service";
import { getColumns } from "@/components/cashbook-ledgers/columns";
import { useRouter } from "next/navigation";

export default function LedgerPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [cashbooks, setCashbooks] = useState<Option[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [balances, setBalances] = useState({
    opening: 0,
    closing: 0,
  });

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      cashbook_id: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const cashbookId = watch("cashbook_id");
  const page = watch("page");

  const { request, loading, error } = useApi<LedgerResponse>();

  const loadCashbooks = useCallback(async () => {
    try {
      const res = await cashbookService.getAll();
      if (res?.data) {
        setCashbooks(
          res.data.map((c) => ({ id: c.id.toString(), name: c.name })),
        );
      }
    } catch (err) {
      console.error("Failed fetching cashbooks context matrices", err);
    }
  }, []);

  const loadLedgers = useCallback(async () => {
    const res = await request(() =>
      cashbookService.getStatement({
        search: search || undefined,
        cashbook_id: cashbookId === "all" ? undefined : Number(cashbookId),
        page: page,
      }),
    );

    if (res?.data) {
      setTransactions(res.data.data || []);
      setLastPage(res.data.meta?.total_pages || 1);
      setBalances({
        opening: res.data.opening_balance || 0,
        closing: res.data.closing_balance || 0,
      });
    }
  }, [request, search, cashbookId, page]);

  useEffect(() => {
    loadCashbooks();
  }, [loadCashbooks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLedgers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, cashbookId, page, loadLedgers]);

  const handleViewTransaction = useCallback((data: LedgerTransaction) => {
    router.push(`/auth/cashbook-ledgers/${data.id}`);
  }, []);

  const columns = useMemo(
    () => getColumns(handleViewTransaction),
    [handleViewTransaction],
  );

  return (
    <div className="space-y-6 relative min-h-[400px] p-6">
      <div className="grid gap-4 md:grid-cols-2 mb-10">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Opening Balance
          </p>
          <h3 className="text-xl font-mono font-bold mt-0.5">
            {balances.opening.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Closing Balance
          </p>
          <h3 className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
            {balances.closing.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
        </div>
      </div>

      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search ledger entries..."
      >
        <div className="flex gap-3">
          <Controller
            name="cashbook_id"
            control={control}
            render={({ field }) => (
              <div className="w-[200px]">
                <FormSelect
                  label=""
                  options={[{ name: "All Accounts", id: "all" }, ...cashbooks]}
                  value={field.value || "all"}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              </div>
            )}
          />
        </div>
      </BaseFilter>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={transactions} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px] rounded-4xl transition-all">
            <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-bold uppercase tracking-tighter">
                Syncing Ledgers...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
