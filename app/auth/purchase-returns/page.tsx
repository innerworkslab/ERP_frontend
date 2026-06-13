"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import {
  purchaseReturnService,
  PurchaseReturnSummary,
} from "@/api/purchaseReturn.service";
import { getColumns } from "@/components/purchase-returns/columns";

export default function PurchaseReturnsListPage() {
  const router = useRouter();
  const [returns, setReturns] = useState<PurchaseReturnSummary[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const search = watch("search");
  const page = watch("page");

  const loadReturns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await purchaseReturnService.getAll({
        search: search || undefined,
        page: page,
      });
      setReturns(res.data || []);
      if (res.meta) {
        setLastPage(res.meta.total_pages || 1);
      }
    } catch (error) {
      console.error(error);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const columns = useMemo(() => {
    return getColumns(
      (row) => router.push(`/auth/purchase-returns/${row.id}`),
      (row) => router.push(`/auth/purchase-returns/${row.id}/edit`),
      loadReturns,
    );
  }, [router, loadReturns]);

  return (
    <div className="space-y-6">
      <BaseFilter
        searchValue={search}
        onSearch={(v) => {
          setValue("search", v);
          setValue("page", 1);
        }}
        placeholder="Find return vouchers..."
        onAddClick={() => router.push("/auth/purchase-returns/add")}
        addLabel="Create Return"
      />

      {loading ? (
        <div className="h-48 flex items-center justify-center bg-card rounded-3xl border border-white/5">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={returns} />
      )}

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={(p) => setValue("page", p)}
        loading={loading}
      />
    </div>
  );
}
