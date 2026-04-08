"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Loader2,
  Eye,
  CheckCircle2,
  Check,
  XCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import {
  stockTransferService,
  StockTransfer,
} from "@/api/stockTransfers.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AppDialog } from "@/components/common/AppDialog";
import { formatDate } from "@/utils/helper.utils";

const ActionCell = ({ transfer, onEdit, onView, refresh }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const isPending = transfer.status === "pending";
  const isConfirmed = transfer.status === "confirmed";
  const isRejected = transfer.status === "rejected";

  const handleAction = async (type: "confirm" | "reject") => {
    try {
      setIsProcessing(true);
      if (type === "confirm") {
        await stockTransferService.confirm(transfer.id);
        toast.success("Transfer confirmed successfully");
        setShowConfirmDialog(false);
      } else {
        await stockTransferService.reject(transfer.id);
        toast.success("Transfer rejected");
        setShowRejectDialog(false);
      }
      refresh();
    } catch (err) {
      toast.error(`Failed to ${type} transfer`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* View is always visible */}
      <Button variant="ghost" size="icon" onClick={() => onView(transfer)}>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>

      {isPending ? (
        <>
          {/* Edit only shows if pending */}
          <Button variant="ghost" size="icon" onClick={() => onEdit(transfer)}>
            <Edit className="h-4 w-4 text-primary" />
          </Button>

          {/* Confirm Action */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isProcessing}
          >
            <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-emerald-500 transition-colors" />
          </Button>

          {/* Reject Action */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRejectDialog(true)}
            disabled={isProcessing}
          >
            <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
          </Button>

          {/* Confirmation Dialog */}
          <AppDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            title="Confirm Stock Transfer"
            description={`Are you sure you want to confirm transfer ${transfer.reference_id}? This will move stock from ${transfer.source_inventory?.name} to ${transfer.target_inventory?.name}.`}
          >
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleAction("confirm")}
                disabled={isProcessing}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Transfer
              </Button>
            </div>
          </AppDialog>

          {/* Rejection Dialog */}
          <AppDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            title="Reject Stock Transfer"
            description={`Are you sure you want to reject transfer ${transfer.reference_id}?`}
          >
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleAction("reject")}
                disabled={isProcessing}
                variant="destructive"
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reject Now
              </Button>
            </div>
          </AppDialog>
        </>
      ) : (
        /* Finalized Status Indicators */
        <div className="flex items-center justify-center w-10 h-10">
          {isConfirmed ? (
            <div className="bg-emerald-500/10 p-1.5 rounded-full">
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          ) : (
            <div className="bg-destructive/10 p-1.5 rounded-full">
              <X className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const getColumns = (
  onEdit: (transfer: StockTransfer) => void,
  onView: (transfer: StockTransfer) => void,
  refresh: () => void,
): ColumnDef<StockTransfer>[] => [
  {
    accessorKey: "reference_id",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-bold text-sm text-primary">
        {row.original.reference_id}
      </span>
    ),
  },
  {
    accessorKey: "transfer_date",
    header: "transfer_date",
    cell: ({ row }) => (
      <span className="text-[10px]">
        {formatDate(row.original.transfer_date)}
      </span>
    ),
  },
  {
    accessorKey: "transfer_from",
    header: "Transfer From",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-muted-foreground">
          {row.original.source_inventory?.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "transfer_to",
    header: "Transfer To",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-muted-foreground">
          {row.original.target_inventory?.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "product_count",
    header: "Items",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-black text-[10px]">
        {row.original.product_count}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full",
            status === "confirmed" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            status === "pending" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
            status === "rejected" &&
              "bg-destructive/10 text-destructive border-destructive/20",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        transfer={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
