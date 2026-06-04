"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/cashbook-transactions/TransactionForm";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);

  return (
    <TransactionForm
      onSuccess={() => router.push("/auth/cashbook-transactions")}
      setLoading={setSubmitLoading}
    />
  );
}
