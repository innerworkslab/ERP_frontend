"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  saleInvoicesService,
  SaleInvoiceDetail,
} from "@/api/sale.service";
import SaleInvoiceForm from "@/components/sale-invoices/SaleInvoiceForm";
import { Loader2 } from "lucide-react";

export default function EditSaleInvoicePage() {
  const params = useParams();
  const id = Number(params.id);
  const [invoice, setInvoice] = useState<SaleInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    saleInvoicesService
      .getById(id)
      .then((res) => {
        if (res?.data) setInvoice(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Modify Sale Invoice
        </h1>
        <p className="text-sm text-muted-foreground">
          Adjust attributes, dynamic quantities or structural parameters for
          entity ledger consistency.
        </p>
      </div>
      <SaleInvoiceForm invoiceData={invoice} />
    </div>
  );
}
