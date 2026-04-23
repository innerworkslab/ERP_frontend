"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { taxService, TaxListResponse, Tax } from "@/api/taxes.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import { FormSelect } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { getColumns } from "@/components/taxes/columns";
import TaxForm from "@/components/taxes/TaxForm";

export default function TaxPage() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Tax | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: { search: "", status: "all", page: 1 },
  });
  const { search, status, page } = watch();
  const { request, loading, error } = useApi<TaxListResponse>();

  const loadTaxes = useCallback(async () => {
    const res = await request(() =>
      taxService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setTaxes(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(loadTaxes, 400);
    return () => clearTimeout(timer);
  }, [loadTaxes]);

  const handleEdit = (tax: Tax) => {
    setSelectedTax(tax);
    setIsDialogOpen(true);
  };
  const handleView = (tax: Tax) => {
    setViewData(tax);
    setIsViewOpen(true);
  };
  const handleAdd = () => {
    setSelectedTax(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadTaxes),
    [loadTaxes],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search taxes..."
        onAddClick={handleAdd}
        addLabel="Add Tax"
      >
        <div className="w-[140px]">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                label=""
                options={[
                  { name: "All Status", id: "all" },
                  { name: "Active", id: "active" },
                  { name: "Inactive", id: "inactive" },
                ]}
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  setValue("page", 1);
                }}
              />
            )}
          />
        </div>
      </BaseFilter>

      <div className="relative space-y-2">
        <DataTable columns={columns} data={taxes} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-primary" />
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedTax ? "Modify Tax" : "Register Tax"}
      >
        <TaxForm
          taxData={selectedTax}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadTaxes();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Tax Details"
      >
        <ReadOnlyDetail data={viewData} type="tax" />
      </AppDialog>
    </div>
  );
}
