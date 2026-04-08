"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, Loader2 } from "lucide-react";
import { openingStockService, OpeningStock } from "@/api/openingStocks.service";
import { toast } from "sonner";

export default function ViewOpeningStockPage() {
  const { id } = useParams();
  const router = useRouter();
  const [stock, setStock] = useState<OpeningStock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const res = await openingStockService.getById(Number(id));
        if (res?.data) {
          setStock(res.data);
        }
      } catch (err) {
        toast.error("Failed to load opening stock details");
        router.push("/auth/opening-stocks");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStock();
  }, [id, router]);

  const isConfirmed = stock?.status === "confirmed";

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
          Fetching Voucher...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/opening-stocks")}
          className="rounded-full hover:bg-muted/50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>

        {!isConfirmed && (
          <Button
            onClick={() => router.push(`/auth/opening-stocks/${id}/edit`)}
            className="rounded-2xl shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Voucher
          </Button>
        )}
      </div>

      <div className="p-8">
        <ReadOnlyDetail data={stock} type="openingStock" />
      </div>
    </div>
  );
}
