"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit2,
  Check,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cashbookService, CashbookTransferItem } from "@/api/cashbooks.service";
import { AppDialog } from "@/components/common/AppDialog";

const ActionCell = ({
  transfer,
  onView,
  onEdit,
  refresh,
}: {
  transfer: CashbookTransferItem;
  onView: (data: CashbookTransferItem) => void;
  onEdit: (data: CashbookTransferItem) => void;
  refresh: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogAction, setDialogAction] = useState<"confirm" | "reject" | null>(
    null,
  );

  const isPending = transfer.status.toLowerCase() === "pending";
  const isConfirmed = ["confirmed", "success"].includes(
    transfer.status.toLowerCase(),
  );
  const isRejected = transfer.status.toLowerCase() === "rejected";

  const handleAction = async () => {
    if (!dialogAction) return;
    try {
      setIsProcessing(true);
      const res =
        dialogAction === "confirm"
          ? await cashbookService.confirmTransfer(transfer.id)
          : await cashbookService.rejectTransfer(transfer.id);

      if (res?.response?.status === "error") {
        toast.error(res.response.message || "Operation failed");
        return;
      }
      toast.success(`Transfer ${dialogAction}ed successfully`);
      refresh();
    } finally {
      setIsProcessing(false);
      setDialogAction(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
        onClick={() => onView(transfer)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {isPending ? (
        <>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10"
            onClick={() => onEdit(transfer)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10"
            onClick={() => setDialogAction("reject")}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-emerald-500 hover:bg-emerald-500/10"
            onClick={() => setDialogAction("confirm")}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>

          <AppDialog
            open={!!dialogAction}
            onOpenChange={() => setDialogAction(null)}
            title={`${dialogAction === "confirm" ? "Confirm" : "Reject"} Transfer`}
            description={`Are you sure you want to ${dialogAction} transfer ${transfer.reference_no}?`}
          >
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setDialogAction(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={isProcessing}
                className={
                  dialogAction === "reject"
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {dialogAction === "confirm" ? "Confirm Now" : "Reject Now"}
              </Button>
            </div>
          </AppDialog>
        </>
      ) : (
        <div className="flex items-center justify-center w-8 h-8">
          {(isConfirmed || isRejected) && (
            <div
              className={`p-1 rounded-full ${isConfirmed ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
            >
              {isConfirmed ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const getColumns = (
  onView: (data: CashbookTransferItem) => void,
  onEdit: (data: CashbookTransferItem) => void,
  refresh: () => void,
): ColumnDef<CashbookTransferItem>[] => [
  {
    accessorKey: "reference_no",
    header: "Reference No",
    cell: ({ row }) => (
      <span className="text-xs font-mono font-medium">
        {row.original.reference_no || "—"}
      </span>
    ),
  },
  {
    id: "routing",
    header: "Routing",
    cell: ({ row }) => (
      <div className="flex flex-col text-[11px]">
        <span className="font-semibold">
          {row.original.source_cashbook?.name}
        </span>
        <span className="text-muted-foreground">
          → {row.original.destination_cashbook?.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="text-sm font-mono font-bold">
        {row.original.currency?.symbol}
        {Number(row.original.amount || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const styles = {
        confirmed: "bg-emerald-500/10 text-emerald-500",
        rejected: "bg-rose-500/10 text-rose-500",
        pending: "bg-amber-500/10 text-amber-500",
      };
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[status as keyof typeof styles] || styles.pending}`}
        >
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
        transfer={row.original}
        onView={onView}
        onEdit={onEdit}
        refresh={refresh}
      />
    ),
  },
];
