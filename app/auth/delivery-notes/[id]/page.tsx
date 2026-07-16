"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DeliveryNote, deliveryNoteService } from "@/api/deliveryNotes.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";

export default function ViewDeliveryNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [deliveryNote, setDeliveryNote] = useState<DeliveryNote | null>(null);

  useEffect(() => {
    if (id) {
      deliveryNoteService.getById(Number(id)).then((res) => {
        if (res?.data) setDeliveryNote(res.data);
      });
    }
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/delivery-notes")}
          className="hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/delivery-notes/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Delivery Note
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="px-4">
          <ReadOnlyDetail data={deliveryNote} type="deliveryNote" />
        </div>
      </div>
    </div>
  );
}
