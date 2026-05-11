"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { getColumns } from "@/components/departments/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { branchService } from "@/api/branches.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import DepartmentForm from "@/components/departments/DepartmentForm";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import {
  Department,
  departmentService,
  DepartmentsListResponse,
} from "@/api/departments.service";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Department | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      status: "all",
      branchId: "", // Changed from "all" to "" so it shows placeholder first
      page: 1,
    },
  });

  const search = watch("search");
  const status = watch("status");
  const branchId = watch("branchId");
  const page = watch("page");

  const { request, loading, error } = useApi<DepartmentsListResponse>();

  const loadDepartments = useCallback(async () => {
    // If you want to prevent loading until a branch is selected,
    // you could add: if (!branchId) return;

    const res = await request(() =>
      departmentService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        branch_id:
          branchId === "all" || branchId === "" ? undefined : Number(branchId),
        page: page,
      }),
    );
    if (res) {
      setDepartments(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, branchId, page]);

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) {
        setBranches(
          res.data.map((b) => ({ id: b.id.toString(), name: b.name })),
        );
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDepartments();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, branchId, page, loadDepartments]);

  const handleEdit = useCallback((dept: Department) => {
    setSelectedDept(dept);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((dept: Department) => {
    setViewData(dept);
    setIsViewOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadDepartments),
    [handleEdit, handleView, loadDepartments],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search} // Added to fix typing visibility
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search departments..."
        onAddClick={() => {
          setSelectedDept(null);
          setIsDialogOpen(true);
        }}
        addLabel="Add Department"
      >
        <div className="flex gap-3">
          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <div className="w-[180px]">
                <FormSelect
                  label=""
                  placeholder="Select Branch"
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
        <DataTable columns={columns} data={departments} />
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

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedDept ? "Modify Department" : "Register Department"}
        confirmText={selectedDept ? "Update Department" : "Create Department"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("department-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <DepartmentForm
          departmentData={selectedDept}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadDepartments();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Department Information"
      >
        <ReadOnlyDetail data={viewData} type="department" />
      </AppDialog>
    </div>
  );
}
