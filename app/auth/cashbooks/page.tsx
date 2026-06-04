"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { branchService } from "@/api/branches.service";
import { Loader2 } from "lucide-react";
import { FormSelect, Option } from "@/components/common/FormSelect";
import {
  Cashbook,
  cashbookService,
  CashbooksListResponse,
} from "@/api/cashbooks.service";
import { getColumns } from "@/components/cashbooks/columns";

export default function CashbookListPage() {
  const router = useRouter();
  const [cashbooks, setCashbooks] = useState<Cashbook[]>([]);
  const [branches, setBranches] = useState<Option[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      branchId: "all",
      type: "all",
      status: "all",
      page: 1,
    },
  });

  const search = watch("search");
  const branchId = watch("branchId");
  const type = watch("type");
  const status = watch("status");
  const page = watch("page");

  const { request, loading, error } = useApi<CashbooksListResponse>();

  const loadCashbooks = useCallback(async () => {
    const res = await request(() =>
      cashbookService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setCashbooks(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const branchRes = await branchService.getAll({ status: "active" });
        if (branchRes?.data) {
          setBranches(
            branchRes.data.map((b) => ({ id: b.id.toString(), name: b.name })),
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
      loadCashbooks();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, branchId, type, status, page, loadCashbooks]);

  const handleEdit = useCallback(
    (cashbook: Cashbook) => {
      router.push(`/auth/cashbooks/${cashbook.id}/edit`);
    },
    [router],
  );

  const handleView = useCallback(
    (cashbook: Cashbook) => {
      router.push(`/auth/cashbooks/${cashbook.id}`);
    },
    [router],
  );

  const handleAdd = () => {
    router.push("/auth/cashbooks/add");
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadCashbooks),
    [handleEdit, handleView, loadCashbooks],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search cashbooks..."
        onAddClick={handleAdd}
        addLabel="Add Cashbook"
      >
        <div className="flex gap-3">
          <Controller
            name="branchId"
            control={control}
            render={({ field }) => (
              <div className="w-[160px]">
                <FormSelect
                  label=""
                  options={[{ name: "All Branches", id: "all" }, ...branches]}
                  value={field.value || "all"}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("page", 1);
                  }}
                />
              </div>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="w-[160px]">
                <FormSelect
                  label=""
                  options={[
                    { name: "All Types", id: "all" },
                    { name: "Cash", id: "cash" },
                    { name: "Bank", id: "bank" },
                    { name: "Mobile Wallet", id: "mobile_wallet" },
                    { name: "Petty Cash", id: "petty_cash" },
                  ]}
                  value={field.value || "all"}
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
                  value={field.value || "all"}
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
        <DataTable columns={columns} data={cashbooks} />
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
