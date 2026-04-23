"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService, Product } from "@/api/products.service";
import { ReadOnlyDetail } from "@/components/common/ReadOnlyDetail";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Loader2 } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(Number(params.id));
        setProduct(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={() => router.push(`/auth/products/${params.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" /> Edit Product
        </Button>
      </div>

      <div className="p-8">
        <ReadOnlyDetail data={product} type="product" />
      </div>
    </div>
  );
}
