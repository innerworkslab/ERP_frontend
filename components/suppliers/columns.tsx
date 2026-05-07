"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supplier, supplierService } from "@/api/suppliers.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ActionCell = ({ supplier }: { supplier: Supplier }) => {
  const router = useRouter();
  const [isToggling] = useState(false);

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 flex items-center justify-center [&_svg]:h-5! [&_svg]:w-5!"
        onClick={() => router.push(`/auth/suppliers/${supplier.id}/edit`)}
        disabled={isToggling}
      >
        <Edit />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Supplier>[] = [
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
    header: "Supplier Name",
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
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("company_name") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("address") || "-"}</span>
    ),
  },
  {
    accessorKey: "credit_limit",
    header: "Credit Limit",
    cell: ({ row }) => (
      <span className="text-sm font-semibold">
        {Number(row.getValue("credit_limit") || 0).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string)?.toLowerCase();
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
    cell: ({ row }) => <ActionCell supplier={row.original} />,
  },
];
