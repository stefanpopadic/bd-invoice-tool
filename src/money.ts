export function money(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseMoney(value: string): number {
  const parsed = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parsePercent(value: string): number {
  const parsed = Number(value.replace(/%/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function totals(
  items: { qty: number; amount: number }[],
  discountPercent: number,
  taxPercent: number,
  showDiscount: boolean,
  showTax: boolean,
) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.amount, 0);
  const discount = showDiscount ? (subtotal * discountPercent) / 100 : 0;
  const taxable = subtotal - discount;
  const tax = showTax ? (taxable * taxPercent) / 100 : 0;
  return {
    subtotal,
    discount,
    tax,
    total: taxable + tax,
  };
}
