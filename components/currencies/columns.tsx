"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Star, TrendingUp, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Currency } from "@/api/currencies.service";

export const getColumns = (
  onEdit: (d: Currency) => void,
  onView: (d: Currency) => void,
  onUpdateRate: (d: Currency) => void,
  onShowHistory: (d: Currency) => void,
): ColumnDef<Currency>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-bold text-sm">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span>{row.original.code}</span>,
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => <span className="font-bold">{row.original.symbol}</span>,
  },
  {
    accessorKey: "exchange_rate",
    header: "Rate",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-sm text-primary">
        {Number(row.original.exchange_rate).toFixed(4)}
      </span>
    ),
  },
  {
    accessorKey: "is_base_currency",
    header: "Base",
    cell: ({ row }) =>
      row.original.is_base_currency ? (
        <div className="flex items-center gap-1 text-yellow-500">
          <span className="text-[10px] font-bold uppercase">Base</span>
        </div>
      ) : (
        <span>-</span>
      ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right mr-4 text-[10px] uppercase tracking-widest opacity-50">
        Actions
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
          title="Update Rate"
          onClick={() => onUpdateRate(row.original)}
        >
          <TrendingUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-50"
          title="History"
          onClick={() => onShowHistory(row.original)}
        >
          <History className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50"
          title="View Detail"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-foreground/60 hover:bg-muted"
          title="Edit"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
