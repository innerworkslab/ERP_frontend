"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { formatPrice } from "@/utils/helper.utils";
import { cashbookService, Cashbook } from "@/api/cashbooks.service";

const ActionCell = ({
  cashbook,
  onEdit,
  onView,
  refresh,
}: {
  cashbook: Cashbook;
  onEdit: (data: Cashbook) => void;
  onView: (data: Cashbook) => void;
  refresh: () => void;
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await cashbookService.toggle(cashbook.id);
      const newStatus =
        cashbook.status.toLowerCase() === "active" ? "inactive" : "active";
      refresh();
      toast.success(res.response?.message || `Cashbook marked as ${newStatus}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onView(cashbook)}
        disabled={isToggling}
      >
        <Eye />
      </Button>

      <Button
        variant="ghost"
        className="h-8 w-8 p-0 [&_svg]:!h-4 [&_svg]:!w-4"
        onClick={() => onEdit(cashbook)}
        disabled={isToggling}
      >
        <Edit />
      </Button>

      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 [&_svg]:!h-5 [&_svg]:!w-5 ${
          cashbook.status.toLowerCase() === "active"
            ? "text-emerald-500 hover:bg-emerald-500/10"
            : "text-slate-400 hover:bg-slate-500/10"
        }`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="animate-spin !h-4 !w-4" />
        ) : cashbook.status.toLowerCase() === "active" ? (
          <ToggleRight />
        ) : (
          <ToggleLeft />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (data: Cashbook) => void,
  onView: (data: Cashbook) => void,
  refresh: () => void,
): ColumnDef<Cashbook>[] => [
  {
    accessorKey: "account.code",
    header: () => <div className="text-center">Account Code</div>,
    cell: ({ row }) => (
      <span className="flex justify-center text-[10px] font-bold uppercase opacity-60 tracking-widest">
        {row.original.account?.code || "-"}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Account Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-foreground leading-none">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const typeStr = row.original.type.replace("_", " ");
      return (
        <span className="text-xs font-medium text-muted-foreground capitalize">
          {typeStr}
        </span>
      );
    },
  },
  {
    id: "branch",
    header: "Branch",
    accessorFn: (row) => row.branch?.name,
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground">
        {row.original.branch?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "current_balance",
    header: "Current Balance",
    cell: ({ row }) => (
      <span className="text-sm">
        {formatPrice(
          row.original.current_balance,
          row.original.currency?.symbol,
        )}
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
    cell: ({ row }) => (
      <ActionCell
        cashbook={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
