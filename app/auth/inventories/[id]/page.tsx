"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Inventory, inventoryService } from "@/api/inventories.service";

export default function ViewInventoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);

  useEffect(() => {
    inventoryService.getAll().then((res) => {
      const found = res.data.find((b) => b.id === Number(id));
      if (found) setInventory(found);
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/inventories")}
        >
          ← Back to List
        </Button>
        <Button onClick={() => router.push(`/auth/inventories/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Branch
        </Button>
      </div>
      <div className="px-4">
        <ReadOnlyDetail data={inventory} type="inventory" />
      </div>
    </div>
  );
}
