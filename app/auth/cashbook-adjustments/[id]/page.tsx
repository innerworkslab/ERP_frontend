"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, CashbookAdjustment } from "@/api/cashbooks.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function ViewAdjustmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [adjustment, setAdjustment] = useState<CashbookAdjustment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashbookService.getAdjustmentById(Number(id)).then((res) => {
      if (res?.data) setAdjustment(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-destructive">
          Adjustment profile could not be localized.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/cashbook-adjustments")}
          className="rounded-xl"
        >
          Back to Adjustments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/cashbook-adjustments")}
        >
          ← Back to Adjustments
        </Button>
        {adjustment.status === "pending" && (
          <Button
            onClick={() => router.push(`/auth/cashbook-adjustments/${id}/edit`)}
            className="rounded-xl"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Adjustment
          </Button>
        )}
      </div>

      <div className="px-4">
        <ReadOnlyDetail data={adjustment} type="cashbookAdjustment" />
      </div>
    </div>
  );
}
