"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Customer, customerService } from "@/api/customers.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ViewCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (id) {
      customerService.getById(Number(id)).then((res) => {
        if (res?.data) setCustomer(res.data);
      });
    }
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/customers")}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/customers/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="px-4">
          <ReadOnlyDetail data={customer} type="customer" />
        </div>
      </div>
    </div>
  );
}
