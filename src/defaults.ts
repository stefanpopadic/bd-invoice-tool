import type { BlockId, DesignId, ExtraId, InvoiceData, InvoiceState, LineItem } from "./types";

function item(
  id: string,
  name: string,
  qty: number,
  amount: number,
  description = "",
  spec = "",
): LineItem {
  return { id, name, qty, amount, description, spec };
}

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const sampleData: InvoiceData = {
  number: "3033/26",
  issueDate: "2026-08-15",
  dueDate: "2026-08-23",
  billTo: "Dogs Alliance LLC\nDodge Fifth Avenue, Suite 27\nCity of Dogs, 44000\nDogestan Republic",
  issuedBy: "Cats Corporation LLC\n333 Cats Atreet, Suite CC88\nCats York, CY 10118, USA",
  website: "beforedesign.co",
  paymentTitle: "Payment instructions",
  bank: "Bank of Cats Committee",
  idLabel1: "ID Label #1 (SWAT)",
  idLabel2: "ID Label #2 (IBAN)",
  logoName: "logo",
  note: "Every paid invoice makes a cat somewhere smile.",
  currency: "USD",
  currencySymbol: "$",
  discountPercent: 15,
  taxPercent: 10,
  items: [item("1", "Line item 1", 1, 1000, lorem)],
};

export const designs: { id: DesignId; label: string }[] = [
  { id: "simple", label: "Simple" },
  { id: "detailed", label: "Detailed" },
  { id: "modular", label: "Modular" },
  { id: "modular-bold", label: "Modular Bold" },
];

export const blockMeta: { id: BlockId; label: string }[] = [
  { id: "header", label: "Header" },
  { id: "items", label: "Line items" },
  { id: "totals", label: "Totals" },
  { id: "footer", label: "Footer" },
  { id: "logo", label: "Logo" },
];

export const extraMeta: { id: ExtraId; label: string }[] = [
  { id: "discount", label: "Discount" },
  { id: "tax", label: "Tax" },
  { id: "note", label: "Note" },
  { id: "qr", label: "QR" },
  { id: "descriptions", label: "Descriptions" },
];

export function blocksFor(design: DesignId): Record<BlockId, boolean> {
  return {
    header: true,
    items: true,
    totals: true,
    footer: true,
    logo: design === "modular-bold",
  };
}

export function paperFor(design: DesignId): string {
  if (design === "detailed") return "#cfebff";
  if (design === "modular") return "#eae4d2";
  if (design === "modular-bold") return "#e1e1e1";
  return "#eae9e6";
}

export function extrasFor(_design: DesignId): Record<ExtraId, boolean> {
  return {
    discount: true,
    tax: true,
    note: true,
    qr: true,
    descriptions: true,
  };
}

export function dataFor(design: DesignId): InvoiceData {
  if (design === "modular-bold") {
    return { ...sampleData, note: "beforedesign.co" };
  }
  return structuredClone(sampleData);
}

export function createState(design: DesignId = "simple"): InvoiceState {
  return {
    design,
    paper: paperFor(design),
    blocks: blocksFor(design),
    extras: extrasFor(design),
    data: dataFor(design),
  };
}
