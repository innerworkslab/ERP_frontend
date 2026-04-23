"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DiscountGroup } from "@/api/discountGroups.service";

export const getColumns = (
  onEdit: (d: DiscountGroup) => void,
  onView: (d: DiscountGroup) => void,
  onToggle: (id: number) => void,
): ColumnDef<DiscountGroup>[] => [
  { accessorKey: "name", header: "Group Name" },
  {
    accessorKey: "customer_type",
    header: "Customer Type",
    cell: ({ row }) => row.original.customer_type?.name || "N/A",
  },
  {
    accessorKey: "branch",
    header: "Branch",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.original.branch?.name}</span>
        <span className="text-[10px] text-muted-foreground">
          {row.original.branch?.prefix}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Switch
        checked={row.original.is_active}
        onCheckedChange={() => onToggle(row.original.id)}
      />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right mr-4">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-blue-500"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
