"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Variation, variationService } from "@/api/variations.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ActionCell = ({
  variation,
  onEdit,
  onView,
  refresh,
}: {
  variation: Variation;
  onEdit: (data: Variation) => void;
  onView: (data: Variation) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const isActive = variation.status === "active";

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      await variationService.toggleStatus(variation.id);
      refresh();
      toast.success("Status updated successfully");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(variation)}
        disabled={isToggling}
      >
        <Eye />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(variation)}
        disabled={isToggling}
      >
        <Edit />
      </Button>
      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          isActive
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : isActive ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (data: Variation) => void,
  onView: (data: Variation) => void,
  refresh: () => void,
): ColumnDef<Variation>[] => [
  {
    accessorKey: "name",
    header: "Variation Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "value_data_type",
    header: "Data Type",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.value_data_type}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <Badge
          variant="outline"
          className={`capitalize font-bold text-[9px] px-2 py-0 h-5 ${
            isActive
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
          }`}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        variation={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
