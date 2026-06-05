"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, CashbookTransaction } from "@/api/cashbooks.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

export default function ViewTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<CashbookTransaction | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashbookService.getTransactions().then((res) => {
      const found = res.data.find((tx) => tx.id === Number(id));
      if (found) setTransaction(found);
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

  if (!transaction) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-destructive">
          Transaction profile could not be localized.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/cashbook-transactions")}
          className="rounded-xl"
        >
          Back to Ledger
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/cashbook-transactions")}
        >
          ← Back to Ledger
        </Button>
        <Button
          onClick={() => router.push(`/auth/cashbook-transactions/${id}/edit`)}
          className="rounded-xl"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Transaction
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={transaction} type="cashbookTransaction" />
      </div>
    </div>
  );
}
