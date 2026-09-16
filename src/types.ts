export type DesignId = "simple" | "detailed" | "modular" | "modular-bold";

export type BlockId = "header" | "items" | "totals" | "footer" | "logo";

export type ExtraId = "discount" | "tax" | "note" | "qr" | "descriptions";

export type LineItem = {
  id: string;
  name: string;
  description: string;
  spec: string;
  qty: number;
  amount: number;
};

export type InvoiceData = {
  number: string;
  issueDate: string;
  dueDate: string;
  billTo: string;
  issuedBy: string;
  website: string;
  paymentTitle: string;
  bank: string;
  idLabel1: string;
  idLabel2: string;
  logoName: string;
  note: string;
  currency: string;
  currencySymbol: string;
  discountPercent: number;
  taxPercent: number;
  items: LineItem[];
};

export type InvoiceState = {
  design: DesignId;
  blocks: Record<BlockId, boolean>;
  extras: Record<ExtraId, boolean>;
  data: InvoiceData;
};

export type InvoiceActions = {
  setDesign: (design: DesignId) => void;
  toggleBlock: (id: BlockId) => void;
  setBlock: (id: BlockId, on: boolean) => void;
  toggleExtra: (id: ExtraId) => void;
  patchData: (patch: Partial<InvoiceData>) => void;
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  reset: () => void;
};
