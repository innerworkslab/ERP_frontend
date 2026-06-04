"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TransactionForm from "@/components/cashbook-transactions/TransactionForm";
import { cashbookService, CashbookTransaction } from "@/api/cashbooks.service";
import { Loader2 } from "lucide-react";

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<CashbookTransaction | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    cashbookService.getTransactions().then((res) => {
      const found = res.data.find((tx) => tx.id === Number(id));
      if (found) setTransaction(found);
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
    <TransactionForm
      transactionData={transaction}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
