"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  purchaseReturnService,
  PurchaseReturnSummary,
} from "@/api/purchaseReturn.service";

export const getColumns = (
  onView: (row: PurchaseReturnSummary) => void,
  onEdit: (row: PurchaseReturnSummary) => void,
  onRefresh: () => void,
): ColumnDef<PurchaseReturnSummary>[] => [
  {
    accessorKey: "return_no",
    header: "Return No",
    cell: ({ row }) => (
      <span className="font-mono font-bold">{row.original.return_no}</span>
    ),
  },
  {
    accessorKey: "return_date",
    header: "Date",
  },
  {
    accessorKey: "grn_no",
    header: "GRN Ref",
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground">
        {row.original.grn_no}
      </span>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "return_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.return_type.replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Total Value",
    cell: ({ row }) => {
      const amt = parseFloat(row.original.total_amount) || 0;
      return (
        <span className="font-mono font-bold">
          {amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      };
      return (
        <Badge className={`capitalize border ${variants[status] || ""}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const record = row.original;
      const isPending = record.status === "pending";

      const handleApprove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
          await purchaseReturnService.approve(record.id);
          toast.success("Document voucher approved successfully.");
          onRefresh();
        } catch {
          toast.error("Failed to approve transaction.");
        }
      };

      const handleReject = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
          await purchaseReturnService.reject(record.id);
          toast.success("Document voucher rejected.");
          onRefresh();
        } catch {
          toast.error("Failed to execute rejection command.");
        }
      };

      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(record)}
            className="h-8 w-8 rounded-lg"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isPending && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(record)}
                className="h-8 w-8 rounded-lg"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleApprove}
                className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReject}
                className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/10"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
