"use client";

import { useRouter } from "next/navigation";
import AdjustmentForm from "@/components/cashbook-adjustments/AdjustmentForm";

export default function CreateAdjustmentPage() {
  const router = useRouter();

  return (
    <AdjustmentForm
      onSuccess={() => router.push("/auth/cashbook-adjustments")}
    />
  );
}
