"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getColumns } from "@/components/customer-types/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { useApi } from "@/hooks/useApi";
import {
  customerTypeService,
  CustomerType,
  CustomerTypeListResponse,
} from "@/api/customerTypes.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import CustomerTypeForm from "@/components/customer-types/CustomerTypeForm";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";

export default function CustomerTypePage() {
  const [data, setData] = useState<CustomerType[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<CustomerType | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { request, loading } = useApi<CustomerTypeListResponse>();

  const loadData = useCallback(async () => {
    const res = await request(() => customerTypeService.getAll({ search }));
    if (res) setData(res.data || []);
  }, [request, search]);

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
        () => {}, // Delete logic if needed
      ),
    [loadData],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={setSearch}
        searchValue={search}
        onAddClick={() => {
          setSelected(null);
          setIsOpen(true);
        }}
        addLabel="Add Type"
        placeholder="Search types..."
      />

      <div className="relative">
        <DataTable columns={columns} data={data} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <AppDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={selected ? "Edit Customer Type" : "New Customer Type"}
        confirmText="Save Changes"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("customer-type-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
      >
        <CustomerTypeForm
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
        title="Customer Type Detail"
      >
        <ReadOnlyDetail data={selected} type="customerType" />
      </AppDialog>
    </div>
  );
}
