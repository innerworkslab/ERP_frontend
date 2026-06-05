"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { purchaseService, PurchaseOrder } from "@/api/purchases-orders.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function ViewPurchaseOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    purchaseService
      .getById(Number(id))
      .then((res) => {
        const orderData = res?.data || res;
        if (orderData) {
          setPurchaseOrder(orderData);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch purchase order detail:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/purchase-orders")}
        >
          ← Back to Ledger
        </Button>
        <Button
          onClick={() => router.push(`/auth/purchase-orders/${id}/edit`)}
          className="rounded-xl"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit P.O
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={purchaseOrder} type="purchaseOrder" />
      </div>
    </div>
  );
}
