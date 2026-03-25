"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { BaseFilter } from "@/components/common/BaseFilter";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import {
  variationService,
  Variation,
  VariationListResponse,
} from "@/api/variations.service";
import { getColumns } from "@/components/variations/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VariationForm from "@/components/variations/VariationForm";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";

export default function VariationPage() {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [modalMode, setModalMode] = useState<"add" | "edit" | "view" | null>(
    null,
  );
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null,
  );

  const { request, loading } = useApi<VariationListResponse>();

  const loadVariations = useCallback(async () => {
    const res = await request(() =>
      variationService.getAll({ search: search || undefined, page }),
    );
    if (res) {
      setVariations(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => loadVariations(), 400);
    return () => clearTimeout(timer);
  }, [search, page, loadVariations]);

  const handleEdit = (data: Variation) => {
    setSelectedVariation(data);
    setModalMode("edit");
  };

  const handleView = (data: Variation) => {
    setSelectedVariation(data);
    setModalMode("view");
  };

  const handleAdd = () => {
    setSelectedVariation(null);
    setModalMode("add");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedVariation(null);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadVariations),
    [loadVariations],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setPage(1);
          setSearch(val);
        }}
        searchValue={search}
        placeholder="Search variations..."
        onAddClick={handleAdd}
        addLabel="Add Variation"
      />

      <DataTable columns={columns} data={variations} />

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        loading={loading}
      />

      <Dialog open={!!modalMode} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {modalMode === "view"
                ? "Variation Details"
                : modalMode === "edit"
                  ? "Edit Variation"
                  : "Add Variation"}
            </DialogTitle>
          </DialogHeader>

          {modalMode === "view" && selectedVariation ? (
            <div className="py-4">
              <ReadOnlyDetail data={selectedVariation} type="variation" />
            </div>
          ) : (
            <VariationForm
              initialData={selectedVariation}
              onCancel={closeModal}
              onSuccess={() => {
                closeModal();
                loadVariations();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
