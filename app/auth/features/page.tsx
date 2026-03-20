"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { getColumns } from "@/components/features/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import {
  featureService,
  FeatureListResponse,
  Feature,
} from "@/api/features.service";
import { branchService } from "@/api/branches.service";
import { departmentService } from "@/api/departments.service";
import { rolesService } from "@/api/roles.service";
import { Loader2, RotateCcw } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import FeatureAssignForm from "@/components/features/FeatureAssignForm";
import { FormSelect } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";

export default function FeaturePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Feature | null>(null);

  const [branches, setBranches] = useState<{ name: string; id }[]>([]);
  const [departments, setDepartments] = useState<{ name: string; id }[]>([]);
  const [roles, setRoles] = useState<{ name: string; id }[]>([]);

  const { control, watch, setValue, reset } = useForm({
    defaultValues: {
      search: "",
      status: "all",
      page: 1,
      branch_id: "all",
      department_id: "all",
      role_id: "all",
    },
  });

  const { search, status, page, branch_id, department_id, role_id } = watch();
  const { request, loading } = useApi<FeatureListResponse>();

  const loadFeatures = useCallback(async () => {
    const res = await request(() =>
      featureService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
        branch_id: branch_id === "all" ? undefined : Number(branch_id),
        department_id:
          department_id === "all" ? undefined : Number(department_id),
        role_id: role_id === "all" ? undefined : Number(role_id),
      }),
    );
    if (res) {
      setFeatures(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page, branch_id, department_id, role_id]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [bRes, dRes, rRes] = await Promise.all([
          branchService.getAll(),
          departmentService.getAll(),
          rolesService.getAll(),
        ]);
        setBranches([
          { name: "All Branches", id: "all" },
          ...(bRes.data || []),
        ]);
        setDepartments([
          { name: "All Departments", id: "all" },
          ...(dRes.data || []),
        ]);
        setRoles([{ name: "All Roles", id: "all" }, ...(rRes.data || [])]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadFeatures(), 400);
    return () => clearTimeout(timer);
  }, [loadFeatures]);

  const handleClear = () => {
    reset({
      search: "",
      status: "all",
      page: 1,
      branch_id: "all",
      department_id: "all",
      role_id: "all",
    });
  };

  const handleAssign = useCallback((feature: Feature) => {
    setSelectedFeature(feature);
    setIsAssignOpen(true);
  }, []);

  const handleView = useCallback((feature: Feature) => {
    setViewData(feature);
    setIsViewOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(handleAssign, handleView, loadFeatures),
    [handleAssign, handleView, loadFeatures],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        searchValue={search}
        placeholder="Search features..."
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-[140px]">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
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
              )}
            />
          </div>

          <div className="w-[160px]">
            <Controller
              name="branch_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label=""
                  placeholder="Branch"
                  options={branches}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              )}
            />
          </div>

          <div className="w-[160px]">
            <Controller
              name="department_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label=""
                  placeholder="Department"
                  options={departments}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              )}
            />
          </div>

          <div className="w-[160px]">
            <Controller
              name="role_id"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label=""
                  placeholder="Role"
                  options={roles}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              )}
            />
          </div>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-primary h-9 px-4 rounded-2xl gap-2 transition-all border border-dashed border-muted-foreground/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Reset
            </span>
          </Button> */}

          <div className="w-[52px]" />
        </div>
      </BaseFilter>

      <div className="relative space-y-2">
        <DataTable columns={columns} data={features} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px] z-10">
            <div className="bg-card/90 p-4 rounded-2xl border shadow-sm flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-bold uppercase tracking-tighter">
                Syncing...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        title="Access Control"
        confirmText="Save Assignments"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("feature-assign-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        {selectedFeature && (
          <FeatureAssignForm
            feature={selectedFeature}
            setLoading={setFormLoading}
            onSuccess={() => {
              setIsAssignOpen(false);
              loadFeatures();
            }}
          />
        )}
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Feature Blueprint"
      >
        <ReadOnlyDetail data={viewData} type="feature" />
      </AppDialog>
    </div>
  );
}
