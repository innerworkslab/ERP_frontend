"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { stockBalanceService, StockBalance } from "@/api/stockBalances.service";

export default function ViewStockBalancePage() {
  const { id } = useParams();
  const router = useRouter();
  const [balance, setBalance] = useState<StockBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const res = await stockBalanceService.getBalanceById(Number(id));
        if (res?.data) {
          setBalance(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBalance();
  }, [id, router]);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/5 p-4 rounded-3xl animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
          Analyzing Inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/stock-balances")}
          className="rounded-full hover:bg-muted/50 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
        </Button>
      </div>

      <div className="bg-card/50 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8">
          <ReadOnlyDetail data={balance} type="stockBalance" />
        </div>
      </div>
    </div>
  );
}
