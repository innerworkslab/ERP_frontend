"use client";

import { useRouter } from "next/navigation";
import BranchForm from "@/components/branches/BranchForm";

export default function AddBranchPage() {
  const router = useRouter();

  return <BranchForm onSuccess={() => router.push("/auth/branches")} />;
}
