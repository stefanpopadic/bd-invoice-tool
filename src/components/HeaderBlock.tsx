import { Editable } from "./Editable";
import type { InvoiceData } from "../types";

type Props = {
  data: InvoiceData;
  onChange: (patch: Partial<InvoiceData>) => void;
};

export function HeaderBlock({ data, onChange }: Props) {
  return (
    <div className="header-inner">
      <div className="header-no">Invoice</div>
      <Editable
        className="header-num"
        value={data.number}
        ariaLabel="Invoice number"
        onChange={(number) => onChange({ number })}
      />

      <div className="kicker">Bill to</div>
      <Editable
        className="bill-copy"
        multiline
        value={data.billTo}
        ariaLabel="Bill to"
        onChange={(billTo) => onChange({ billTo })}
      />

      <div className="date-label issue-label">Issue date</div>
      <Editable
        className="date-val issue-val"
        align="right"
        value={data.issueDate}
        ariaLabel="Issue date"
        onChange={(issueDate) => onChange({ issueDate })}
      />
      <div className="date-label due-label">Due date</div>
      <Editable
        className="date-val due-val"
        align="right"
        value={data.dueDate}
        ariaLabel="Due date"
        onChange={(dueDate) => onChange({ dueDate })}
      />
    </div>
  );
}
