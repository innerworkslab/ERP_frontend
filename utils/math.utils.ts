export interface LineCalcInput {
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
}

export function calculateLineTotal(input: LineCalcInput): number {
  const gross = input.quantity * input.unit_price;
  return gross - input.discount_amount + input.tax_amount;
}

export function calculateOrderTotals(
  lines: LineCalcInput[],
  globalDiscount: number,
  globalTax: number,
) {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.quantity * line.unit_price,
    0,
  );
  const totalLineTax = lines.reduce((sum, line) => sum + line.tax_amount, 0);
  const totalLineDiscount = lines.reduce(
    (sum, line) => sum + line.discount_amount,
    0,
  );

  // Grand Total Matrix
  const netTotal =
    subtotal - totalLineDiscount - globalDiscount + (totalLineTax + globalTax);

  return {
    subtotal_amount: subtotal,
    discount_amount: totalLineDiscount + globalDiscount,
    tax_amount: totalLineTax + globalTax,
    total_amount: Math.max(0, netTotal),
  };
}
