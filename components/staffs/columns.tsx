"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MapPin, Loader2, ToggleRight, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Staff, staffService } from "@/api/staffs.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ActionCell = ({ staff }: { staff: Staff }) => {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await staffService.toggle(staff.id);

      const newStatus = staff.status === "active" ? "inactive" : "active";
      toast.success(res.response?.message || `Staff marked as ${newStatus}`);
      router.refresh();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 flex items-center justify-center [&_svg]:h-5! [&_svg]:w-5!"
        onClick={() => router.push(`/auth/staffs/${staff.id}/edit`)}
        disabled={isToggling}
      >
        <Edit />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        variant="ghost"
        aria-disabled
        className={`h-8 w-8 p-0 flex items-center justify-center [&_svg]:h-5! [&_svg]:w-5! ${
          staff.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin" />
        ) : staff.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
        <span className="sr-only">Toggle Status</span>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-xs uppercase opacity-70">
        {row.getValue("id") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Staff Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("phone_number") || "-"}
      </span>
    ),
  },
  {
    id: "role",
    header: "Role",
    accessorFn: (row) => row.role?.name,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.role?.name || "-"}
      </span>
    ),
  },
  {
    id: "department",
    header: "Department",
    accessorFn: (row) => row.department?.name,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.department?.name || "-"}</span>
    ),
  },
  {
    id: "branch",
    header: "Branch",
    accessorFn: (row) => row.branch?.name,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.branch?.name || "-"}
      </span>
    ),
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) => row.branch?.location,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-sm truncate max-w-37.5">
          {row.original.branch?.location || "-"}
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
    cell: ({ row }) => <ActionCell staff={row.original} />,
  },
];
