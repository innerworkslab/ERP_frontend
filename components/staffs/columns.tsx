"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { staffService, Staff } from "@/api/staffs.service";
import { useRouter } from "next/navigation";

const ActionCell = ({
  staff,
  refresh,
}: {
  staff: Staff;
  refresh: () => void;
}) => {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await staffService.toggle(staff.id);
      const newStatus =
        staff.status.toLowerCase() === "active" ? "inactive" : "active";
      refresh();
      toast.success(res.response?.message || `Staff marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => router.push(`/auth/staffs/${staff.id}`)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => router.push(`/auth/staffs/${staff.id}/edit`)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          staff.status.toLowerCase() === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : staff.status.toLowerCase() === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (refresh: () => void): ColumnDef<Staff>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold uppercase opacity-60 tracking-widest">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Staff Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground leading-none">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-xs">
        <span>{row.original.phone_number || "-"}</span>
      </div>
    ),
  },
  {
    id: "role",
    header: "Role",
    accessorFn: (row) => row.role?.name,
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        <span>{row.original.role?.name || "-"}</span>
      </div>
    ),
  },
  {
    id: "department",
    header: "Department",
    accessorFn: (row) => row.department?.name,
    cell: ({ row }) => (
      <span className="text-xs">{row.original.department?.name || "-"}</span>
    ),
  },
  {
    id: "branch",
    header: "Branch",
    accessorFn: (row) => row.branch?.name,
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
      const status = row.original.status.toLowerCase();
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
    cell: ({ row }) => <ActionCell staff={row.original} refresh={refresh} />,
  },
];
