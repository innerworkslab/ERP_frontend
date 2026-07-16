"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { getColumns } from "@/components/delivery-notes/columns";
import { BaseFilter } from "@/components/common/BaseFilter";
import { DataTable } from "@/components/data-table/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { FormSelect } from "@/components/common/FormSelect";
import { useApi } from "@/hooks/useApi";
import {
  deliveryNoteService,
  DeliveryNote,
  DeliveryNoteListResponse,
} from "@/api/deliveryNotes.service";
import { branchService } from "@/api/branches.service";
import { customerService } from "@/api/customers.service";
import { deliveryProvidersService } from "@/api/deliveryProvider.service";
import { saleInvoicesService } from "@/api/sale.service";

export default function DeliveryNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleIdFromUrl = searchParams.get("sale_invoice_id");
  const isFilteredBySale = !!saleIdFromUrl;

  const [data, setData] = useState<DeliveryNote[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [sales, setSales] = useState([]);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      sale_invoice_id: saleIdFromUrl || "",
      branch_id: "",
      customer_id: "",
      delivery_provider_id: "",
      delivery_date_from: "",
      delivery_date_to: "",
      status: "all",
      page: 1,
    },
  });

  const { request, loading } = useApi<DeliveryNoteListResponse>();

  const [
    search,
    sale_invoice_id,
    branch_id,
    customer_id,
    delivery_provider_id,
    delivery_date_from,
    delivery_date_to,
    status,
    page,
  ] = watch([
    "search",
    "sale_invoice_id",
    "branch_id",
    "customer_id",
    "delivery_provider_id",
    "delivery_date_from",
    "delivery_date_to",
    "status",
    "page",
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [bRes, cRes, pRes, sRes] = await Promise.all([
        branchService.getAll(),
        customerService.getAll(),
        deliveryProvidersService.getAll(),
        saleInvoicesService.getAll(),
      ]);

      setBranches(bRes.data || []);
      setCustomers(cRes.data || []);
      setProviders(pRes.data || []);
      setSales(
        (sRes.data || []).map((item: any) => ({
          id: item.id,
          name: item.invoice_number,
        })),
      );
    };
    fetchOptions();
  }, []);

  const loadData = useCallback(async () => {
    const params = {
      search: search || undefined,
      sale_invoice_id: sale_invoice_id || undefined,
      branch_id: branch_id || undefined,
      customer_id: customer_id || undefined,
      delivery_provider_id: delivery_provider_id || undefined,
      delivery_date_from: delivery_date_from || undefined,
      delivery_date_to: delivery_date_to || undefined,
      status: status === "all" ? undefined : status,
      page,
    };

    const res = await request(() => deliveryNoteService.getAll(params));
    if (res) {
      setData(res.data || []);
      setLastPage(res.meta?.total_pages || 1);
    }
  }, [
    request,
    search,
    sale_invoice_id,
    branch_id,
    customer_id,
    delivery_provider_id,
    delivery_date_from,
    delivery_date_to,
    status,
    page,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadData]);

  const columns = getColumns(
    (note) =>
      router.push(
        `/auth/delivery-notes/${note.id}/edit${isFilteredBySale ? `?sale_invoice_id=${saleIdFromUrl}` : ""}`,
      ),
    (note) => router.push(`/auth/delivery-notes/${note.id}`),
    loadData,
  );

  return (
    <div className="space-y-6 relative min-h-100">
      <BaseFilter
        searchValue={search}
        onSearch={(val) => {
          setValue("page", 1);
          setValue("search", val);
        }}
        placeholder="Search by DN number..."
        onAddClick={() =>
          router.push(
            isFilteredBySale
              ? `/auth/delivery-notes/add?sale_invoice_id=${saleIdFromUrl}`
              : "/auth/delivery-notes/add",
          )
        }
        addLabel="Add Delivery Note"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                label=""
                options={[
                  { name: "All Status", id: "all" },
                  { name: "Draft", id: "draft" },
                  { name: "Confirmed", id: "confirmed" },
                  { name: "Rejected", id: "rejected" },
                ]}
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  setValue("page", 1);
                }}
              />
            )}
          />
          {!isFilteredBySale && (
            <>
              <Controller
                name="sale_invoice_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label=""
                    placeholder="Sale Invoice"
                    options={sales}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      setValue("page", 1);
                    }}
                  />
                )}
              />
              <Controller
                name="branch_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label=""
                    placeholder="Branch"
                    options={branches}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      setValue("page", 1);
                    }}
                  />
                )}
              />
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label=""
                    placeholder="Customer"
                    options={customers}
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      setValue("page", 1);
                    }}
                  />
                )}
              />
            </>
          )}
          <Controller
            name="delivery_provider_id"
            control={control}
            render={({ field }) => (
              <FormSelect
                label=""
                placeholder="Provider"
                options={providers}
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  setValue("page", 1);
                }}
              />
            )}
          />
          {!isFilteredBySale && (
            <>
              <input
                type="date"
                className="px-3 py-2 border rounded-md text-sm"
                onChange={(e) => {
                  setValue("delivery_date_from", e.target.value);
                  setValue("page", 1);
                }}
              />
              <input
                type="date"
                className="px-3 py-2 border rounded-md text-sm"
                onChange={(e) => {
                  setValue("delivery_date_to", e.target.value);
                  setValue("page", 1);
                }}
              />
            </>
          )}
        </div>
      </BaseFilter>
      <DataTable columns={columns} data={data} />
      <Pagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={(p) => setValue("page", p)}
        loading={loading}
      />
    </div>
  );
}
