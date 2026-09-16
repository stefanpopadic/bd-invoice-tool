import { PanelRight, PanelRightClose } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { blockMeta, createState, designs, extrasFor, extraMeta } from "../defaults";
import { CheckMark } from "../icons";
import { loadState, saveState } from "../storage";
import type { InvoiceActions, InvoiceState, LineItem } from "../types";
import { InvoicePage } from "./InvoicePage";

function nextItem(count: number): LineItem {
  return {
    id: crypto.randomUUID(),
    name: `Line item ${count + 1}`,
    description: "",
    spec: "",
    qty: 1,
    amount: 0,
  };
}

export function Editor() {
  const [state, setState] = useState<InvoiceState>(() =>
    typeof window === "undefined" ? createState() : loadState(),
  );
  const [panelOpen, setPanelOpen] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const setUnit = () => {
      if (window.matchMedia("print").matches) {
        frame.style.removeProperty("--px");
        return;
      }
      const width = frame.getBoundingClientRect().width;
      if (width > 0) {
        frame.style.setProperty("--px", `${width / 595}px`);
      }
    };

    setUnit();
    const observer = new ResizeObserver(setUnit);
    observer.observe(frame);
    window.addEventListener("beforeprint", setUnit);
    window.addEventListener("afterprint", setUnit);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", setUnit);
      window.removeEventListener("afterprint", setUnit);
    };
  }, [panelOpen]);

  const actions = useMemo<InvoiceActions>(
    () => ({
      setDesign: (design) => {
        setState((current) => ({
          ...current,
          design,
          extras: {
            ...current.extras,
            descriptions: extrasFor(design).descriptions,
          },
          blocks: {
            ...current.blocks,
            logo: design === "modular-bold" ? true : current.blocks.logo,
          },
        }));
      },
      toggleBlock: (id) => {
        setState((current) => ({
          ...current,
          blocks: { ...current.blocks, [id]: !current.blocks[id] },
        }));
      },
      setBlock: (id, on) => {
        setState((current) => ({
          ...current,
          blocks: { ...current.blocks, [id]: on },
        }));
      },
      toggleExtra: (id) => {
        setState((current) => ({
          ...current,
          extras: { ...current.extras, [id]: !current.extras[id] },
        }));
      },
      patchData: (patch) => {
        setState((current) => ({
          ...current,
          data: { ...current.data, ...patch },
        }));
      },
      updateItem: (id, patch) => {
        setState((current) => ({
          ...current,
          data: {
            ...current.data,
            items: current.data.items.map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
        }));
      },
      addItem: () => {
        setState((current) => ({
          ...current,
          data: {
            ...current.data,
            items: [...current.data.items, nextItem(current.data.items.length)],
          },
        }));
      },
      removeItem: (id) => {
        setState((current) => ({
          ...current,
          data: {
            ...current.data,
            items: current.data.items.filter((item) => item.id !== id),
          },
        }));
      },
      reset: () => setState(createState(state.design)),
    }),
    [state.design],
  );

  return (
    <div className={`workspace design-${state.design}${panelOpen ? " has-panel" : ""}`}>
      {panelOpen ? null : (
        <button className="panel-toggle" type="button" aria-label="Show controls" onClick={() => setPanelOpen(true)}>
          <PanelRight size={16} strokeWidth={1.75} />
        </button>
      )}

      <main className="stage">
        <div className="sheet-frame" ref={frameRef}>
          <InvoicePage state={state} actions={actions} />
        </div>
      </main>

      {panelOpen ? (
        <aside className="panel">
          <div className="panel-head">
            <div className="brand">
              <img className="brand-mark" src="/assets/symbol.svg" alt="" width={20} height={20} />
              <strong>Invoice Generator</strong>
            </div>
            <button className="icon-btn" type="button" aria-label="Hide controls" onClick={() => setPanelOpen(false)}>
              <PanelRightClose size={16} strokeWidth={1.75} />
            </button>
          </div>

          <div className="panel-body">
            <div className="group">
              <small>Design</small>
              <div className="design-grid">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    className={`design-tile ${state.design === design.id ? "is-on" : ""}`}
                    onClick={() => actions.setDesign(design.id)}
                  >
                    <span className={`design-preview design-preview-${design.id}`} aria-hidden>
                      <span className="preview-sheet">
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                    <span>{design.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="group">
              <small>Blocks</small>
              <div className="checks">
                {blockMeta.map((block) => (
                  <button
                    className={`check ${state.blocks[block.id] ? "is-on" : ""}`}
                    type="button"
                    key={block.id}
                    aria-pressed={state.blocks[block.id]}
                    onClick={() => actions.toggleBlock(block.id)}
                  >
                    <CheckMark />
                    {block.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="group">
              <small>Inside blocks</small>
              <div className="checks">
                {extraMeta.map((extra) => (
                  <button
                    className={`check ${state.extras[extra.id] ? "is-on" : ""}`}
                    type="button"
                    key={extra.id}
                    aria-pressed={state.extras[extra.id]}
                    onClick={() => actions.toggleExtra(extra.id)}
                  >
                    <CheckMark />
                    {extra.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-foot">
            <button className="btn-ghost" type="button" onClick={actions.reset}>
              Reset sample
            </button>
            <button className="btn btn-primary" type="button" onClick={() => window.print()}>
              Print / PDF
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
