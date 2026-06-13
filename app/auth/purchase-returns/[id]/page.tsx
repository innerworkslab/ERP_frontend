"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  purchaseReturnService,
  PurchaseReturnDetail,
} from "@/api/purchaseReturn.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function ViewPurchaseReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  const [purchaseReturn, setPurchaseReturn] =
    useState<PurchaseReturnDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    purchaseReturnService
      .getById(Number(id))
      .then((res) => {
        const orderData = res?.data || res;
        if (orderData) {
          setPurchaseReturn(orderData as any);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch purchase return detail:", err);
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

  const isPending = purchaseReturn?.status === "pending";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/purchase-returns")}
        >
          ← Back to Ledger
        </Button>
        {isPending && (
          <Button
            onClick={() => router.push(`/auth/purchase-returns/${id}/edit`)}
            className="rounded-xl"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Reversal Record
          </Button>
        )}
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={purchaseReturn} type="purchaseReturn" />
      </div>
    </div>
  );
}
