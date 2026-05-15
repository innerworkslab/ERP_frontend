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
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/utils/helper.utils";

const ActionCell = ({
  product,
  refresh,
}: {
  product: Product;
  refresh: () => void;
}) => {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await productService.toggle(product.id);
      const newStatus =
        product.status.toLowerCase() === "active" ? "inactive" : "active";
      refresh();
      toast.success(res.response?.message || `Product marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => router.push(`/auth/products/${product.id}`)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => router.push(`/auth/products/${product.id}/edit`)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          product.status.toLowerCase() === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : product.status.toLowerCase() === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (refresh: () => void): ColumnDef<Product>[] => [
  {
    accessorKey: "sku",
    header: () => <div className="text-center">SKU</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold uppercase opacity-60 tracking-widest">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border border-white/10 overflow-hidden">
          <AvatarImage src={row.original.image_url} className="object-cover" />
          <AvatarFallback className="rounded-lg">
            <Package className="h-4 w-4 opacity-40" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-foreground leading-none truncate max-w-[180px]">
            {row.original.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.original.category?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "sale_price",
    header: "Sale Price",
    cell: ({ row }) => (
      <span className="text-sm font-bold text-primary">
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
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      const isActive = status === "active";
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isActive
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionCell product={row.original} refresh={refresh} />,
  },
];
