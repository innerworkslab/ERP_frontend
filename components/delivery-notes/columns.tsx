"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { DeliveryNote, deliveryNoteService } from "@/api/deliveryNotes.service";

const ActionCell = ({
  note,
  onEdit,
  onView,
  refresh,
}: {
  note: DeliveryNote;
  onEdit: () => void;
  onView: (note: DeliveryNote) => void;
  refresh: () => void;
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleUpdateStatus = async (
    status: "pending" | "confirmed" | "rejected",
  ) => {
    try {
      setLoadingAction(status);

      await deliveryNoteService.updateStatus(note.id, status);

      refresh();
      toast.success(`Status updated to ${status}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 text-blue-500"
        onClick={() => onView(note)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" className="h-8 w-8 p-0" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      {note.status === "draft" && (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-yellow-500"
          onClick={() => handleUpdateStatus("pending")}
          disabled={!!loadingAction}
          title="Pending"
        >
          {loadingAction === "pending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Clock3 className="h-4 w-4" />
          )}
        </Button>
      )}

      {note.status === "pending" && (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-green-600"
          onClick={() => handleUpdateStatus("confirmed")}
          disabled={!!loadingAction}
          title="Confirm"
        >
          {loadingAction === "confirmed" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
        </Button>
      )}

      {(note.status === "draft" || note.status === "pending") && (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-red-600"
          onClick={() => handleUpdateStatus("rejected")}
          disabled={!!loadingAction}
          title="Reject"
        >
          {loadingAction === "rejected" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export const getColumns = (
  onEdit: (note: DeliveryNote) => void,
  onView: (note: DeliveryNote) => void,
  refresh: () => void,
): ColumnDef<DeliveryNote>[] => [
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
    cell: ({ row }) => (
      <span className="font-mono font-bold">
        {new Date(row.original.delivery_date).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "deliver_note_no",
    header: "DN Number",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.deliver_note_no}</span>
    ),
  },
  { accessorKey: "receiver_name", header: "Receiver" },
  {
    accessorKey: "delivery_provider.name",
    header: "Delivery Provider",
    cell: ({ row }) => (
      <span>{row.original.delivery_provider?.name || "-"}</span>
    ),
  },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        note={row.original}
        onEdit={() => onEdit(row.original)}
        onView={onView}
        refresh={refresh}
      />
    ),
  },
];
