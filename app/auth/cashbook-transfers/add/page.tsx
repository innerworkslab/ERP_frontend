"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransferForm from "@/components/cashbook-transfers/TransferForm";

export default function CreateTransferPage() {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);

  return (
    <TransferForm
      onSuccess={() => router.push("/auth/cashbook-transfers")}
      setLoading={setSubmitLoading}
    />
  );
}
