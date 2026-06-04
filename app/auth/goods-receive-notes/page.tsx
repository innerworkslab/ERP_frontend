"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import {
  goodReceiptNotesService,
  GoodsReceiveNote,
} from "@/api/goodsReceiveNotes.service";
import { getColumns } from "@/components/goodsReceiveNotes/columns";

export default function GoodsReceiveNotesListPage() {
  const router = useRouter();
  const [grns, setGrns] = useState<GoodsReceiveNote[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });

  const search = watch("search");
  const page = watch("page");

  const loadGrns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await goodReceiptNotesService.getAll({
        search: search || undefined,
        page: page,
      });
      setGrns(res.data || []);
      if (res.meta) {
        setLastPage(res.meta.total_pages || 1);
      }
    } catch (error) {
      console.error("Error loading Goods Receipt Notes:", error);
      setGrns([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadGrns();
  }, [loadGrns]);

  const columns = useMemo(() => {
    return getColumns(
      (grn) => router.push(`/auth/goods-receive-notes/${grn.id}`),
      (grn) => router.push(`/auth/goods-receive-notes/${grn.id}/edit`),
      loadGrns,
    );
  }, [router, loadGrns]);

  return (
    <div className="space-y-6">
      <BaseFilter
        searchValue={search}
        onSearch={(v) => {
          setValue("search", v);
          setValue("page", 1);
        }}
        placeholder="Find GRN numbers..."
        onAddClick={() => router.push("/auth/goods-receive-notes/add")}
        addLabel="Create GRN"
      />

      {loading ? (
        <div className="h-48 flex items-center justify-center bg-card rounded-3xl border border-white/5">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={grns} />
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
