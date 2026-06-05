"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, CashbookAdjustment } from "@/api/cashbooks.service";
import AdjustmentForm from "@/components/cashbook-adjustments/AdjustmentForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditAdjustmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [adjustment, setAdjustment] = useState<CashbookAdjustment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdjustment = async () => {
      try {
        setLoading(true);
        const res = await cashbookService.getAdjustmentById(Number(id));
        if (res?.data) {
          setAdjustment(res.data);
        } else {
          toast.error("Adjustment not found");
          router.push("/auth/cashbook-adjustments");
        }
      } catch (err) {
        toast.error("Failed to load adjustment details");
        router.push("/auth/cashbook-adjustments");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAdjustment();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdjustmentForm
      adjustmentData={adjustment}
      onSuccess={() => router.push("/auth/cashbook-adjustments")}
    />
  );
}
