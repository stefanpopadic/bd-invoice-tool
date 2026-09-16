import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { blocksFor, createState, designs, extrasFor, extraMeta, paperFor } from "../defaults";
import { CheckMark } from "../icons";
import { exportPagePdf } from "../pdf";
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
  const [fit, setFit] = useState(false);
  const [exporting, setExporting] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const layout = () => {
      if (window.matchMedia("print").matches) {
        frame.style.removeProperty("--px");
        return;
      }
      const width = frame.getBoundingClientRect().width;
      if (width > 0) {
        frame.style.setProperty("--px", `${width / 595}px`);
      }
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(frame);
    window.addEventListener("beforeprint", layout);
    window.addEventListener("afterprint", layout);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", layout);
      window.removeEventListener("afterprint", layout);
    };
  }, [panelOpen, fit]);

  const actions = useMemo<InvoiceActions>(
    () => ({
      setDesign: (design) => {
        setState((current) => ({
          ...current,
          design,
          paper: paperFor(design),
          extras: {
            ...current.extras,
            descriptions: extrasFor(design).descriptions,
          },
          blocks: blocksFor(design),
        }));
      },
      setPaper: (paper) => {
        setState((current) => ({ ...current, paper }));
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
    <div
      className={`workspace design-${state.design}${panelOpen ? " has-panel" : ""}`}
      style={{ ["--paper" as string]: state.paper }}
    >
      {panelOpen ? null : (
        <button className="panel-toggle" type="button" aria-label="Show controls" onClick={() => setPanelOpen(true)}>
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
      )}

      <main className="stage">
        <div className="stage-scroll">
          <div className={`sheet-frame${fit ? " is-fit" : ""}`} ref={frameRef}>
            <InvoicePage state={state} actions={actions} />
          </div>
        </div>
        <button
          className="zoom-btn"
          type="button"
          aria-label={fit ? "Zoom in" : "Zoom out"}
          onClick={() => setFit((current) => !current)}
        >
          {fit ? <ZoomIn size={16} strokeWidth={1.75} /> : <ZoomOut size={16} strokeWidth={1.75} />}
        </button>
      </main>

      {panelOpen ? (
        <aside className="panel">
          <div className="panel-head">
            <div className="brand">
              <img className="brand-mark" src="/assets/symbol.svg" alt="" width={20} height={20} />
              <strong>Invoice Generator</strong>
            </div>
            <button className="icon-btn" type="button" aria-label="Hide controls" onClick={() => setPanelOpen(false)}>
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          </div>

          <div className="panel-body">
            <div className="group">
              <small>Presets</small>
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
              <label className="color-picker">
                <span className="color-swatch" style={{ background: state.paper }}>
                  <input
                    type="color"
                    value={state.paper}
                    aria-label="Background color"
                    onChange={(event) => actions.setPaper(event.target.value)}
                  />
                </span>
                <span>Background</span>
                <span className="color-hex">{state.paper}</span>
              </label>
            </div>

            <div className="group">
              <small>Add-ons</small>
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
              Reset to Default
            </button>
            <button
              className="btn btn-primary"
              type="button"
              disabled={exporting}
              onClick={() => {
                const page = frameRef.current?.querySelector(".page");
                if (!(page instanceof HTMLElement) || exporting) return;
                setExporting(true);
                void exportPagePdf(page, `Invoice-${state.data.number.replaceAll("/", "-")}.pdf`).finally(() => {
                  setExporting(false);
                });
              }}
            >
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
