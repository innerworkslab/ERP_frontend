"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StockBalance } from "@/api/stockBalances.service";

export const getColumns = (): ColumnDef<StockBalance>[] => [
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-7 w-7 rounded-lg border border-white/15 bg-muted flex-shrink-0">
          {row.original.product_image ? (
            <AvatarImage
              src={row.original.product_image}
              alt={row.original.product_name}
              className="object-cover h-full w-full"
            />
          ) : null}
          <AvatarFallback className="rounded-lg bg-muted/40">
            <Package className="h-3.5 w-3.5 opacity-40" />
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-sm tracking-tight text-foreground truncate max-w-[220px]">
          {row.original.product_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-muted-foreground">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "inventory_name",
    header: "Warehouse",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-foreground">
        {row.original.inventory_name}
      </span>
    ),
  },
  {
    accessorKey: "stock_uom",
    header: "UOM",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.original.stock_uom}
      </span>
    ),
  },
  {
    accessorKey: "on_hand_quantity",
    header: () => <div className="text-right">On Hand Qty</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm text-foreground">
          {Number(row.original.on_hand_quantity || 0).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "reserved_quantity",
    header: () => <div className="text-right">Reserved Qty</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm text-amber-500/90">
          {Number(row.original.reserved_quantity || 0).toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "available_quantity",
    header: () => <div className="text-right">Available Qty</div>,
    cell: ({ row }) => {
      const qty = Number(row.original.available_quantity || 0);
      const reorder = Number(row.original.reorder_level || 0);
      const isCritical = qty <= reorder;

      return (
        <div className="text-right">
          <span
            className={`font-black text-sm ${isCritical ? "text-rose-400" : "text-emerald-400"}`}
          >
            {qty.toLocaleString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_stock_value",
    header: () => <div className="text-right">Valuation</div>,
    cell: ({ row }) => (
      <div className="text-right font-mono font-bold text-xs text-emerald-400">
        {Number(row.original.total_stock_value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </div>
    ),
  },
];
