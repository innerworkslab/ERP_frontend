"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, CashbookTransferItem } from "@/api/cashbooks.service";
import TransferForm from "@/components/cashbook-transfers/TransferForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditTransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transfer, setTransfer] = useState<CashbookTransferItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        setLoading(true);
        const res = await cashbookService.getTransferById(Number(id));
        if (res?.data) {
          setTransfer(res.data);
        } else {
          toast.error("Transfer not found");
          router.push("/auth/cashbook-transfers");
        }
      } catch (err) {
        toast.error("Failed to load transfer details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransfer();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TransferForm
      initialData={transfer}
      onSuccess={() => router.push("/auth/cashbook-transfers")}
    />
  );
}
