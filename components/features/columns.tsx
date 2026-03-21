"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Settings2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feature, featureService } from "@/api/features.service";
import { useState } from "react";
import { toast } from "sonner";

const ActionCell = ({
  feature,
  onAssign,
  onView,
  refresh,
}: {
  feature: Feature;
  onAssign: (feature: Feature) => void;
  onView: (feature: Feature) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const isActive = feature.status === "active";

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await featureService.toggle(feature.id);
      refresh();
      toast.success(res.response?.message || `Status updated successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(feature)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onAssign(feature)}
        disabled={isToggling}
      >
        <Settings2 />
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
  onAssign: (feature: Feature) => void,
  onView: (feature: Feature) => void,
  refresh: () => void,
): ColumnDef<Feature>[] => [
  {
    accessorKey: "name",
    header: "Feature Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.module}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground truncate max-w-[150px] block">
        {row.original.description || "—"}
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
    cell: ({ row }) => (
      <ActionCell
        feature={row.original}
        onAssign={onAssign}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
