"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, LedgerTransaction } from "@/api/cashbooks.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ViewLedgerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ledgerItem, setLedgerItem] = useState<LedgerTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashbookService.getStatement({ cashbook_id: Number(id) }).then((res) => {
      if (res?.data?.data && res.data.data.length > 0) {
        setLedgerItem(res.data.data[0]);
      }
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

  if (!ledgerItem) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-destructive">
          Ledger transaction profile could not be localized.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/cashbook-ledgers")}
          className="rounded-xl"
        >
          Back to Ledgers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/cashbook-ledgers")}
        >
          ← Back to Ledgers
        </Button>
      </div>

      <div className="px-4">
        <ReadOnlyDetail data={ledgerItem} type="cashbookLedger" />
      </div>
    </div>
  );
}
