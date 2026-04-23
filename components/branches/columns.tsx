"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { branchService, Branch } from "@/api/branches.service";

const ActionCell = ({
  branch,
  onEdit,
  onView,
  refresh,
}: {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onView: (branch: Branch) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await branchService.toggle(branch.id);
      const newStatus = branch.status === "active" ? "inactive" : "active";
      refresh();
      toast.success(res.response?.message || `Branch marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(branch)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(branch)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          branch.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : branch.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (branch: Branch) => void,
  onView: (branch: Branch) => void,
  refresh: () => void,
): ColumnDef<Branch>[] => [
  {
    accessorKey: "prefix",
    header: () => <div className="text-center">Prefix</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold uppercase opacity-60 tracking-widest">
        {row.original.prefix}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Branch Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground leading-none">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-xs">
        <span>{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile Number",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        <span>{row.original.mobile}</span>
      </div>
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
        branch={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
