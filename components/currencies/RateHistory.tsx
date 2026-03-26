"use client";

import { useEffect, useState } from "react";
import { currencyService } from "@/api/currencies.service";
import { Loader2, History as HistoryIcon } from "lucide-react"; // Renamed icon to avoid confusion
import { formatDate } from "@/utils/helper.utils";
import { Badge } from "@/components/ui/badge";

interface CurrencyHistory {
  id: number;
  currency_id: number;
  exchange_rate: string | number;
  rate_date: string;
  created_at: string;
  updated_at: string;
}

export function RateHistory({ currencyId }: { currencyId: number }) {
  const [history, setHistory] = useState<CurrencyHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await currencyService.getRateHistory(currencyId);
        setHistory(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currencyId]);

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (history.length === 0)
    return (
      <div className="text-center p-8 text-muted-foreground">
        No rate history found.
      </div>
    );

  return (
    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 rounded-xl border bg-background/50 backdrop-blur-sm transition-all hover:border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold font-mono text-sm">
                {Number(item.exchange_rate).toFixed(4)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatDate(item.rate_date)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
