"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import {
  inventoryService,
  Inventory,
  InventoryListResponse,
} from "@/api/inventories.service";
import { getColumns } from "@/components/inventories/columns";

export default function InventoryPage() {
  const router = useRouter();

  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Inventory | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: { search: "", status: "all", page: 1 },
  });

  const { search, status, page } = watch();
  const { request, loading, error } = useApi<InventoryListResponse>();

  const loadInventories = useCallback(async () => {
    const res = await request(() =>
      inventoryService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );

    if (res) {
      setInventories(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadInventories();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, page, loadInventories]);

  // ✅ Navigate to edit page
  const handleEdit = useCallback(
    (inv: Inventory) => {
      router.push(`/auth/inventories/${inv.id}/edit`);
    },
    [router],
  );

  const handleView = useCallback(
    (inv: Inventory) => {
      router.push(`/auth/inventories/${inv.id}`);
    },
    [router],
  );

  // ✅ Navigate to create page
  const handleAdd = () => {
    router.push("/auth/inventories/add");
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadInventories),
    [handleEdit, handleView, loadInventories],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search inventory name..."
        onAddClick={handleAdd}
        addLabel="Add Inventory"
      />

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={inventories} />

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
                Syncing...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Inventory Information"
        description="Detailed overview of inventory and assigned branches."
      >
        <ReadOnlyDetail data={viewData} type="inventory" />
      </AppDialog>
    </div>
  );
}
