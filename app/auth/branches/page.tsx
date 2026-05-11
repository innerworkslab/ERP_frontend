"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getColumns } from "@/components/branches/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import {
  branchService,
  BranchesListResponse,
  Branch,
} from "@/api/branches.service";
import { Loader2 } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";

export default function BranchPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { control, watch, setValue } = useForm({
    defaultValues: { search: "", status: "all", page: 1 },
  });

  const search = watch("search");
  const status = watch("status");
  const page = watch("page");

  const { request, loading, error } = useApi<BranchesListResponse>();

  const loadBranches = useCallback(async () => {
    const res = await request(() =>
      branchService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setBranches(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(loadBranches, 400);
    return () => clearTimeout(timer);
  }, [loadBranches]);

  const handleEdit = (branch: Branch) =>
    router.push(`/auth/branches/${branch.id}/edit`);
  const handleView = (branch: Branch) =>
    router.push(`/auth/branches/${branch.id}`);
  const handleAdd = () => router.push(`/auth/branches/add`);

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadBranches),
    [loadBranches],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search branches..."
        onAddClick={handleAdd}
        addLabel="Add Branch"
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
        <DataTable columns={columns} data={branches} />

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
