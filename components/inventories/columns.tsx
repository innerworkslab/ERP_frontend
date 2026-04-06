"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { inventoryService, Inventory } from "@/api/inventories.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ActionCell = ({ inventory, onEdit, onView, refresh }) => {
  const [isToggling, setIsToggling] = useState(false);

  const isActive = inventory.branches?.some(
    (b) => b.pivot?.status === "active",
  );

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await inventoryService.toggle(inventory.id);
      refresh();
      toast.success("Inventory status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onView(inventory)}>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => onEdit(inventory)}>
        <Edit className="h-4 w-4 text-primary" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isActive ? (
          <ToggleRight className="h-5 w-5 text-emerald-500" />
        ) : (
          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (inv: Inventory) => void,
  onView: (inv: Inventory) => void,
  refresh: () => void,
): ColumnDef<Inventory>[] => [
  {
    accessorKey: "name",
    header: "Inventory",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="font-semibold">{row.original.name}</span>
      </div>
    ),
  },

  {
    accessorKey: "branches",
    header: "Branches",
    cell: ({ row }) => {
      const branches = row.original.branches || [];

      if (branches.length === 0) {
        return (
          <span className="text-xs text-muted-foreground">No branches</span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {branches.slice(0, 2).map((b) => (
            <Badge
              key={b.id}
              variant="secondary"
              className={cn(
                "text-[10px] px-2 py-0 truncate max-w-[120px]",
                b.pivot?.status === "inactive" && "opacity-50 grayscale",
              )}
            >
              {b.name}
            </Badge>
          ))}

          {branches.length > 2 && (
            <Badge variant="outline" className="text-[10px]">
              +{branches.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <span className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        inventory={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
