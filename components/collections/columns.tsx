"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { collectionsService, Collection } from "@/api/collections.service";
import { cn } from "@/lib/utils";

const ActionCell = ({
  collection,
  onEdit,
  onView,
  onAddProducts,
  refresh,
}: {
  collection: Collection;
  onEdit: (c: Collection) => void;
  onView: (c: Collection) => void;
  onAddProducts: (c: Collection) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await collectionsService.toggle(collection.id);
      refresh();
      toast.success("Collection status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* View Details */}
      <Button variant="ghost" size="icon" onClick={() => onView(collection)}>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>

      {/* Add Products to Collection */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddProducts(collection)}
        title="Add Products"
      >
        <PackagePlus className="h-4 w-4 text-orange-500" />
      </Button>

      {/* Edit Collection Meta */}
      <Button variant="ghost" size="icon" onClick={() => onEdit(collection)}>
        <Edit className="h-4 w-4 text-primary" />
      </Button>

      {/* Status Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : collection.status === "active" ? (
          <ToggleRight className="h-5 w-5 text-emerald-500" />
        ) : (
          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (col: Collection) => void,
  onView: (col: Collection) => void,
  onAddProducts: (col: Collection) => void,
  refresh: () => void,
): ColumnDef<Collection>[] => [
  {
    accessorKey: "name",
    header: "Collection",
    cell: ({ row }) => (
      <span className="text-sm font-semibold">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "purchase_price",
    header: "Purchase Price",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.purchase_currency?.symbol} {row.original.purchase_price}
      </span>
    ),
  },
  {
    accessorKey: "sale_price",
    header: "Sale Price",
    cell: ({ row }) => (
      <span className="text-xs text-primary font-bold">
        {row.original.sale_currency?.symbol} {row.original.sale_price}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "active";
      return (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            isActive
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-slate-500/10 text-slate-400 border-slate-500/20",
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        collection={row.original}
        onEdit={onEdit}
        onView={onView}
        onAddProducts={onAddProducts}
        refresh={refresh}
      />
    ),
  },
];
