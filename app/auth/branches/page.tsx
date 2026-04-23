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

  const { search, status, page } = watch();
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

      <div className="relative space-y-2">
        <DataTable columns={columns} data={branches} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
