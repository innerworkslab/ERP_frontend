"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  stockTransferService,
  StockTransfer,
} from "@/api/stockTransfers.service";
import StockTransferForm from "@/components/stock-transfers/StockTransferForm";

export default function EditStockTransferPage() {
  const params = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<StockTransfer | null>(null);

  const handleSuccess = () => {
    router.back();
    router.refresh();
  };

  useEffect(() => {
    const fetchTransfer = async () => {
      const res = await stockTransferService.getById(Number(params.id));
      setTransfer(res.data);
    };

    if (params.id) {
      fetchTransfer();
    }
  }, [params.id, router]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <StockTransferForm initialData={transfer} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
