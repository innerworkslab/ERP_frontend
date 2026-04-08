"use client";

import { useRouter } from "next/navigation";
import StockTransferForm from "@/components/stock-transfers/StockTransferForm";

export default function AddStockTransferPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/auth/stock-transfers");
    router.refresh();
  };

  return (
    <div className="space-y-6 p-6">
      <StockTransferForm onSuccess={handleSuccess} />
    </div>
  );
}
