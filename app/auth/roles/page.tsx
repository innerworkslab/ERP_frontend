"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { getColumns } from "@/components/roles/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { branchService } from "@/api/branches.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import RoleForm from "@/components/roles/RoleForm";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { Role, RolesListResponse, rolesService } from "@/api/roles.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Role | null>(null);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      status: "all",
      branchId: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const status = watch("status");
  const branchId = watch("branchId");
  const page = watch("page");

  const { request, loading, error } = useApi<RolesListResponse>();

  const loadRoles = useCallback(async () => {
    const res = await request(() =>
      rolesService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        branch_id: branchId === "all" ? undefined : Number(branchId),
        page: page,
      }),
    );
    if (res) {
      setRoles(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, branchId, page]);

  useEffect(() => {
    branchService.getAll({ status: "active" }).then((res) => {
      if (res?.data) {
        const options = res.data.map((b) => ({
          id: b.id.toString(),
          name: b.name,
        }));
        setBranches(options);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRoles();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, branchId, page, loadRoles]);

  const handleEdit = useCallback((role: Role) => {
    setSelectedRoleId(role.id);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((role: Role) => {
    setViewData(role);
    setIsViewOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedRoleId(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadRoles),
    [handleEdit, handleView, loadRoles],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search roles..."
        onAddClick={handleAdd}
        addLabel="Add Role"
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
        <DataTable columns={columns} data={roles} />
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
                Syncing Roles...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedRoleId ? "Modify Role" : "Register Role"}
        description="Configure role permissions and organizational placement."
        confirmText={selectedRoleId ? "Update Changes" : "Create Role"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("role-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <RoleForm
          roleId={selectedRoleId}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadRoles();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Role Information"
        description="Detailed view of role configuration and hierarchy."
      >
        <ReadOnlyDetail data={viewData} type="role" />
      </AppDialog>
    </div>
  );
}
