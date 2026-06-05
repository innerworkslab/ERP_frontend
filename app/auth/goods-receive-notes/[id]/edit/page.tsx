"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  goodReceiptNotesService,
  GoodsReceiveNote,
} from "@/api//goodsReceiveNotes.service";
import { Loader2 } from "lucide-react";
import GrnForm from "@/components/goodsReceiveNotes/GoodsReceiveNoteForm";

export default function EditGoodsReceiveNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [grn, setGrn] = useState<GoodsReceiveNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchGrnData = async () => {
      try {
        const res = await goodReceiptNotesService.getById(Number(id));
        if (res?.data) {
          setGrn(res.data);
        }
      } catch (error) {
        console.error("Failed to recover explicit GRN metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGrnData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">
          Modify Receipt Note Block
        </h2>
        <p className="text-xs text-muted-foreground">
          Adjust structural items, variations or weight allocations on
          transaction reference.
        </p>
      </div>

      <GrnForm
        grnData={grn}
        onSuccess={() => router.push("/auth/goods-receive-notes")}
        setLoading={setSubmitLoading}
      />
    </div>
  );
}
