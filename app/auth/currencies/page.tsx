"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { BaseFilter } from "@/components/common/BaseFilter";
import { Pagination } from "@/components/common/Pagination";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import {
  currencyService,
  Currency,
  CurrencyListResponse,
} from "@/api/currencies.service";
import { getColumns } from "@/components/currencies/columns";
import { AppDialog } from "@/components/common/AppDialog";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import CurrencyForm from "@/components/currencies/CurrencyForm";
import UpdateRateForm from "@/components/currencies/UpdateRateForm";
import { RateHistory } from "@/components/currencies/RateHistory";

export default function CurrencyPage() {
  const [data, setData] = useState<Currency[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [selected, setSelected] = useState<Currency | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const isInitialized = useRef(false);

  const { request, loading } = useApi<CurrencyListResponse>();

  const loadData = useCallback(async () => {
    const res = await request(() =>
      currencyService.getAll({
        search: search || undefined,
        page: page,
      }),
    );
    if (res && res.data) {
      setData(res.data);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [request, search, page]);

  useEffect(() => {
    const fetch = async () => {
      await loadData();
    };

    if (!isInitialized.current) {
      fetch();
      isInitialized.current = true;
    } else {
      const timer = setTimeout(fetch, 400);
      return () => clearTimeout(timer);
    }
  }, [loadData]);

  const columns = useMemo(
    () =>
      getColumns(
        (d) => {
          setSelected(d);
          setIsOpen(true);
        },
        (d) => {
          setSelected(d);
          setIsViewOpen(true);
        },
        (d) => {
          setSelected(d);
          setIsRateOpen(true);
        },
        (d) => {
          setSelected(d);
          setIsHistoryOpen(true);
        },
      ),
    [loadData],
  );

  return (
    <div className="space-y-6 relative min-h-[400px]">
      <BaseFilter
        onSearch={(val) => {
          setPage(1);
          setSearch(val);
        }}
        searchValue={search}
        onAddClick={() => {
          setSelected(null);
          setIsOpen(true);
        }}
        addLabel="Add Currency"
        placeholder="Search currencies..."
      />

      <div className="relative">
        <DataTable columns={columns} data={data} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[2px] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        loading={loading}
      />

      <AppDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={selected ? "Edit Currency" : "New Currency"}
        confirmText="Save Changes"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("currency-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
      >
        <CurrencyForm
          initialData={selected}
          setLoading={setFormLoading}
          onSuccess={() => {
            setIsOpen(false);
            loadData();
          }}
        />
      </AppDialog>

      <AppDialog
        open={isRateOpen}
        onOpenChange={setIsRateOpen}
        title="Update Exchange Rate"
        confirmText="Update Rate"
        loading={formLoading}
        onConfirm={() =>
          document
            .getElementById("update-rate-form")
            ?.dispatchEvent(new Event("submit", { bubbles: true }))
        }
      >
        {selected && (
          <UpdateRateForm
            currency={selected}
            setLoading={setFormLoading}
            onSuccess={() => {
              setIsRateOpen(false);
              loadData();
            }}
          />
        )}
      </AppDialog>

      <AppDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        title="Rate History"
      >
        {selected && <RateHistory currencyId={selected.id} />}
      </AppDialog>

      <AppDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Currency Detail"
      >
        <ReadOnlyDetail data={selected} type="currency" />
      </AppDialog>
    </div>
  );
}
