import { Editable } from "./Editable";
import { money, parsePercent, totals } from "../money";
import type { ExtraId, InvoiceData } from "../types";

type Props = {
  data: InvoiceData;
  extras: Record<ExtraId, boolean>;
  onChange: (patch: Partial<InvoiceData>) => void;
};

export function TotalsBlock({ data, extras, onChange }: Props) {
  const calc = totals(
    data.items,
    data.discountPercent,
    data.taxPercent,
    extras.discount,
    extras.tax,
  );

  return (
    <>
      {extras.note ? (
        <div className="note">
          <img src="/assets/smiley.svg" alt="" width={12} height={12} />
          <Editable
            className="note-text"
            value={data.note}
            ariaLabel="Note"
            onChange={(note) => onChange({ note })}
          />
        </div>
      ) : null}
      <div className="totals-grid">
        <div className="totals-row">
          <div className="label">Subtotal</div>
          <Editable
            className="mid"
            align="right"
            value={data.currency}
            ariaLabel="Currency"
            onChange={(currency) => onChange({ currency })}
          />
          <div className="amt">{money(calc.subtotal)}</div>
        </div>
        {extras.discount ? (
          <div className="totals-row">
            <div className="label">Discount</div>
            <Editable
              className="mid"
              align="right"
              value={`${data.discountPercent}%`}
              ariaLabel="Discount percent"
              onChange={(value) => onChange({ discountPercent: parsePercent(value) })}
            />
            <div className="amt">-{money(calc.discount)}</div>
          </div>
        ) : null}
        {extras.tax ? (
          <div className="totals-row">
            <div className="label">Tax</div>
            <Editable
              className="mid"
              align="right"
              value={`${data.taxPercent}%`}
              ariaLabel="Tax percent"
              onChange={(value) => onChange({ taxPercent: parsePercent(value) })}
            />
            <div className="amt">+{money(calc.tax)}</div>
          </div>
        ) : null}
        <div className="totals-row grand">
          <div className="label">Total</div>
          <Editable
            className="mid"
            align="right"
            value={data.currencySymbol}
            ariaLabel="Currency symbol"
            onChange={(currencySymbol) => onChange({ currencySymbol })}
          />
          <div className="amt">{money(calc.total)}</div>
        </div>
      </div>
    </>
  );
}
