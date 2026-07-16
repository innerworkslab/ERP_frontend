"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deliveryNoteService } from "@/api/deliveryNotes.service";
import DeliveryNoteForm from "@/components/delivery-notes/DeliveryNoteForm";

export default function EditPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    deliveryNoteService.getById(Number(id)).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div>Loading...</div>;
  return <DeliveryNoteForm initialData={data} />;
}
