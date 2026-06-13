"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PurchaseReturnForm from "@/components/purchase-returns/PurchaseReturnForm";
import { Loader2 } from "lucide-react";
import {
  purchaseReturnService,
  PurchaseReturnDetail,
} from "@/api/purchaseReturn.service";

export default function EditPurchaseReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  const [purchaseReturn, setPurchaseReturn] =
    useState<PurchaseReturnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchPurchaseReturn = async () => {
      try {
        const res = await purchaseReturnService.getById(Number(id));
        if (res?.data) {
          setPurchaseReturn(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchaseReturn();
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
    <PurchaseReturnForm
      returnData={purchaseReturn}
      onSuccess={() => router.push("/auth/purchase-returns")}
      setLoading={setSubmitLoading}
    />
  );
}
