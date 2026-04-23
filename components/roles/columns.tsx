"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Role, rolesService } from "@/api/roles.service";

const ActionCell = ({
  role,
  onEdit,
  onView,
  refresh,
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onView: (role: Role) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await rolesService.toggle(role.id);
      const newStatus = role.status === "active" ? "inactive" : "active";

      refresh();

      toast.success(res.response?.message || `Role marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(role)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(role)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          role.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : role.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (role: Role) => void,
  onView: (role: Role) => void,
  refresh: () => void,
): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => (
      <span className="font-bold text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "parent.name",
    header: "Parent Name",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.parent_role?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "department.name",
    header: "Dept. Name",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.department?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "branch.name",
    header: "Branch Name",
    cell: ({ row }) => (
      <span className="text-xs font-medium">
        {row.original.branch?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
        role={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
