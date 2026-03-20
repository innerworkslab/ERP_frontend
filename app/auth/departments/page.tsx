"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "@/components/departments/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import {
  departmentService,
  DepartmentesListResponse,
  Department,
} from "@/api/departments.service";
import { Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DepartmentPage() {
  const router = useRouter();
  const [departments, setDepartmentes] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const { request, loading, error } = useApi<DepartmentesListResponse>();

  const loadDepartmentes = useCallback(async () => {
    const res = await request(() =>
      departmentService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page,
      }),
    );
    if (res) {
      setDepartmentes(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDepartmentes();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadDepartmentes]);

  return (
    <div className="space-y-6 relative min-h-100">
      <BaseFilter
        onSearch={(val) => {
          setPage(1);
          setSearch(val);
        }}
        placeholder="Search departments..."
        onAddClick={() => router.push("/auth/departments/add")}
        addLabel="Add Department"
      >
        <Select
          value={status}
          onValueChange={(val) => {
            setPage(1);
            setStatus(val);
          }}
        >
          <SelectTrigger className="w-40 min-h-11 bg-background/50 border-none rounded-2xl focus:ring-primary/30 outline-none transition-all flex items-center justify-between px-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Filter className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              <div className="text-[10px] font-bold uppercase tracking-widest truncate">
                <SelectValue placeholder="Status" />
              </div>
            </div>
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={6}
            className="w-40 bg-card/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-1 overflow-hidden"
          >
            <SelectItem
              value="all"
              className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5 text-start"
            >
              All Status
            </SelectItem>
            <SelectItem
              value="active"
              className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5 text-start"
            >
              Active
            </SelectItem>
            <SelectItem
              value="inactive"
              className="text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5 text-start"
            >
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </BaseFilter>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="relative space-y-2">
        <DataTable columns={columns} data={departments} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={setPage}
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
