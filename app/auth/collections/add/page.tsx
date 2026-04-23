"use client";

import { useRouter } from "next/navigation";
import CollectionForm from "@/components/collections/CollectionForm";

export default function AddCollectionPage() {
  const router = useRouter();

  return <CollectionForm onSuccess={() => router.push("/auth/collections")} />;
}
