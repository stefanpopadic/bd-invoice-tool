import { blocksFor } from "../defaults";
import type { InvoiceActions, InvoiceState } from "../types";
import { BlockFrame } from "./BlockFrame";
import { FooterBlock } from "./FooterBlock";
import { HeaderBlock } from "./HeaderBlock";
import { ItemsBlock } from "./ItemsBlock";
import { LogoBlock } from "./LogoBlock";
import { TotalsBlock } from "./TotalsBlock";

type Props = {
  state: InvoiceState;
  actions: InvoiceActions;
};

export function InvoicePage({ state, actions }: Props) {
  const { design, paper, extras, data } = state;
  const blocks = blocksFor(design);
  const modular = design === "modular" || design === "modular-bold";

  const header = (
    <HeaderBlock data={data} onChange={actions.patchData} />
  );

  const items = (
    <ItemsBlock
      data={data}
      showDescriptions={extras.descriptions}
      onUpdate={actions.updateItem}
      onAdd={actions.addItem}
      onRemove={actions.removeItem}
    />
  );

  const totals = (
    <TotalsBlock data={data} extras={extras} onChange={actions.patchData} />
  );

  const footer = (
    <FooterBlock
      design={design}
      data={data}
      extras={extras}
      onChange={actions.patchData}
    />
  );

  return (
    <div className={`page design-${design}${blocks.footer ? " has-footer" : ""}`} style={{ background: paper }}>
      {modular ? (
        <div className="stack">
          {blocks.header ? (
            <BlockFrame
              className="card header-card"
              label="header"
              onRemove={() => actions.setBlock("header", false)}
            >
              {header}
            </BlockFrame>
          ) : null}
          {blocks.items ? (
            <BlockFrame
              className="card items-card"
              label="line items"
              onRemove={() => actions.setBlock("items", false)}
            >
              {items}
            </BlockFrame>
          ) : null}
          {blocks.totals ? (
            <BlockFrame
              className="card totals-card"
              label="totals"
              onRemove={() => actions.setBlock("totals", false)}
            >
              {totals}
            </BlockFrame>
          ) : null}
          {blocks.footer && design === "modular-bold" ? (
            <BlockFrame
              className="card footer-card"
              label="footer"
              onRemove={() => actions.setBlock("footer", false)}
            >
              {footer}
            </BlockFrame>
          ) : null}
        </div>
      ) : (
        <div className="sheet">
          {blocks.header || blocks.items ? (
            <div className={`card details-card${blocks.header ? "" : " no-header"}`}>
              {blocks.header ? (
                <BlockFrame label="header" onRemove={() => actions.setBlock("header", false)}>
                  {header}
                </BlockFrame>
              ) : null}
              {blocks.items ? (
                <div className="items-anchor">
                  <BlockFrame label="line items" onRemove={() => actions.setBlock("items", false)}>
                    {items}
                  </BlockFrame>
                </div>
              ) : null}
            </div>
          ) : null}
          {blocks.totals ? (
            <BlockFrame
              className="card totals-card"
              label="totals"
              onRemove={() => actions.setBlock("totals", false)}
            >
              {totals}
            </BlockFrame>
          ) : null}
        </div>
      )}

      {blocks.footer && design !== "modular-bold" ? (
        <BlockFrame
          className="footer-loose"
          label="footer"
          onRemove={() => actions.setBlock("footer", false)}
        >
          {footer}
        </BlockFrame>
      ) : null}

      {blocks.logo ? (
        <BlockFrame label="logo" onRemove={() => actions.setBlock("logo", false)}>
          <LogoBlock src={data.logoImage} onUpload={(logoImage) => actions.patchData({ logoImage })} />
        </BlockFrame>
      ) : null}
    </div>
  );
}
