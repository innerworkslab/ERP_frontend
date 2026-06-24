"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import {
  CashbookTransaction,
  cashbookService,
  CashbookTransactionsListResponse,
} from "@/api/cashbooks.service";
import { getColumns } from "@/components/cashbook-transactions/columns";

export default function TransactionsListPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<CashbookTransaction[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      type: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const type = watch("type");
  const page = watch("page");

  const { request, loading, error } =
    useApi<CashbookTransactionsListResponse>();

  const loadTransactions = useCallback(async () => {
    const res = await request(() =>
      cashbookService.getTransactions({
        search: search || undefined,
        status: type === "all" ? undefined : type,
        page: page,
      }),
    );
    if (res) {
      setTransactions(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, type, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, type, page, loadTransactions]);

  const handleView = useCallback(
    (tx: CashbookTransaction) => {
      router.push(`/auth/cashbook-transactions/${tx.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (tx: CashbookTransaction) => {
      router.push(`/auth/cashbook-transactions/${tx.id}/edit`);
    },
    [router],
  );

  const handleAdd = () => {
    router.push("/auth/cashbook-transactions/add");
  };

  const columns = useMemo(
    () => getColumns(handleView, handleEdit, loadTransactions),
    [handleView, handleEdit, loadTransactions],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search ledger items..."
        onAddClick={handleAdd}
        addLabel="Post Transaction"
      >
        <div className="flex gap-3">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="w-[160px]">
                <FormSelect
                  label=""
                  options={[
                    { name: "All Vectors", id: "all" },
                    { name: "Debit (Inflow)", id: "in" },
                    { name: "Credit (Outflow)", id: "out" },
                  ]}
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
                Syncing Audit...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
