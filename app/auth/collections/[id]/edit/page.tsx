"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Collection, collectionsService } from "@/api/collections.service";
import CollectionForm from "@/components/collections/CollectionForm";

export default function EditBranchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    collectionsService.getAll().then((res) => {
      const found = res.data.find((b) => b.id === Number(id));
      if (found) setCollection(found);
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
    <CollectionForm
      initialData={collection}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
