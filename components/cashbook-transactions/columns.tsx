"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit2, CheckCircle2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cashbookService, CashbookTransaction } from "@/api/cashbooks.service";
import { useState } from "react";
import { toast } from "sonner";
import { AppDialog } from "@/components/common/AppDialog";

const ActionCell = ({
  transaction,
  onView,
  onEdit,
  refresh,
}: {
  transaction: CashbookTransaction;
  onView: (data: CashbookTransaction) => void;
  onEdit: (data: CashbookTransaction) => void;
  refresh: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isPending = transaction.status === "pending";
  const isConfirmed = ["confirmed", "success", "settled"].includes(
    transaction.status?.toLowerCase() || "",
  );

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await cashbookService.confirmTransaction(transaction.id);
      toast.success("Transaction confirmed successfully");
      setShowConfirmDialog(false);
      refresh();
    } catch (err) {
      toast.error("Failed to confirm transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
        onClick={() => onView(transaction)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {isPending ? (
        <>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10"
            onClick={() => onEdit(transaction)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-emerald-500 hover:bg-emerald-500/10"
            onClick={() => setShowConfirmDialog(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>

          <AppDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            title="Confirm Transaction"
            description={`Are you sure you want to confirm transaction ${transaction.reference_no || `#${transaction.id}`}?`}
          >
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Now
              </Button>
            </div>
          </AppDialog>
        </>
      ) : (
        <div className="flex items-center justify-center w-8 h-8">
          {isConfirmed && (
            <div className="bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const getColumns = (
  onView: (data: CashbookTransaction) => void,
  onEdit: (data: CashbookTransaction) => void,
  refresh: () => void,
): ColumnDef<CashbookTransaction>[] => [
  {
    accessorKey: "reference_no",
    header: "Reference No",
    cell: ({ row }) => (
      <span className="text-xs font-mono font-medium text-foreground">
        {row.original.reference_no || "—"}
      </span>
    ),
  },
  {
    accessorKey: "transaction_type",
    header: "Transaction Type",
    cell: ({ row }) => {
      const type = row.original.transaction_type;
      const isInflow = type === "in";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isInflow
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {type || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-foreground capitalize">
        {row.original.category || "—"}
      </span>
    ),
  },
  {
    id: "cashbook",
    header: "Cashbook Name",
    accessorFn: (row) => row.cashbook?.name,
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.original.cashbook?.name || "—"}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const isInflow = row.original.transaction_type === "in";
      const symbol = row.original.currency?.symbol || "";
      const code = row.original.currency?.code || "";
      const formattedAmount = Number(row.original.amount || 0).toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      );

      return (
        <span
          className={`text-sm font-mono font-bold ${isInflow ? "text-emerald-400" : "text-rose-400"}`}
        >
          {isInflow ? "+" : "-"} {symbol}
          {formattedAmount} {code}
        </span>
      );
    },
  },
  {
    accessorKey: "base_currency_amount",
    header: "Base Currency Amount",
    cell: ({ row }) => {
      if (!row.original.base_currency_amount)
        return (
          <span className="text-xs font-mono text-muted-foreground">—</span>
        );

      const formattedBase = Number(
        row.original.base_currency_amount,
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return (
        <span className="text-xs font-mono text-muted-foreground">
          ${formattedBase} USD
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "settled";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            ["success", "settled", "confirmed"].includes(status.toLowerCase())
              ? "bg-emerald-500/10 text-emerald-400"
              : status === "pending"
                ? "bg-amber-500/10 text-amber-400"
                : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        transaction={row.original}
        onView={onView}
        onEdit={onEdit}
        refresh={refresh}
      />
    ),
  },
];
