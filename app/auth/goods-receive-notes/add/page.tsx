"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GrnForm from "@/components/goodsReceiveNotes/GoodsReceiveNoteForm";

export default function AddGoodsReceiveNotePage() {
  const router = useRouter();
  const [, setSubmitLoading] = useState(false);

  return (
    <GrnForm
      onSuccess={() => router.push("/auth/goods-receive-notes")}
      setLoading={setSubmitLoading}
    />
  );
}
