"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OriginCountry } from "@/api/originCountries.service";

export const getColumns = (
  onEdit: (data: OriginCountry) => void,
  onView: (data: OriginCountry) => void,
): ColumnDef<OriginCountry>[] => [
  {
    accessorKey: "name",
    header: "Country Name",
    cell: ({ row }) => <span className="font-bold">{row.original.name}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Registered Date",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
