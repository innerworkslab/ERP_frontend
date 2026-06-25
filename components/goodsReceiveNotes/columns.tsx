"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Check, X, Loader2, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppDialog } from "@/components/common/AppDialog";
import { FormInput } from "@/components/common/FormInput";
import { FormSelect, Option } from "@/components/common/FormSelect";
import { goodReceiptNotesService } from "@/api/goodsReceiveNotes.service";
import { cashbookService } from "@/api/cashbooks.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface GoodsReceiveNote {
  id: number;
  grn_no: string;
  grn_date: string;
  supplier: string;
  po_no: string;
  branch: string;
  warehouse_location: string;
  delivery_status: string;
  total_amount: string | number;
  currency: string;
  status: string;
}

interface ActionCellProps {
  grn: GoodsReceiveNote;
  onView: (grn: GoodsReceiveNote) => void;
  onEdit: (grn: GoodsReceiveNote) => void;
  refresh: () => void;
}

const ActionCell = ({ grn, onView, onEdit, refresh }: ActionCellProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingCashbooks, setIsLoadingCashbooks] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [cashbookId, setCashbookId] = useState<string>("");
  const [cashbooks, setCashbooks] = useState<Option[]>([]);

  useEffect(() => {
    if (showApproveDialog) {
      const fetchCashbooks = async () => {
        try {
          setIsLoadingCashbooks(true);
          const res = await cashbookService.getAll();
          const data = res?.data || res || [];

          const formattedOptions = data.map((item: any) => ({
            id: item.id,
            name: item.name,
          }));

          setCashbooks(formattedOptions);

          if (formattedOptions.length > 0) {
            setCashbookId(formattedOptions[0].id.toString());
          }
        } catch (err) {
          toast.error("Failed to load cashbook records.");
        } finally {
          setIsLoadingCashbooks(false);
        }
      };
      fetchCashbooks();
    }
  }, [showApproveDialog]);

  const handleApproveSubmit = async () => {
    const numericAmount = Number(paidAmount);
    const numericCashbookId = Number(cashbookId);

    if (isNaN(numericAmount) || numericAmount < 0) return;
    if (isNaN(numericCashbookId) || !cashbookId) return;

    try {
      setIsProcessing(true);
      await goodReceiptNotesService.approve(grn.id, {
        paid_amount: numericAmount,
        cashbook_id: numericCashbookId,
      } as any);

      toast.success("Goods receipt note successfully approved.");
      setShowApproveDialog(false);
      refresh();
    } catch (err) {
      toast.error("Failed to approve receipt note.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    try {
      setIsProcessing(true);
      await goodReceiptNotesService.reject(grn.id);

      toast.success("Goods receipt note successfully rejected.");
      setShowRejectDialog(false);
      refresh();
    } catch (err) {
      toast.error("Failed to reject receipt note.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onView(grn)}>
        <Eye className="h-4 w-4 text-blue-400" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => onEdit(grn)}>
        <Edit className="h-4 w-4 text-muted-foreground" />
      </Button>

      {grn.status === "approved" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`/auth/goods-receive-notes/${grn.id}/returnable-lines`)
          }
        >
          <CornerDownLeft className="h-4 w-4 text-amber-500 hover:text-amber-600 transition-colors" />
        </Button>
      )}

      {grn.status === "pending" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPaidAmount(
                grn.total_amount ? grn.total_amount.toString() : "0",
              );
              setCashbookId("");
              setShowApproveDialog(true);
            }}
          >
            <Check className="h-4 w-4 text-emerald-500 hover:text-emerald-600 transition-colors" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRejectDialog(true)}
          >
            <X className="h-4 w-4 text-rose-500 hover:text-rose-600 transition-colors" />
          </Button>
        </>
      )}

      <AppDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Goods Receipt Note"
        description={`Confirm receipt clearing and bind transactional balance blocks for ${grn.grn_no}.`}
      >
        <div className="space-y-4 mt-4">
          <FormInput
            label="Paid Amount Settlement"
            type="number"
            min={0}
            registration={{
              name: "paid_amount",
              value: paidAmount,
              onChange: (e) => {
                const val = e?.target ? e.target.value : e;
                setPaidAmount(val);
              },
            }}
            error={
              Number(paidAmount) < 0 ? "Amount cannot be negative" : undefined
            }
          />

          <FormSelect
            label="Cashbook Account"
            placeholder="Select a cashbook account"
            options={cashbooks}
            value={cashbookId}
            onValueChange={(val) => setCashbookId(val)}
            loading={isLoadingCashbooks}
            isClearable={false}
            error={
              !cashbookId && !isLoadingCashbooks
                ? "Valid Cashbook selection is required"
                : undefined
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSubmit}
              disabled={
                isProcessing ||
                isLoadingCashbooks ||
                !paidAmount ||
                Number(paidAmount) < 0 ||
                !cashbookId
              }
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve & Post
            </Button>
          </div>
        </div>
      </AppDialog>

      <AppDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Receipt Note"
        description={`Are you absolutely sure you want to drop processing actions for voucher line item ${grn.grn_no}? This action is permanent.`}
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRejectSubmit}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Rejection
          </Button>
        </div>
      </AppDialog>
    </div>
  );
};

export const getColumns = (
  onView: (grn: GoodsReceiveNote) => void,
  onEdit: (grn: GoodsReceiveNote) => void,
  refresh: () => void,
): ColumnDef<GoodsReceiveNote>[] => [
  {
    accessorKey: "grn_no",
    header: "GRN Reference",
    cell: ({ row }) => (
      <span className="font-bold text-sm text-primary">
        {row.original.grn_no}
      </span>
    ),
  },
  {
    accessorKey: "grn_date",
    header: "Execution Date",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-foreground">
        {row.original.grn_date || "—"}
      </span>
    ),
  },
  {
    accessorKey: "po_no",
    header: "PO Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.po_no || "—"}
      </span>
    ),
  },
  {
    accessorKey: "supplier",
    header: "Vendor Supplier",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-muted-foreground">
        {row.original.supplier || "—"}
      </span>
    ),
  },
  {
    accessorKey: "warehouse_location",
    header: "Warehouse Location",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.warehouse_location || "—"}
      </span>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Total Value",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-foreground">
        {Number(row.original.total_amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        {row.original.currency || ""}
      </span>
    ),
  },
  {
    accessorKey: "delivery_status",
    header: "Logistics State",
    cell: ({ row }) => {
      const status = row.original.delivery_status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-transparent",
            status === "fully_delivered" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            status === "partially_delivered" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
            status === "not_delivered" &&
              "bg-rose-500/10 text-rose-500 border-rose-500/20",
          )}
        >
          {status?.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Approval State",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-transparent",
            status === "approved" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            status === "pending" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
            status === "rejected" &&
              "bg-rose-500/10 text-rose-500 border-rose-500/20",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        grn={row.original}
        onView={onView}
        onEdit={onEdit}
        refresh={refresh}
      />
    ),
  },
];
