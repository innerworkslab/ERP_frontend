"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CashbookForm from "@/components/cashbooks/CashbookForm";
import { cashbookService, Cashbook } from "@/api/cashbooks.service";
import { Loader2 } from "lucide-react";

export default function EditCashbookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cashbook, setCashbook] = useState<Cashbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    cashbookService.getAll().then((res) => {
      const found = res.data.find((c) => c.id === Number(id));
      if (found) setCashbook(found);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <CashbookForm
      cashbookData={cashbook}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
