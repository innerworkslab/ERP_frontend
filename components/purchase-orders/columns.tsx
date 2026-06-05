"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, Eye, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppDialog } from "@/components/common/AppDialog";
import { purchaseService, PurchaseOrder } from "@/api/purchases-orders.service";
import { cashbookService } from "@/api/cashbooks.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FormSelect, Option } from "../common/FormSelect";
import { FormInput } from "../common/FormInput";

interface ActionCellProps {
  purchase: PurchaseOrder;
  onView: (purchase: PurchaseOrder) => void;
  onEdit: (purchase: PurchaseOrder) => void;
  refresh: () => void;
}

const deliveryOptions: Option[] = [
  { id: "not_delivered", name: "Not Delivered" },
  { id: "partially_delivered", name: "Partially Delivered" },
  { id: "fully_delivered", name: "Fully Delivered" },
];

const ActionCell = ({ purchase, onView, onEdit, refresh }: ActionCellProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);

  const [cashbooks, setCashbooks] = useState<Option[]>([]);
  const [cashbookId, setCashbookId] = useState<number | string>("");
  const [paidAmount, setPaidAmount] = useState<string>("");

  const [deliveryStatus, setDeliveryStatus] = useState<string>(
    purchase.delivery_status || "not_delivered",
  );

  useEffect(() => {
    if (showPaymentDialog) {
      const fetchCashbooks = async () => {
        const result = await cashbookService.getAll();
        const accounts = result.data || [];
        setCashbooks(accounts);
        if (accounts.length > 0) {
          setCashbookId(accounts[0].id);
        }
      };
      fetchCashbooks();
    }
  }, [showPaymentDialog]);

  const handlePaymentSubmit = async () => {
    const numericAmount = Number(paidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0 || cashbookId === "") return;

    try {
      setIsProcessing(true);
      const result = await purchaseService.updatePaymentStatus(purchase.id, {
        cashbook_id: Number(cashbookId),
        paid_amount: numericAmount,
      });
      toast.success(
        result.response?.message || "Payment transaction recorded successfully",
      );
      setShowPaymentDialog(false);
      refresh();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeliverySubmit = async () => {
    try {
      setIsProcessing(true);
      await purchaseService.updateDeliveryStatus(purchase.id, {
        delivery_status: deliveryStatus,
      });
      toast.success("Logistics status updated successfully");
      setShowDeliveryDialog(false);
      refresh();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onView(purchase)}>
        <Eye className="h-4 w-4 text-blue-400" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => onEdit(purchase)}>
        <Edit className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setPaidAmount(
            purchase.total_amount ? purchase.total_amount.toString() : "",
          );
          setShowPaymentDialog(true);
        }}
      >
        <CreditCard className="h-4 w-4 text-amber-500 hover:text-amber-600 transition-colors" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setDeliveryStatus(purchase.delivery_status || "not_delivered");
          setShowDeliveryDialog(true);
        }}
      >
        <Truck className="h-4 w-4 text-emerald-500 hover:text-emerald-600 transition-colors" />
      </Button>

      <AppDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        title="Record Purchase Payment"
        description={`Apply an outbound cash settlement block to order reference ${purchase.po_number}.`}
      >
        <div className="space-y-4 mt-4">
          <FormSelect
            label="Target Cashbook Account"
            placeholder="Select cashbook account"
            options={cashbooks}
            value={cashbookId}
            onValueChange={(val) => setCashbookId(val)}
            isClearable={false}
          />

          <FormInput
            label="Paid Amount Tranche"
            type="number"
            min={0}
            placeholder="0.00"
            registration={{
              name: "paid_amount",
              value: paidAmount,
              onChange: (e: any) => {
                const val =
                  e && typeof e === "object" && "target" in e
                    ? e.target.value
                    : e;
                setPaidAmount(val);
              },
            }}
            error={
              Number(paidAmount) < 0 ? "Amount cannot be negative" : undefined
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={
                isProcessing ||
                cashbookId === "" ||
                !paidAmount ||
                Number(paidAmount) <= 0
              }
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Post Payment
            </Button>
          </div>
        </div>
      </AppDialog>

      <AppDialog
        open={showDeliveryDialog}
        onOpenChange={setShowDeliveryDialog}
        title="Update Logistics State"
        description={`Modify the structural consignment delivery progress for order ${purchase.po_number}.`}
      >
        <div className="space-y-4 mt-4">
          <FormSelect
            label="Current Consignment Status"
            options={deliveryOptions}
            value={deliveryStatus}
            onValueChange={(val) => setDeliveryStatus(val)}
            isClearable={false}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeliveryDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeliverySubmit}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Dispatch Status
            </Button>
          </div>
        </div>
      </AppDialog>
    </div>
  );
};

export const getColumns = (
  onView: (purchase: PurchaseOrder) => void,
  onEdit: (purchase: PurchaseOrder) => void,
  refresh: () => void,
): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: "po_number",
    header: "PO Reference",
    cell: ({ row }) => (
      <span className="font-bold text-sm text-primary">
        {row.original.po_number}
      </span>
    ),
  },
  {
    id: "supplier",
    header: "Vendor Supplier",
    accessorFn: (row) =>
      row.supplier?.company_name || row.supplier?.name || "—",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-muted-foreground">
        {row.original.supplier?.company_name ||
          row.original.supplier?.name ||
          "—"}
      </span>
    ),
  },
  {
    accessorKey: "total_amount",
    header: "Total Value",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-foreground">
        {row.original.currency?.symbol || "$"}
        {Number(row.original.total_amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Payment State",
    cell: ({ row }) => {
      const status = row.original.payment_status;
      return (
        <Badge
          className={cn(
            "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-transparent",
            status === "paid" &&
              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            status === "partially_paid" &&
              "bg-amber-500/10 text-amber-500 border-amber-500/20",
            status === "unpaid" &&
              "bg-rose-500/10 text-rose-500 border-rose-500/20",
          )}
        >
          {status?.replace("_", " ")}
        </Badge>
      );
    },
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
          {status?.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <ActionCell
        purchase={row.original}
        onView={onView}
        onEdit={onEdit}
        refresh={refresh}
      />
    ),
  },
];
