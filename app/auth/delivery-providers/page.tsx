"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import { FormSelect } from "@/components/common/FormSelect";
import {
  DeliveryProvider,
  DeliveryProvidersListResponse,
  deliveryProvidersService,
} from "@/api/deliveryProvider.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { getColumns } from "@/components/delivery-providers/columns";
import DeliveryProviderForm from "@/components/delivery-providers/DeliveryProviderForm";

export default function DeliveryProviderPage() {
  const [providers, setProviders] = useState<DeliveryProvider[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null,
  );
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<DeliveryProvider | null>(null);

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

  const { request, loading, error } = useApi<DeliveryProvidersListResponse>();

  const loadProviders = useCallback(async () => {
    const res = await request(() =>
      deliveryProvidersService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setProviders(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProviders();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadProviders]);

  const handleEdit = useCallback((provider: DeliveryProvider) => {
    setSelectedProviderId(provider.id);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((provider: DeliveryProvider) => {
    setViewData(provider);
    setIsViewOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedProviderId(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadProviders),
    [handleEdit, handleView, loadProviders],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search providers..."
        onAddClick={handleAdd}
        addLabel="Add Provider"
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
        <DataTable columns={columns} data={providers} />
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
                Syncing Providers...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={
          selectedProviderId
            ? "Modify Delivery Provider"
            : "Register Delivery Provider"
        }
        confirmText={selectedProviderId ? "Update Changes" : "Create Provider"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("delivery-provider-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <DeliveryProviderForm
          providerId={selectedProviderId}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadProviders();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Delivery Provider Information"
        description="Detailed view of delivery provider pricing and configurations."
      >
        <ReadOnlyDetail data={viewData} type="deliveryProvider" />
      </AppDialog>
    </div>
  );
}
