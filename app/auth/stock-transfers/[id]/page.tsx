"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, Loader2 } from "lucide-react";
import {
  stockTransferService,
  StockTransfer,
} from "@/api/stockTransfers.service";
import { toast } from "sonner";

export default function ViewStockTransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<StockTransfer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        setLoading(true);
        const res = await stockTransferService.getById(Number(id));
        if (res?.data) {
          setTransfer(res.data);
        }
      } catch (err) {
        toast.error("Failed to load stock transfer details");
        router.push("/auth/stock-transfers");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransfer();
  }, [id, router]);

  const isPending = transfer?.status === "pending";

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
          Fetching Transfer...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/stock-transfers")}
          className="rounded-full hover:bg-muted/50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>

        {isPending && (
          <Button
            onClick={() => router.push(`/auth/stock-transfers/${id}/edit`)}
            className="rounded-2xl shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Transfer
          </Button>
        )}
      </div>

      <div className="p-6">
        <ReadOnlyDetail data={transfer} type="stockTransfer" />
      </div>
    </div>
  );
}
