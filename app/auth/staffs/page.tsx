"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getColumns } from "@/components/staffs/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { staffService, StaffsListResponse, Staff } from "@/api/staffs.service";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FormSelect } from "@/components/common/FormSelect";

export default function StaffPage() {
  const router = useRouter();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [lastPage, setLastPage] = useState(1);

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

  const { request, loading, error } = useApi<StaffsListResponse>();

  const loadStaffs = useCallback(async () => {
    const res = await request(() =>
      staffService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page,
      }),
    );
    if (res) {
      setStaffs(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStaffs();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadStaffs]);

  const columns = useMemo(() => getColumns(loadStaffs), [loadStaffs]);

  return (
    <div className="space-y-6 relative min-h-100">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search staffs..."
        onAddClick={() => router.push("/auth/staffs/add")}
        addLabel="Add Staff"
      >
        <div className="flex gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="w-[140px]">
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
        <DataTable columns={columns} data={staffs} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px] rounded-4xl transition-all">
            <div className="bg-card/90 p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-bold uppercase tracking-tighter">
                Syncing...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
