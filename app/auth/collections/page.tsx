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
import AddProductForm from "@/components/collections/productList/AddProductForm";
import {
  collectionsService,
  Collection,
  CollectionsListResponse,
} from "@/api/collections.service";
import { getColumns } from "@/components/collections/columns";

export default function CollectionsPage() {
  const router = useRouter();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", status: "all", page: 1 },
  });

  const { search, status, page } = watch();
  const { request, loading, error } = useApi<CollectionsListResponse>();

  const loadCollections = useCallback(async () => {
    const res = await request(() =>
      collectionsService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );

    if (res) {
      setCollections(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCollections();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadCollections]);

  const handleEdit = useCallback(
    (col: Collection) => {
      router.push(`/auth/collections/${col.id}/edit`);
    },
    [router],
  );

  const handleView = useCallback(
    (col: Collection) => {
      router.push(`/auth/collections/${col.id}`);
    },
    [router],
  );

  const handleAddProducts = useCallback((col: Collection) => {
    setSelectedCollection(col);
    setIsAddProductOpen(true);
  }, []);

  const handleAdd = () => {
    router.push("/auth/collections/add");
  };

  const columns = useMemo(
    () =>
      getColumns(handleEdit, handleView, handleAddProducts, loadCollections),
    [handleEdit, handleView, handleAddProducts, loadCollections],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search collection name..."
        onAddClick={handleAdd}
        addLabel="Add Collection"
      />

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={collections} />

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
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        title={`Add Products to ${selectedCollection?.name}`}
        description="Select multiple products and set quantities to link them with this collection."
      >
        {selectedCollection && (
          <AddProductForm
            collectionId={selectedCollection.id}
            onSuccess={() => {
              setIsAddProductOpen(false);
              loadCollections();
            }}
          />
        )}
      </AppDialog>
    </div>
  );
}
