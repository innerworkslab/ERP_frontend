"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, CashbookTransferItem } from "@/api/cashbooks.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function ViewTransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<CashbookTransferItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashbookService.getTransfers().then((res) => {
      const found = res.data.find((tx) => tx.id === Number(id));
      if (found) setTransfer(found);
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

  if (!transfer) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-destructive">
          Transfer profile could not be localized.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/cashbook-transfers")}
          className="rounded-xl"
        >
          Back to Transfers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/cashbook-transfers")}
        >
          ← Back to Transfers
        </Button>
        <Button
          onClick={() => router.push(`/auth/cashbook-transfers/${id}/edit`)}
          className="rounded-xl"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Transfer
        </Button>
      </div>

      <div className="px-4">
        <ReadOnlyDetail data={transfer} type="cashbookTransfer" />
      </div>
    </div>
  );
}
