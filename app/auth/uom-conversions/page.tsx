"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { BaseFilter } from "@/components/common/BaseFilter";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import {
  uomConversionService,
  UOMConversion,
  UOMConversionListResponse,
} from "@/api/uomConversions.service";
import { getColumns } from "@/components/uom-conversions/columns";
import { AppDialog } from "@/components/common/AppDialog";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import UOMConversionForm from "@/components/uom-conversions/UomConversionForm";

export default function UOMConversionPage() {
  const [data, setData] = useState<UOMConversion[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<UOMConversion | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { request, loading } = useApi<UOMConversionListResponse>();

  const loadData = useCallback(async () => {
    const res = await request(() =>
      uomConversionService.getAll({
        search: search || undefined,
        page: page,
      }),
    );
    if (res) {
      setData(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(loadData, 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const columns = useMemo(
    () =>
      getColumns(
        (d) => {
          setSelected(d);
          setIsOpen(true);
        },
        (d) => {
          setSelected(d);
          setIsViewOpen(true);
        },
        loadData,
      ),
    [loadData],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setPage(1);
          setSearch(val);
        }}
        searchValue={search}
        onAddClick={() => {
          setSelected(null);
          setIsOpen(true);
        }}
        addLabel="Add Conversion"
        placeholder="Search conversions..."
      />

      <div className="relative">
        <DataTable columns={columns} data={data} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        loading={loading}
      />

      <AppDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={selected ? "Edit UOM Conversion" : "New UOM Conversion"}
        confirmText="Save Changes"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("uom-conversion-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
      >
        <UOMConversionForm
          initialData={selected}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsOpen(false);
            loadData();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Conversion Detail"
      >
        <ReadOnlyDetail data={selected} type="uomConversion" />
      </AppDialog>
    </div>
  );
}
