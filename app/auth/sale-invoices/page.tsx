"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { ApiResponse } from "@/types/api.type";
import { SaleInvoiceListItem, saleInvoicesService } from "@/api/sale.service";
import { getColumns } from "@/components/sale-invoices/columns";

export default function SaleInvoicesLedgerPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<SaleInvoiceListItem[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const { search, page } = watch();
  const { request, loading, error } =
    useApi<ApiResponse<SaleInvoiceListItem[]>>();

  const loadInvoices = useCallback(async () => {
    const res = await request(() =>
      saleInvoicesService.getAll({
        search: search || undefined,
        page: page,
      }),
    );

    if (res) {
      setInvoices(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(loadInvoices, 400);
    return () => clearTimeout(timer);
  }, [search, page, loadInvoices]);

  const handleEditRedirect = useCallback(
    (invoice: SaleInvoiceListItem) => {
      router.push(`/auth/sale-invoices/${invoice.id}/edit`);
    },
    [router],
  );

  const handleViewRedirect = useCallback(
    (invoice: SaleInvoiceListItem) => {
      router.push(`/auth/sale-invoices/${invoice.id}`);
    },
    [router],
  );

  const columns = useMemo(
    () => getColumns(handleEditRedirect, handleViewRedirect, loadInvoices),
    [handleEditRedirect, handleViewRedirect, loadInvoices],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <BaseFilter
            searchValue={search}
            onSearch={(val) => {
              setValue("page", 1);
              setValue("search", val);
            }}
            placeholder="Search invoice number or customer identifier..."
          />
        </div>
        <Button
          onClick={() => router.push("/auth/sale-invoices/add")}
          className="rounded-xl font-medium shadow-sm h-11 px-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Sale Invoice
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={invoices} />

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
                Syncing Invoices...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
