"use client";

import PurchaseForm from "@/components/purchase-orders/PurchaseForm";
import { useRouter } from "next/navigation";

export default function CreatePurchaseOrderPage() {
  const router = useRouter();

  return <PurchaseForm onSuccess={() => router.push("/auth/purchase-orders")} />;
}
