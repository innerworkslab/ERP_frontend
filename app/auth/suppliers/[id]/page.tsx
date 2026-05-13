"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Supplier, supplierService } from "@/api/suppliers.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";

export default function ViewSupplierPage() {
  const { id } = useParams();
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (id) {
      supplierService.getById(Number(id)).then((res) => {
        if (res?.data) setSupplier(res.data);
      });
    }
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/suppliers")}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/suppliers/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="px-4">
          <ReadOnlyDetail data={supplier} type="supplier" />
        </div>
      </div>
    </div>
  );
}
