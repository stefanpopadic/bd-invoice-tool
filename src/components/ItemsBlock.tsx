import { Plus, X } from "lucide-react";
import { Editable } from "./Editable";
import { money, parseMoney } from "../money";
import type { InvoiceData, LineItem } from "../types";

type Props = {
  data: InvoiceData;
  showDescriptions: boolean;
  onUpdate: (id: string, patch: Partial<LineItem>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export function ItemsBlock({ data, showDescriptions, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="items-block">
      <div className="col-head">
        <span>N</span>
        <span>Q</span>
        <span>A</span>
        <span className="end">T</span>
      </div>
      <div className="items">
        {data.items.map((item) => (
          <div className="line" key={item.id}>
            <div className="line-name-col">
              <Editable
                className="line-name"
                value={item.name}
                ariaLabel="Line item name"
                onChange={(name) => onUpdate(item.id, { name })}
              />
              {showDescriptions ? (
                <>
                  <Editable
                    className="line-copy"
                    multiline
                    value={item.description}
                    ariaLabel="Line item description"
                    onChange={(description) => onUpdate(item.id, { description })}
                  />
                  {item.spec ? (
                    <Editable
                      className="line-spec"
                      value={item.spec}
                      ariaLabel="Line item spec"
                      onChange={(spec) => onUpdate(item.id, { spec })}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
            <Editable
              className="line-meta"
              value={String(item.qty)}
              ariaLabel="Quantity"
              onChange={(qty) => onUpdate(item.id, { qty: Number(qty) || 0 })}
            />
            <Editable
              className="line-meta"
              value={money(item.amount)}
              ariaLabel="Amount"
              formatOnCommit={(amount) => money(parseMoney(amount))}
              onChange={(amount) => onUpdate(item.id, { amount: parseMoney(amount) })}
            />
            <div className="line-total">{money(item.qty * item.amount)}</div>
            {data.items.length > 1 ? (
              <button
                className="line-remove"
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                <X size={8} strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <button className="add-item" type="button" onClick={onAdd}>
        <Plus size={12} strokeWidth={1.75} />
        Add line item
      </button>
    </div>
  );
}
