"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OpeningStockForm from "@/components/opening-stocks/OpeningStockForm";

export default function AddOpeningStockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.push("/auth/opening-stocks");
  };

  const handleSuccess = () => {
    router.push("/auth/opening-stocks");
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <OpeningStockForm onSuccess={handleSuccess} setLoading={setLoading} />
      </div>

      {loading && (
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
          <span className="text-xs font-bold uppercase tracking-widest">
            Saving Voucher...
          </span>
        </div>
      )}
    </div>
  );
}
