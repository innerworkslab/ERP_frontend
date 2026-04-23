"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collectionsService,
  Collection,
  CollectionProduct,
} from "@/api/collections.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, Package } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export default function ViewCollectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collectionId = Number(id);

        const [detailRes, productRes] = await Promise.all([
          collectionsService.getById(collectionId),
          collectionsService.getProductList(collectionId),
        ]);

        if (detailRes) setCollection(detailRes.data);
        if (productRes) setProducts(productRes.data);
      } catch (error) {
        console.error("Failed to fetch collection", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const productColumns: ColumnDef<CollectionProduct>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase">
            {row.original.sku}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "pivot.product_qty",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.pivot.product_qty}
        </span>
      ),
    },
    {
      accessorKey: "sale_price",
      header: "Unit Price",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.sale_currency.symbol} {row.original.sale_price}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/auth/collections")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
        </Button>
        <Button
          size="sm"
          onClick={() => router.push(`/auth/collections/${id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Collection
        </Button>
      </div>
      <div className="p-6">
        <ReadOnlyDetail data={collection} type="collection" />

        <div className="lg:col-span-2 space-y-4 mt-5">
          <h3 className="text-lg font-bold tracking-tight">Collection Items</h3>

          <DataTable columns={productColumns} data={products} />
        </div>
      </div>
    </div>
  );
}
