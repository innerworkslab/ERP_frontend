"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Department, departmentService } from "@/api/departments.service";

const ActionCell = ({
  department,
  onEdit,
  onView,
  refresh,
}: {
  department: Department;
  onEdit: (department: Department) => void;
  onView: (department: Department) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await departmentService.toggle(department.id);
      const newStatus = department.status === "active" ? "inactive" : "active";

      refresh();

      toast.success(
        res.response?.message || `Department marked as ${newStatus}`,
      );
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(department)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(department)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          department.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : department.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (department: Department) => void,
  onView: (department: Department) => void,
  refresh: () => void,
): ColumnDef<Department>[] => [
  {
    accessorKey: "code",
    header: () => <div className="text-center">Code</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold uppercase opacity-60 tracking-widest">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Department Name",
    cell: ({ row }) => (
      <span className="font-bold text-foreground">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-xs truncate">
          {row.original.branch?.name || "-"}
        </span>
      </div>
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
        department={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
