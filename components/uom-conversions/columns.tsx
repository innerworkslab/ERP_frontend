"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UOMConversion,
  uomConversionService,
} from "@/api/uomConversions.service";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({ row, onEdit, onView, refresh }) => {
  const [loading, setLoading] = useState(false);
  const data = row.original;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await uomConversionService.toggleStatus(data.id);
      refresh();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-50"
        onClick={() => onView(data)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-50"
        onClick={() => onEdit(data)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={handleToggle}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : data.status === "active" ? (
          <ToggleRight className="h-5 w-5 text-emerald-500" />
        ) : (
          <ToggleLeft className="h-5 w-5 text-slate-300" />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (d: UOMConversion) => void,
  onView: (d: UOMConversion) => void,
  refresh: () => void,
): ColumnDef<UOMConversion>[] => [
  {
    accessorKey: "base_unit_id",
    header: "Base Unit",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.base_unit?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "conversion_unit_id",
    header: "Conversion Unit",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.conversion_unit?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "conversion_rate",
    header: "Conversion Rate",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm">
          {Number(row.original.conversion_rate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </span>
      </div>
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
    header: () => <div className="text-right mr-4">Actions</div>,
    cell: (props) => (
      <ActionCell
        {...props}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
