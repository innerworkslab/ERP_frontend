"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StockLedger } from "@/api/stockBalances.service";

export const getColumns = (
  onView: (item: StockLedger) => void,
): ColumnDef<StockLedger>[] => [
  {
    accessorKey: "product_name",
    header: "Product Detail",
    cell: ({ row }) => {
      const img = row.original.product_image;
      return (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/15 bg-muted flex-shrink-0">
            {img ? (
              <Image
                src={img}
                alt={row.original.product_name}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted/40" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight">
              {row.original.product_name}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
              SKU: {row.original.sku}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "inventory_name",
    header: "Warehouse Location",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">
          {row.original.inventory_name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {row.original.branch_names}
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
        <div className="text-right flex flex-col items-end">
          <span
            className={`font-black text-sm ${isCritical ? "text-amber-400" : "text-foreground"}`}
          >
            {qty.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.original.stock_uom}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "on_hand_quantity",
    header: () => <div className="text-right">Physical On Hand</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-xs text-muted-foreground">
          {Number(row.original.on_hand_quantity || 0).toLocaleString()}
        </span>
      </div>
    ),
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
  {
    id: "actions",
    header: () => <div className="text-center">View</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
