"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockBalance } from "@/api/stockBalances.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Eye, Package2, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// const ActionCell = ({
//   balance,
//   onView,
// }: {
//   balance: StockBalance;
//   onView: (b: StockBalance) => void;
// }) => {
//   return (
//     <div className="flex items-center justify-center">
//       <Button variant="ghost" size="icon" onClick={() => onView(balance)}>
//         <Eye className="h-4 w-4 text-muted-foreground" />
//       </Button>
//     </div>
//   );
// };

export const getColumns = (
  onView: (balance: StockBalance) => void,
): ColumnDef<StockBalance>[] => [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/5 bg-muted/20">
          <Avatar className="h-9 w-9 rounded-lg border">
            <AvatarImage
              src={row.original.product_image}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">
              <Package className="h-4 w-4 opacity-40" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xs leading-tight">
            {row.original.product_name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "inventory_name",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[11px] font-bold">
          {row.original.inventory_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "on_hand_quantity",
    header: "Stock Level",
    cell: ({ row }) => {
      const isLow =
        Number(row.original.on_hand_quantity) <=
        Number(row.original.reorder_level);
      return (
        <div className="flex flex-col">
          <div
            className={cn(
              "flex items-center gap-1 font-black text-xs",
              isLow ? "text-orange-500" : "text-primary",
            )}
          >
            {row.original.on_hand_quantity} {row.original.stock_uom}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "batch_serial",
    header: "Batch/Serial",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.lot_no && (
          <span className="text-[10px] font-mono text-muted-foreground">
            Lot: {row.original.lot_no}
          </span>
        )}
        {row.original.serial_no && (
          <span className="text-[10px] font-mono text-muted-foreground">
            Serial: {row.original.serial_no}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "expired_date",
    header: "Expiry",
    cell: ({ row }) => (
      <span className="text-[10px] font-mono text-muted-foreground">
        {row.original.expired_date || "-"}
      </span>
    ),
  },
  {
    accessorKey: "total_stock_value",
    header: () => <div className="text-right">Valuation</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-black text-xs">
          {Number(row.original.total_stock_value).toLocaleString()}
        </span>
      </div>
    ),
  },
  //   {
  //     id: "actions",
  //     header: () => <div className="text-center">Action</div>,
  //     cell: ({ row }) => <ActionCell balance={row.original} onView={onView} />,
  //   },
];
