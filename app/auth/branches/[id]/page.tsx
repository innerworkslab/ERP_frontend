"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { branchService, Branch } from "@/api/branches.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ViewBranchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<Branch | null>(null);

  useEffect(() => {
    branchService.getAll().then((res) => {
      const found = res.data.find((b) => b.id === Number(id));
      if (found) setBranch(found);
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/auth/branches")}>
          ← Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/branches/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Branch
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={branch} type="branch" />
      </div>
    </div>
  );
}
