"use client";

import { ReturnableGrnLineItem } from "@/api/goodsReceiveNotes.service";

interface ReturnableLinesTableProps {
  lines: ReturnableGrnLineItem[];
  quantities: Record<number, number>;
  onQuantityChange: (lineId: number, val: number) => void;
}

export const ReturnableLinesTable = ({
  lines,
  quantities,
  onQuantityChange,
}: ReturnableLinesTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/5 dark:border-white/5">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-muted/40 border-b border-black/5 dark:border-white/5 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
            <th className="p-3">Product Description</th>
            <th className="p-3">SKU</th>
            <th className="p-3 text-right">GRN Received</th>
            <th className="p-3 text-right">Already Returned</th>
            <th className="p-3 text-right">Max Returnable</th>
            <th className="p-3 text-right w-32">Return Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
          {lines.map((line) => (
            <tr
              key={line.goods_receive_note_line_id}
              className="hover:bg-muted/20 transition-colors"
            >
              <td className="p-3 font-sans font-semibold text-foreground">
                {line.product_name}
              </td>
              <td className="p-3 text-[10px] text-muted-foreground">
                {line.sku}
              </td>
              <td className="p-3 text-right">
                {line.grn_good_quantity} {line.uom_name}
              </td>
              <td className="p-3 text-right text-rose-400">
                {line.already_returned_quantity}
              </td>
              <td className="p-3 text-right text-emerald-500 font-bold">
                {line.returnable_quantity}
              </td>
              <td className="p-3 text-right">
                <input
                  type="number"
                  min={0}
                  max={line.returnable_quantity}
                  value={quantities[line.goods_receive_note_line_id] ?? 0}
                  onChange={(e) => {
                    const val = Math.min(
                      line.returnable_quantity,
                      Math.max(0, parseInt(e.target.value) || 0),
                    );
                    onQuantityChange(line.goods_receive_note_line_id, val);
                  }}
                  className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded px-2 py-1 text-right font-mono text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
