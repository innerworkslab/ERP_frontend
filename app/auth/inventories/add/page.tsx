"use client";

import { useRouter } from "next/navigation";
import InventoryForm from "@/components/inventories/InventoryForm";

export default function AddBranchPage() {
  const router = useRouter();

  return <InventoryForm onSuccess={() => router.push("/auth/inventories")} />;
}
