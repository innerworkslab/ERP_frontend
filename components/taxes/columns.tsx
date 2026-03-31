"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { taxService, Tax } from "@/api/taxes.service";

const ActionCell = ({ tax, onEdit, onView, refresh }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      const res = await taxService.toggle(tax.id);
      refresh();
      toast.success(res.response?.message || "Status updated");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
        onClick={() => onView(tax)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => onEdit(tax)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className={`h-8 w-8 p-0 ${tax.status === "active" ? "text-emerald-500" : "text-slate-400"}`}
        onClick={handleToggleStatus}
        disabled={isToggling}
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : tax.status === "active" ? (
          <ToggleRight className="h-5 w-5" />
        ) : (
          <ToggleLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export const getColumns = (
  onEdit: (tax: Tax) => void,
  onView: (tax: Tax) => void,
  refresh: () => void,
): ColumnDef<Tax>[] => [
  {
    accessorKey: "code",
    header: () => <div className="text-center">Tax Code</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-[10px] font-bold opacity-60">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.category}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="uppercase text-[10px] font-medium tracking-widest bg-muted px-2 py-0.5 rounded">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-primary">
        {row.original.amount}%
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${row.original.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        tax={row.original}
        onEdit={onEdit}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
