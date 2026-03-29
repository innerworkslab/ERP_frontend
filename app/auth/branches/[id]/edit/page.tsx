"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BranchForm from "@/components/branches/BranchForm";
import { branchService, Branch } from "@/api/branches.service";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EditBranchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    branchService.getAll().then((res) => {
      const found = res.data.find((b) => b.id === Number(id));
      if (found) setBranch(found);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <BranchForm
      branchData={branch}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
