"use client";

import { useRouter } from "next/navigation";
import CashbookForm from "@/components/cashbooks/CashbookForm";

export default function CreateCashbookPage() {
  const router = useRouter();

  return <CashbookForm onSuccess={() => router.push("/auth/cashbooks")} />;
}
