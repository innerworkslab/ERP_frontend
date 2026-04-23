"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { productService, Product } from "@/api/products.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/utils/helper.utils";

const ActionCell = ({ product, onEdit, onView, refresh }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await productService.toggle(product.id);
      refresh();
      toast.success(res.response?.message || "Status updated");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
        onClick={() => onView(product)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => onEdit(product)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 ${product.status === "active" ? "text-emerald-500" : "text-slate-400"}`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : product.status === "active" ? (
          <ToggleRight className="h-5 w-5" />
        ) : (
          <ToggleLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (product: Product) => void,
  onView: (product: Product) => void,
  refresh: () => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "sku",
    header: () => <div className="text-center">SKU</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold opacity-60 uppercase">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border">
          <AvatarImage src={row.original.image_url} className="object-cover" />
          <AvatarFallback className="rounded-lg">
            <Package className="h-4 w-4 opacity-40" />
          </AvatarFallback>
        </Avatar>
        <span className="font-bold truncate max-w-[200px]">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.original.category?.name || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "sale_price",
    header: "Sale Price",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-primary">
        {formatPrice(
          row.original.sale_price,
          row.original.sale_currency?.symbol,
        )}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
          row.original.status === "active"
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        product={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
