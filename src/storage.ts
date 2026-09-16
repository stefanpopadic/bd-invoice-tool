import { createState } from "./defaults";
import type { InvoiceState } from "./types";

const KEY = "beforedesign-invoice-v1";

export function loadState(): InvoiceState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createState();
    const parsed = JSON.parse(raw) as InvoiceState;
    const fallback = createState(parsed.design);
    return {
      ...fallback,
      ...parsed,
      blocks: { ...fallback.blocks, ...parsed.blocks },
      extras: { ...fallback.extras, ...parsed.extras },
      data: { ...fallback.data, ...parsed.data, items: parsed.data?.items ?? fallback.data.items },
    };
  } catch {
    return createState();
  }
}

export function saveState(state: InvoiceState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
