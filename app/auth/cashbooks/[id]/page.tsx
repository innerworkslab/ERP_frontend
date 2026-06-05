"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cashbookService, Cashbook } from "@/api/cashbooks.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ViewCashbookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [cashbook, setCashbook] = useState<Cashbook | null>(null);

  useEffect(() => {
    cashbookService.getAll().then((res) => {
      const found = res.data.find((c) => c.id === Number(id));
      if (found) setCashbook(found);
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/auth/cashbooks")}>
          ← Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/cashbooks/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Cashbook
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={cashbook} type="cashbook" />
      </div>
    </div>
  );
}
