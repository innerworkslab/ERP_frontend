"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helper.utils";
import { StockLedger } from "@/api/stockLedgers.service";

// const ActionCell = ({
//   ledger,
//   onView,
// }: {
//   ledger: StockLedger;
//   onView: (l: StockLedger) => void;
// }) => {
//   return (
//     <div className="flex items-center justify-center">
//       <Button variant="ghost" size="icon" onClick={() => onView(ledger)}>
//         <Eye className="h-4 w-4 text-muted-foreground" />
//       </Button>
//     </div>
//   );
// };

export const getColumns = (
  onView: (ledger: StockLedger) => void,
): ColumnDef<StockLedger>[] => [
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-[10px] font-medium">
        {formatDate(row.original.transaction_date)}
      </span>
    ),
  },
  {
    accessorKey: "voucher_no",
    header: "Voucher No",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-xs text-primary">
          {row.original.voucher_no}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm leading-tight">
          {row.original.product_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "movement_type",
    header: "Movement",
    cell: ({ row }) => {
      const isIn = row.original.movement_type === "in";
      return (
        <div
          className={cn(
            "flex items-center gap-1.5 font-black text-[10px] uppercase",
            isIn ? "text-emerald-500" : "text-destructive",
          )}
        >
          {row.original.quantity} {row.original.UOM}
        </div>
      );
    },
  },
  {
    accessorKey: "inventory_name",
    header: "Warehouse",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold">
          {row.original.inventory_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "balance_quantity_after",
    header: "Stock Balance",
    cell: ({ row }) => (
      <div className="flex flex-col items-end px-4">
        <span className="font-black text-sm">
          {row.original.balance_quantity_after}
        </span>
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   header: () => <div className="text-center">View</div>,
  //   cell: ({ row }) => <ActionCell ledger={row.original} onView={onView} />,
  // },
];
