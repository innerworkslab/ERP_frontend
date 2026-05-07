"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import {
  originCountryService,
  OriginCountryListResponse,
  OriginCountry,
} from "@/api/originCountries.service";
import { Loader2 } from "lucide-react";
import { AppDialog } from "@/components/common/AppDialog";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { getColumns } from "@/components/origin-countries/columns";
import OriginCountryForm from "@/components/origin-countries/OriginCountryForm";

export default function OriginCountryPage() {
  const [countries, setCountries] = useState<OriginCountry[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<OriginCountry | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState<OriginCountry | null>(null);

  const { watch, setValue } = useForm({
    defaultValues: { search: "", page: 1 },
  });
  const { search, page } = watch();
  const { request, loading } = useApi<OriginCountryListResponse>();

  const loadCountries = useCallback(async () => {
    const res = await request(() =>
      originCountryService.getAll({
        search: search || undefined,
        page: page,
      }),
    );
    if (res) {
      setCountries(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const timer = setTimeout(loadCountries, 400);
    return () => clearTimeout(timer);
  }, [loadCountries]);

  const handleEdit = (data: OriginCountry) => {
    setSelectedCountry(data);
    setIsDialogOpen(true);
  };
  const handleView = (data: OriginCountry) => {
    setViewData(data);
    setIsViewOpen(true);
  };
  const handleAdd = () => {
    setSelectedCountry(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleView, loadCountries),
    [loadCountries],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search countries..."
        onAddClick={handleAdd}
        addLabel="Add Country"
      />

      <div className="relative space-y-2">
        <DataTable columns={columns} data={countries} />
        <Pagination
          currentPage={page}
          lastPage={lastPage}
          onPageChange={(p) => setValue("page", p)}
          loading={loading}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-primary" />
          </div>
        )}
      </div>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={selectedCountry ? "Modify Country" : "Register Country"}
      >
        <OriginCountryForm
          countryData={selectedCountry}
          onSuccess={() => {
            setIsDialogOpen(false);
            loadCountries();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Country Details"
      >
        <ReadOnlyDetail data={viewData} type="originCountry" />
      </AppDialog>
    </div>
  );
}
