"use client";

import PurchaseReturnForm from "@/components/purchase-returns/PurchaseReturnForm";
import { useRouter } from "next/navigation";

export default function CreatePurchaseReturnPage() {
  const router = useRouter();

  return (
    <PurchaseReturnForm
      onSuccess={() => router.push("/auth/purchase-returns")}
    />
  );
}
