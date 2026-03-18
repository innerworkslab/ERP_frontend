"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Branch = {
  id: number;
  prefix: string;
  name: string;
  location: string;
  status: string;
  created_by: {
    name: string;
    email: string;
  };
  created_at: string;
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
    cell: ({ row }) => {
      const branchId = row.original.id;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={() => console.log("Edit branch:", branchId)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => console.log("Delete branch:", branchId)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];
