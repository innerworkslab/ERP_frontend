"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MapPin, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Branch, branchService } from "@/api/branches.service";
import { toast } from "sonner";
import { useState } from "react";

const ActionCell = ({ branch }: { branch: Branch }) => {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await branchService.toggle(branch.id);

      const newStatus = branch.status === "active" ? "inactive" : "active";
      toast.success(res.response?.message || `Branch marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 flex items-center justify-center [&_svg]:!h-5 [&_svg]:!w-5"
        onClick={() => router.push(`/auth/branches/${branch.id}/edit`)}
        disabled={isToggling}
      >
        <Edit />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        variant="ghost"
        aria-disabled
        className={`h-8 w-8 p-0 flex items-center justify-center [&_svg]:!h-5 [&_svg]:!w-5 ${
          branch.status === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin" />
        ) : branch.status === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
        <span className="sr-only">Toggle Status</span>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "prefix",
    header: () => <div className="text-center">Prefix</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-xs uppercase opacity-70">
        {row.getValue("prefix")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Branch Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-sm truncate max-w-[150px]">
          {row.getValue("location")}
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
    id: "created_by",
    header: "Created By",
    accessorFn: (row) => row.created_by.name,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {row.original.created_by.name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {row.original.created_by.email}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionCell branch={row.original} />,
  },
];
