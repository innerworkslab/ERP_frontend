"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  goodReceiptNotesService,
  ReturnableGrnLinesResponse,
} from "@/api/goodsReceiveNotes.service";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReturnableLinesPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReturnableGrnLinesResponse["data"] | null>(
    null,
  );

  useEffect(() => {
    const fetchLines = async () => {
      try {
        setLoading(true);
        const res = await goodReceiptNotesService.getReturnableLines(
          Number(id),
        );
        const payload = res?.data || (res as any);
        setData(payload);
      } catch (err) {
        toast.error("Failed to load returnable items matrix.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLines();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/goods-receive-notes")}
        >
          ← Back to List
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/20 border border-black/5 dark:border-white/5 p-4 rounded-xl text-xs">
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Supplier Vendor
          </span>
          <span className="font-semibold text-foreground">
            {data.supplier_name}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Branch Context
          </span>
          <span className="font-semibold text-foreground">
            {data.branch_name}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-0.5">
            Active Inventory Location
          </span>
          <span className="font-semibold text-foreground">
            {data.inventory_name}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 dark:border-white/5">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-black/5 dark:border-white/5 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
              <th className="p-3">Product Description</th>
              <th className="p-3">SKU</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">GRN Accepted</th>
              <th className="p-3 text-right">Already Returned</th>
              <th className="p-3 text-right font-bold text-amber-500">
                Remaining Returnable
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
            {data.lines.map((line) => (
              <tr
                key={line.goods_receive_note_line_id}
                className="hover:bg-muted/10 transition-colors"
              >
                <td className="p-3 font-sans font-semibold text-foreground">
                  {line.product_name}
                </td>
                <td className="p-3 text-[10px] text-muted-foreground">
                  {line.sku}
                </td>
                <td className="p-3 text-right">
                  {line.unit_price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {data.currency_code}
                </td>
                <td className="p-3 text-right text-muted-foreground">
                  {line.grn_good_quantity}{" "}
                  <span className="text-[10px] font-sans">{line.uom_name}</span>
                </td>
                <td className="p-3 text-right text-rose-400">
                  {line.already_returned_quantity}
                </td>
                <td className="p-3 text-right text-emerald-500 font-bold bg-emerald-500/[0.02]">
                  {line.returnable_quantity}
                </td>
              </tr>
            ))}
            {data.lines.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center font-sans text-muted-foreground"
                >
                  No returnable lines found or remaining balances are completely
                  exhausted for this note.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
