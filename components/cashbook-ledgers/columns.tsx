"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LedgerTransaction } from "@/api/cashbooks.service";

export const getColumns = (
  onView: (item: LedgerTransaction) => void,
): ColumnDef<LedgerTransaction>[] => [
  {
    accessorKey: "transaction_datetime",
    header: "Date & Time",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-foreground whitespace-nowrap">
        {row.original.transaction_datetime}
      </span>
    ),
  },
  {
    accessorKey: "cashbook_transaction.reference_no",
    header: "Reference No",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-primary">
        {row.original.cashbook_transaction?.reference_no || "—"}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Transaction Details",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[280px]">
        <span className="text-xs font-semibold text-foreground truncate">
          {row.original.remark}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Transaction Amount</div>,
    cell: ({ row }) => {
      const isOutflow = row.original.transaction_type === "out";
      const amount = Number(row.original.amount || 0);

      return (
        <div
          className={cn(
            "text-right font-mono font-bold text-xs",
            isOutflow ? "text-rose-500" : "text-emerald-500",
          )}
        >
          {isOutflow ? "-" : "+"}
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Running Balance</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-bold text-xs text-foreground">
        {Number(row.original.balance || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    accessorKey: "cashbook_transaction.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.cashbook_transaction?.status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-transparent whitespace-nowrap",
            status === "confirmed" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            status === "pending" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
          )}
        >
          {status || "unknown"}
        </Badge>
      );
    },
  },
];
