"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UOM, uomService } from "@/api/uom.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ActionCell = ({
  uom,
  onEdit,
  onView,
  refresh,
}: {
  uom: UOM;
  onEdit: (d: UOM) => void;
  onView: (d: UOM) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const isActive = uom.status === "active";

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await uomService.toggleStatus(uom.id);
      refresh();
      toast.success("Status updated");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(uom)}
        disabled={isToggling}
      >
        <Eye />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(uom)}
        disabled={isToggling}
      >
        <Edit />
      </Button>
      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${isActive ? "text-emerald-500" : "text-slate-400"}`}
        onClick={handleToggle}
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
  onEdit: (d: UOM) => void,
  onView: (d: UOM) => void,
  refresh: () => void,
): ColumnDef<UOM>[] => [
  {
    accessorKey: "name",
    header: "UOM Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.code}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`capitalize font-bold text-[9px] h-5 ${row.original.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        uom={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
