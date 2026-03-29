"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import RoleForm from "@/components/roles/RoleForm";
import { FormSelect } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Brand, BrandListResponse, brandService } from "@/api/brands.service";
import { getColumns } from "@/components/brands/columns";
import BrandForm from "@/components/brands/BrandForm";

export default function RolePage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Brand | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      status: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const status = watch("status");
  const page = watch("page");

  const { request, loading, error } = useApi<BrandListResponse>();

  const loadRoles = useCallback(async () => {
    const res = await request(() =>
      brandService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setBrands(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRoles();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadRoles]);

  const handleEdit = useCallback((role: Brand) => {
    setSelectedBrandId(role.id);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((role: Brand) => {
    setViewData(role);
    setIsViewOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedBrandId(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadRoles),
    [handleEdit, handleView, loadRoles],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search brands..."
        onAddClick={handleAdd}
        addLabel="Add Brand"
      >
        <div className="flex gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="w-[140px]">
                <FormSelect
                  label=""
                  placeholder="Status"
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
        <DataTable columns={columns} data={brands} />
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
                Syncing Roles...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedBrandId ? "Modify Brand" : "Register Brand"}
        confirmText={selectedBrandId ? "Update Changes" : "Create Brand"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("brand-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <BrandForm
          brandData={
            selectedBrandId
              ? brands.find((b) => b.id === selectedBrandId)
              : undefined
          }
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadRoles();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Brand Information"
      >
        <ReadOnlyDetail data={viewData} type="brand" />
      </AppDialog>
    </div>
  );
}
