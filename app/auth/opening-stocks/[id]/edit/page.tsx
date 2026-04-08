"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { openingStockService, OpeningStock } from "@/api/openingStocks.service";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OpeningStockForm from "@/components/opening-stocks/OpeningStockForm";

export default function EditOpeningStockPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [initialData, setInitialData] = useState<OpeningStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStock = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await openingStockService.getById(id);
      if (res?.data) {
        // Redirect if already confirmed (prevents editing confirmed stocks via URL)
        if (res.data.status === "confirmed") {
          toast.error("Confirmed stocks cannot be edited");
          router.push("/auth/opening-stocks");
          return;
        }
        setInitialData(res.data);
      }
    } catch (err) {
      toast.error("Failed to load opening stock data");
      router.push("/auth/opening-stocks");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadStock();
  }, [id, loadStock]);

  const handleBack = () => {
    router.push("/auth/opening-stocks");
  };

  const handleSuccess = () => {
    router.push("/auth/opening-stocks");
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">
          Loading Voucher Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Container */}
      <div className="p-6">
        <OpeningStockForm initialData={initialData} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
