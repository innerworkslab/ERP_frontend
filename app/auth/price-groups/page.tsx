"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { branchService } from "@/api/branches.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import PriceGroupForm from "@/components/price-groups/PriceGroupForm";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import {
  PriceGroup,
  priceGroupService,
  PriceGroupListResponse,
} from "@/api/priceGroups.service";
import { getColumns } from "@/components/price-groups/column";
import { customerTypeService } from "@/api/customerTypes.service";

export default function PriceGroupPage() {
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [customerTypes, setCustomerTypes] = useState<Option[]>([
    { name: "Retail", id: "1" },
  ]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PriceGroup | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<PriceGroup | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      branchId: "all",
      customerTypeId: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const branchId = watch("branchId");
  const customerTypeId = watch("customerTypeId");
  const page = watch("page");

  const { request, loading, error } = useApi<PriceGroupListResponse>();

  const loadPriceGroups = useCallback(async () => {
    const res = await request(() =>
      priceGroupService.getAll({
        search: search || undefined,
        branch_id: branchId === "all" ? undefined : Number(branchId),
        customer_type_id:
          customerTypeId === "all" ? undefined : Number(customerTypeId),
        page: page,
      }),
    );
    if (res) {
      setPriceGroups(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, branchId, customerTypeId, page]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [branchRes, typeRes] = await Promise.all([
          branchService.getAll({ status: "active" }),
          customerTypeService.getAll(),
        ]);

        if (branchRes?.data) {
          setBranches(
            branchRes.data.map((b) => ({ id: b.id.toString(), name: b.name })),
          );
        }

        if (typeRes?.data) {
          setCustomerTypes(
            typeRes.data.map((t) => ({ id: t.id.toString(), name: t.name })),
          );
        }
      } catch (err) {
        console.error("Failed to load options", err);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPriceGroups();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, branchId, customerTypeId, page, loadPriceGroups]);

  const handleEdit = useCallback((group: PriceGroup) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((group: PriceGroup) => {
    setViewData(group);
    setIsViewOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedGroup(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadPriceGroups),
    [handleEdit, handleView, loadPriceGroups],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search price groups..."
        onAddClick={handleAdd}
        addLabel="Add Price Group"
      >
        <div className="flex gap-3">
          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <div className="w-[180px]">
                <FormSelect
                  label=""
                  placeholder="All Branches"
                  options={[{ name: "All Branches", id: "all" }, ...branches]}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              </div>
            )}
          />
          <Controller
            name="customerTypeId"
            control={control}
            render={({ field }) => (
              <div className="w-[180px]">
                <FormSelect
                  label=""
                  placeholder="All Customer Types"
                  options={[{ name: "All Types", id: "all" }, ...customerTypes]}
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
        <DataTable columns={columns} data={priceGroups} />
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedGroup ? "Modify Price Group" : "Register Price Group"}
        confirmText={selectedGroup ? "Update Group" : "Create Group"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("price-group-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <PriceGroupForm
          initialData={selectedGroup}
          setLoading={setFormLoading}
          branches={branches}
          customerTypes={customerTypes}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadPriceGroups();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Price Group Information"
        description="Detailed overview of price group configuration."
      >
        <ReadOnlyDetail data={viewData} type="priceGroup" />
      </AppDialog>
    </div>
  );
}
