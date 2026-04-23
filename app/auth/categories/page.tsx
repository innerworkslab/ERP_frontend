"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { getColumns } from "@/components/categories/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import {
  categoryService,
  CategoryListResponse,
  Category,
} from "@/api/categories.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import CategoryForm from "@/components/categories/CategoryForm";
import { FormSelect } from "@/components/common/FormSelect";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastPage, setLastPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [formLoading, setFormLoading] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<Category | null>(null);

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

  const { request, loading, error } = useApi<CategoryListResponse>();

  const loadCategories = useCallback(async () => {
    const res = await request(() =>
      categoryService.getAll({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: page,
      }),
    );
    if (res) {
      setCategories(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, status, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, page, loadCategories]);

  const handleEdit = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  }, []);

  const handleView = useCallback((category: Category) => {
    setViewData(category);
    setIsViewOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadCategories),
    [handleEdit, handleView, loadCategories],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search categories..."
        onAddClick={handleAdd}
        addLabel="Add Category"
      >
        <div className="flex gap-3">
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
        <DataTable columns={columns} data={categories} />
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
                Syncing...
              </span>
            </div>
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedCategory ? "Modify Category" : "Register Category"}
        confirmText={selectedCategory ? "Update Category" : "Create Category"}
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("category-form")
            ?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
        }
      >
        <CategoryForm
          categoryData={selectedCategory}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadCategories();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Category Information"
      >
        <ReadOnlyDetail data={viewData} type="category" />
      </AppDialog>
    </div>
  );
}
