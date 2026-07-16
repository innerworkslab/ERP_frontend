"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { saleInvoicesService, SaleInvoiceDetail } from "@/api/sale.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { AppDialog } from "@/components/common/AppDialog";
import { toast } from "sonner";
import { Edit, Loader2, ArrowLeft, BadgeAlert } from "lucide-react";

export default function ViewSaleInvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const invoiceId = Number(id);

  const [invoice, setInvoice] = useState<SaleInvoiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    stateTarget: "reserved" | "pending" | "ordered" | "delivered" | null;
  }>({ open: false, stateTarget: null });

  const fetchInvoiceContext = async () => {
    try {
      setIsLoading(true);
      const res = await saleInvoicesService.getById(invoiceId);
      const orderData = res?.data || res;
      if (orderData) {
        setInvoice(orderData);
      }
    } catch (err) {
      console.error("Failed to fetch sale invoice detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) fetchInvoiceContext();
  }, [invoiceId]);

  const transitionStateCommit = async () => {
    if (!dialogState.stateTarget) return;
    try {
      setActionLoading(true);
      if (dialogState.stateTarget === "reserved")
        await saleInvoicesService.markAsReserved(invoiceId);
      if (dialogState.stateTarget === "pending")
        await saleInvoicesService.markAsPending(invoiceId);
      if (dialogState.stateTarget === "ordered")
        await saleInvoicesService.markAsOrdered(invoiceId);
      if (dialogState.stateTarget === "delivered")
        await saleInvoicesService.markAsDelivered(invoiceId);

      toast.success(
        `Workflow pipeline escalated to state status: [${dialogState.stateTarget}]`,
      );
      setDialogState({ open: false, stateTarget: null });
      fetchInvoiceContext();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/sale-invoices")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ledger
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDialogState({ open: true, stateTarget: "reserved" })
            }
          >
            Hold Reserve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDialogState({ open: true, stateTarget: "pending" })
            }
          >
            Flag Pending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDialogState({ open: true, stateTarget: "ordered" })
            }
          >
            Verify Ordered
          </Button>
          <Button
            onClick={() => router.push(`/auth/sale-invoices/${id}/edit`)}
            className="rounded-xl"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Invoice
          </Button>
        </div>
      </div>

      <div className="px-4">
        <ReadOnlyDetail data={invoice} type="saleInvoice" />
      </div>

      <AppDialog
        open={dialogState.open}
        onOpenChange={(v) =>
          !v && setDialogState({ open: false, stateTarget: null })
        }
        title="Confirm Workflow Pipeline State Escalation"
        confirmText="Confirm Change State"
        loading={actionLoading}
        onConfirm={transitionStateCommit}
      >
        <div className="flex items-center gap-3 p-2 text-sm">
          <BadgeAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <span>
            Are you sure you want to change this sale invoice to{" "}
            <strong>{dialogState.stateTarget}</strong>? This will modify the
            operational tracking context in the system database.
          </span>
        </div>
      </AppDialog>
    </div>
  );
}
