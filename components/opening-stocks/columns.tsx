"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, Eye, CheckCircle2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { openingStockService, OpeningStock } from "@/api/openingStocks.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AppDialog } from "@/components/common/AppDialog";

const ActionCell = ({ stock, onEdit, onView, refresh }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isConfirmed = stock.status === "confirmed";

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await openingStockService.confirm(stock.id);
      refresh();
      toast.success("Stock confirmed successfully");
      setShowConfirmDialog(false);
    } catch (err) {
      toast.error("Failed to confirm stock");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* View is always visible */}
      <Button variant="ghost" size="icon" onClick={() => onView(stock)}>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>

      {!isConfirmed ? (
        <>
          {/* Edit only shows if pending */}
          <Button variant="ghost" size="icon" onClick={() => onEdit(stock)}>
            <Edit className="h-4 w-4 text-primary" />
          </Button>

          {/* Confirm Action */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-emerald-500 transition-colors" />
            )}
          </Button>

          {/* UI Confirmation Box */}
          <AppDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
            title="Confirm Opening Stock"
            description={`Are you sure you want to confirm voucher ${stock.voucher_no}? This will lock the record and update inventory levels.`}
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
                disabled={isConfirming}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isConfirming && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Now
              </Button>
            </div>
          </AppDialog>
        </>
      ) : (
        /* If confirmed, show a simple non-button indicator */
        <div className="flex items-center justify-center w-10 h-10">
          <div className="bg-emerald-500/10 p-1.5 rounded-full">
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export const getColumns = (
  onEdit: (stock: OpeningStock) => void,
  onView: (stock: OpeningStock) => void,
  refresh: () => void,
): ColumnDef<OpeningStock>[] => [
  {
    accessorKey: "voucher_no",
    header: "Voucher No",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm">{row.original.voucher_no}</span>
      </div>
    ),
  },
  {
    accessorKey: "inventory",
    header: "Warehouse",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-medium">
        {row.original.inventory?.name}
      </Badge>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = Number(row.original.total_amount).toLocaleString();
      return <span className="font-black text-primary">{amount}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
            status === "confirmed"
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "voucher_date",
    header: "Voucher date",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {row.original.voucher_date}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        stock={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
