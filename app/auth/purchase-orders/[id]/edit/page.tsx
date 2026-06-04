"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PurchaseForm from "@/components/purchase-orders/PurchaseForm";
import { Loader2 } from "lucide-react";
import { PurchaseOrder, purchaseService } from "@/api/purchases-orders.service";

export default function EditPurchaseOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [purchase, setPurchase] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const res = await purchaseService.getById(Number(id));
        if (res?.data) {
          setPurchase(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchaseOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <PurchaseForm
      purchaseData={purchase}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
