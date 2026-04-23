"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Inventory, inventoryService } from "@/api/inventories.service";
import InventoryForm from "@/components/inventories/InventoryForm";

export default function EditBranchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    inventoryService.getAll().then((res) => {
      const found = res.data.find((b) => b.id === Number(id));
      if (found) setInventory(found);
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
    <InventoryForm
      initialData={inventory}
      onSuccess={() => router.back()}
      setLoading={setSubmitLoading}
    />
  );
}
