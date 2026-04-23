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
import DiscountGroupForm from "@/components/discountGroups/DiscountGroupForm";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import {
  DiscountGroup,
  discountGroupService,
  DiscountGroupListResponse,
} from "@/api/discountGroups.service";
import { getColumns } from "@/components/discountGroups/columns";
import { customerTypeService } from "@/api/customerTypes.service";

export default function DiscountGroupPage() {
  const [discountGroups, setDiscountGroups] = useState<DiscountGroup[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [customerTypes, setCustomerTypes] = useState<Option[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DiscountGroup | null>(
    null,
  );
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<DiscountGroup | null>(null);

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

  const { request, loading, error } = useApi<DiscountGroupListResponse>();

  const loadData = useCallback(async () => {
    const res = await request(() =>
      discountGroupService.getAll({
        search: search || undefined,
        branch_id: branchId === "all" ? undefined : Number(branchId),
        customer_type_id:
          customerTypeId === "all" ? undefined : Number(customerTypeId),
        page: page,
      }),
    );
    if (res) {
      setDiscountGroups(res.data || []);
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
            branchRes.data.map((b) => ({
              id: b.id.toString(),
              name: b.name,
            })),
          );
        }

        if (typeRes?.data) {
          setCustomerTypes(
            typeRes.data.map((t) => ({
              id: t.id.toString(),
              name: t.name,
            })),
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
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, branchId, customerTypeId, page, loadData]);

  const handleEdit = useCallback((group: DiscountGroup) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((group: DiscountGroup) => {
    setViewData(group);
    setIsViewOpen(true);
  }, []);

  const handleToggle = useCallback(
    async (id: number) => {
      await discountGroupService.toggleStatus(id);
      loadData();
    },
    [loadData],
  );

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, handleToggle),
    [handleEdit, handleView, handleToggle],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search discount groups..."
        onAddClick={() => {
          setSelectedGroup(null);
          setIsDialogOpen(true);
        }}
        addLabel="Add Discount Group"
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

      <div className="relative space-y-2">
        <DataTable columns={columns} data={discountGroups} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px] rounded-[2rem]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedGroup ? "Edit Discount Group" : "New Discount Group"}
        confirmText="Save changes"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("discount-group-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
      >
        <DiscountGroupForm
          initialData={selectedGroup}
          setLoading={setFormLoading}
          branches={branches}
          customerTypes={customerTypes}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadData();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Discount Group Details"
      >
        <ReadOnlyDetail data={viewData} type="discountGroup" />
      </AppDialog>
    </div>
  );
}
