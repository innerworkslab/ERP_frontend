"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import {
  goodReceiptNotesService,
  GoodsReceiveNote,
} from "@/api/goodsReceiveNotes.service";

export default function ViewGoodsReceiveNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [grn, setGrn] = useState<GoodsReceiveNote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      goodReceiptNotesService
        .getById(Number(id))
        .then((res) => {
          if (res?.data) setGrn(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!grn) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-destructive">
          Goods Receipt Note profile could not be localized.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/auth/goods-receive-notes")}
          className="rounded-xl"
        >
          Back to Summary
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/goods-receive-notes")}
        >
          ← Back to Summary
        </Button>
        <Button
          onClick={() => router.push(`/auth/goods-receive-notes/${id}/edit`)}
          className="rounded-xl"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Receipt Note
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={grn} type="goodsReceiveNote" />
      </div>
    </div>
  );
}
