"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { PriceGroup, priceGroupService } from "@/api/priceGroups.service";

const ActionCell = ({
  priceGroup,
  onEdit,
  onView,
  refresh,
}: {
  priceGroup: PriceGroup;
  onEdit: (data: PriceGroup) => void;
  onView: (data: PriceGroup) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      await priceGroupService.toggle(priceGroup.id);
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
        onClick={() => onView(priceGroup)}
        disabled={isToggling}
      >
        <Eye />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(priceGroup)}
        disabled={isToggling}
      >
        <Edit />
      </Button>
      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          priceGroup.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : priceGroup.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (data: PriceGroup) => void,
  onView: (data: PriceGroup) => void,
  refresh: () => void,
): ColumnDef<PriceGroup>[] => [
  {
    accessorKey: "name",
    header: "Group Name",
    cell: ({ row }) => <span className="font-bold">{row.original.name}</span>,
  },
  {
    accessorKey: "customer_type.name",
    header: "Customer Type",
    cell: ({ row }) => <span>{row.original.customer_type?.name || "-"}</span>,
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
    cell: ({ row }) => <span>{row.original.branch?.name || "-"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.status === "active";
      return (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            active
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-slate-500/10 text-slate-400 border-slate-500/20"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        priceGroup={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
