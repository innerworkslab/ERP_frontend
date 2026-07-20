"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  CalendarClock,
  ShoppingBag,
  PackageCheck,
  AlertCircle,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { SaleInvoiceListItem, saleInvoicesService } from "@/api/sale.service";
import { AppDialog } from "@/components/common/AppDialog";
import { useRouter } from "next/navigation";

const ActionCell = ({
  invoice,
  onEdit,
  onView,
  refresh,
}: {
  invoice: SaleInvoiceListItem;
  onEdit: (invoice: SaleInvoiceListItem) => void;
  onView: (invoice: SaleInvoiceListItem) => void;
  refresh: () => void;
}) => {
  const [isMutating, setIsMutating] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    targetState: "reserved" | "pending" | "ordered" | "delivered" | null;
  }>({ open: false, targetState: null });

  const router = useRouter();

  const executeStateTransition = async () => {
    if (!dialogState.targetState) return;
    try {
      setIsMutating(true);
      if (dialogState.targetState === "reserved")
        await saleInvoicesService.markAsReserved(invoice.id);
      if (dialogState.targetState === "pending")
        await saleInvoicesService.markAsPending(invoice.id);
      if (dialogState.targetState === "ordered")
        await saleInvoicesService.markAsOrdered(invoice.id);

      toast.success(
        `Invoice escalated successfully to ${dialogState.targetState}`,
      );
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMutating(false);
      setDialogState({ open: false, targetState: null });
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(invoice)}
        disabled={isMutating}
      >
        <Eye />
      </Button>

      {["draft", "pending"].includes(invoice.status) && (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
          onClick={() => onEdit(invoice)}
          disabled={isMutating}
        >
          <Edit />
        </Button>
      )}

      <Button
        variant="ghost"
        title="Delivery Notes"
        className="h-8 w-8 p-0 text-cyan-600 hover:bg-cyan-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() =>
          router.push(`/auth/delivery-notes?sale_invoice_id=${invoice.id}`)
        }
        disabled={isMutating}
      >
        <Truck />
      </Button>

      {invoice.status === "draft" && (
        <Button
          variant="ghost"
          title="Reserve"
          className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
          onClick={() =>
            setDialogState({ open: true, targetState: "reserved" })
          }
          disabled={isMutating}
        >
          <CalendarClock />
        </Button>
      )}

      {invoice.status === "reserved" && (
        <Button
          variant="ghost"
          title="Pending"
          className="h-8 w-8 p-0 text-orange-500 hover:bg-orange-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
          onClick={() => setDialogState({ open: true, targetState: "pending" })}
          disabled={isMutating}
        >
          <AlertCircle />
        </Button>
      )}

      {invoice.status === "pending" && (
        <Button
          variant="ghost"
          title="Ordered"
          className="h-8 w-8 p-0 text-indigo-500 hover:bg-indigo-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
          onClick={() => setDialogState({ open: true, targetState: "ordered" })}
          disabled={isMutating}
        >
          <ShoppingBag />
        </Button>
      )}

      <AppDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        title="Change Invoice Status"
        description={`Are you sure you want to change the status to ${dialogState.targetState}?`}
        onConfirm={executeStateTransition}
        isLoading={isMutating}
      />
    </div>
  );
};

export const getColumns = (
  onEdit: (invoice: SaleInvoiceListItem) => void,
  onView: (invoice: SaleInvoiceListItem) => void,
  refresh: () => void,
): ColumnDef<SaleInvoiceListItem>[] => [
  {
    accessorKey: "invoice_date",
    header: "Invoice Date",
    cell: ({ row }) => (
      <span className="font-mono font-bold">
        {new Date(row.original.invoice_date).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Reference",
    cell: ({ row }) => (
      <span className="font-mono font-bold">{row.original.invoice_number}</span>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => <span>{row.original.customer?.name || "-"}</span>,
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) => (
      <span className="font-mono font-semibold">
        {Number(row.original.grand_total).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.payment_status;
      const isPaid = status === "paid";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            isPaid
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Pipeline Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border">
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        invoice={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
