"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockBalance } from "@/api/stockBalances.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const getColumns = (
  onView: (balance: StockBalance) => void,
): ColumnDef<StockBalance>[] => [
  {
    accessorKey: "product_image",
    header: "Image",
    size: 60,
    cell: ({ row }) => (
      <Avatar className="h-9 w-9 rounded-xl border">
        <AvatarImage
          src={row.original.product_image}
          className="object-cover"
        />
        <AvatarFallback>
          <Package className="h-4 w-4 opacity-40" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  { accessorKey: "product_name", header: "Product Name", size: 200 },
  { accessorKey: "sku", header: "SKU", size: 120 },
  {
    accessorKey: "barcode",
    header: "Barcode",
    size: 150,
    cell: ({ row }) => row.original.barcode || "-",
  },
  { accessorKey: "category_name", header: "Category", size: 140 },
  { accessorKey: "brand_name", header: "Brand", size: 140 },
  { accessorKey: "branch_names", header: "Branch", size: 160 },
  { accessorKey: "inventory_name", header: "Warehouse", size: 180 },
  { accessorKey: "stock_uom", header: "UOM", size: 100 },
  {
    accessorKey: "on_hand_quantity",
    header: "On Hand",
    size: 110,
    cell: ({ row }) => (
      <span className="font-bold text-sm">{row.original.on_hand_quantity}</span>
    ),
  },
  { accessorKey: "reserved_quantity", header: "Reserved", size: 110 },
  {
    accessorKey: "available_quantity",
    header: "Available",
    size: 110,
    cell: ({ row }) => (
      <span className="font-bold text-sm text-emerald-500">
        {row.original.available_quantity}
      </span>
    ),
  },
  { accessorKey: "reorder_level", header: "Alert Qty", size: 110 },
  {
    accessorKey: "unit_cost",
    header: "Unit Cost",
    size: 130,
    cell: ({ row }) => Number(row.original.unit_cost).toLocaleString(),
  },
  {
    accessorKey: "total_stock_value",
    header: "Total Value",
    size: 150,
    cell: ({ row }) => (
      <span className="font-black text-sm">
        {Number(row.original.total_stock_value).toLocaleString()}
      </span>
    ),
  },
  { accessorKey: "base_currency_value", header: "Base Value", size: 130 },
  {
    accessorKey: "lot_no",
    header: "Lot No",
    size: 160,
    cell: ({ row }) => row.original.lot_no || "-",
  },
  {
    accessorKey: "serial_no",
    header: "Serial No",
    size: 160,
    cell: ({ row }) => row.original.serial_no || "-",
  },
  {
    accessorKey: "expired_date",
    header: "Expiry Date",
    size: 130,
    cell: ({ row }) => row.original.expired_date || "-",
  },
  { accessorKey: "last_movement_date", header: "Last Movement", size: 140 },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] uppercase font-bold",
          row.original.status === "active"
            ? "border-emerald-500/50 text-emerald-500"
            : "",
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "expiry_remark",
    header: "Expiry Remark",
    size: 200,
    cell: ({ row }) => row.original.expiry_remark || "-",
  },
];
