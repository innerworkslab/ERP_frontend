"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit2,
  CheckCircle2,
  Check,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppDialog } from "@/components/common/AppDialog";
import { cashbookService, CashbookAdjustment } from "@/api/cashbooks.service";
import { toast } from "sonner";

const ActionCell = ({
  adjustment,
  onView,
  onEdit,
  refresh,
}: {
  adjustment: CashbookAdjustment;
  onView: (data: CashbookAdjustment) => void;
  onEdit: (data: CashbookAdjustment) => void;
  refresh: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const handleAction = async () => {
    if (!actionType) return;
    try {
      setIsProcessing(true);
      actionType === "approve"
        ? await cashbookService.confirmAdjustment(adjustment.id)
        : await cashbookService.rejectAdjustment(adjustment.id);
      toast.success(`Adjustment ${actionType}d successfully`);
      setShowConfirm(false);
      refresh();
    } catch {
      toast.error(`Failed to ${actionType} adjustment`);
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500"
        onClick={() => onView(adjustment)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {adjustment.status === "pending" ? (
        <>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-amber-500"
            onClick={() => onEdit(adjustment)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-emerald-500"
            onClick={() => {
              setActionType("approve");
              setShowConfirm(true);
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-rose-500"
            onClick={() => {
              setActionType("reject");
              setShowConfirm(true);
            }}
          >
            <XCircle className="h-4 w-4" />
          </Button>

          <AppDialog
            open={showConfirm}
            onOpenChange={setShowConfirm}
            title={`${actionType === "approve" ? "Approve" : "Reject"} Adjustment`}
            description={`Are you sure you want to ${actionType} ${adjustment.reference_no}?`}
          >
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={isProcessing}
                className={
                  actionType === "reject"
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm {actionType}
              </Button>
            </div>
          </AppDialog>
        </>
      ) : (
        <div className="w-8 h-8 flex items-center justify-center">
          {adjustment.status === "approved" && (
            <Check className="h-4 w-4 text-emerald-500" />
          )}
          {adjustment.status === "rejected" && (
            <X className="h-4 w-4 text-rose-500" />
          )}
        </div>
      )}
    </div>
  );
};

export const getColumns = (
  onView: (data: CashbookAdjustment) => void,
  onEdit: (data: CashbookAdjustment) => void,
  refresh: () => void,
): ColumnDef<CashbookAdjustment>[] => [
  {
    accessorKey: "reference_no",
    header: "Ref No",
    cell: ({ row }) => (
      <span className="text-xs font-mono">{row.original.reference_no}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.original.type === "increase" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
      >
        {row.original.type}
      </span>
    ),
  },
  { accessorKey: "cashbook.name", header: "Cashbook" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold">
        {Number(row.original.amount).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-[10px] uppercase ${row.original.status === "approved" ? "text-emerald-500" : row.original.status === "pending" ? "text-amber-500" : "text-rose-500"}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        adjustment={row.original}
        onView={onView}
        onEdit={onEdit}
        refresh={refresh}
      />
    ),
  },
];
