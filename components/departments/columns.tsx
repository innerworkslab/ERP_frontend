"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Department = {
  id: number;
  code: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  branch: {
    id: number;
    prefix: string;
    name: string;
    location: string;
  };
};

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "code",
    header: () => <div className="text-center">Code</div>,
    cell: ({ row }) => (
      <span className="flex justify-center font-mono text-xs uppercase opacity-70">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Department Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    id: "branch",
    header: "Branch",
    accessorFn: (row) => row.branch?.name,
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.branch?.name}</span>
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
          {row.original.branch?.location}
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
    cell: ({ row }) => {
      const DepartmentId = row.original.id;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={() => console.log("Edit Department:", DepartmentId)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => console.log("Delete Department:", DepartmentId)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];
