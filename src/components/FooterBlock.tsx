import { Editable } from "./Editable";
import type { DesignId, ExtraId, InvoiceData } from "../types";

type Props = {
  design: DesignId;
  data: InvoiceData;
  extras: Record<ExtraId, boolean>;
  onChange: (patch: Partial<InvoiceData>) => void;
};

function PaymentFields({ data, onChange }: Pick<Props, "data" | "onChange">) {
  return (
    <>
      <Editable
        className="pay-title"
        value={data.paymentTitle}
        ariaLabel="Payment title"
        onChange={(paymentTitle) => onChange({ paymentTitle })}
      />
      <div className="pay-lines">
        <Editable
          value={data.bank}
          ariaLabel="Bank"
          onChange={(bank) => onChange({ bank })}
        />
        <Editable
          value={data.idLabel1}
          ariaLabel="ID label 1"
          onChange={(idLabel1) => onChange({ idLabel1 })}
        />
        <Editable
          value={data.idLabel2}
          ariaLabel="ID label 2"
          onChange={(idLabel2) => onChange({ idLabel2 })}
        />
      </div>
    </>
  );
}

export function FooterBlock({ design, data, extras, onChange }: Props) {
  const compact = design === "modular-bold";

  return (
    <div className="footer-inner">
      {compact ? (
        <div className="company-left">
          <div className="issued-title trim">Issued by</div>
          <Editable
            className="issued-copy"
            multiline
            value={data.issuedBy}
            ariaLabel="Issued by"
            onChange={(issuedBy) => onChange({ issuedBy })}
          />
        </div>
      ) : (
        <div className="logotype">
          <img src="/assets/symbol.svg" alt="" width={20} height={20} />
          <Editable
            className="word"
            value={data.logoName}
            ariaLabel="Logo name"
            onChange={(logoName) => onChange({ logoName })}
          />
        </div>
      )}

      {compact ? (
        <div className="company-right">
          <PaymentFields data={data} onChange={onChange} />
        </div>
      ) : (
        <div className="company-right">
          <div className="issued-title trim">Issued by</div>
          <Editable
            className="issued-copy"
            multiline
            value={data.issuedBy}
            ariaLabel="Issued by"
            onChange={(issuedBy) => onChange({ issuedBy })}
          />
          <div className="pay-block">
            <PaymentFields data={data} onChange={onChange} />
          </div>
        </div>
      )}

      {extras.qr ? (
        <div className={compact ? "qr-bold" : "qr"}>
          <img
            src={compact ? "/assets/qr-bold.svg" : "/assets/qr.svg"}
            alt="Scan to pay"
            width={compact ? 58 : 50}
            height={compact ? 58 : 50}
          />
        </div>
      ) : null}

      {compact ? null : (
        <div className="website">
          <Editable
            value={data.website}
            ariaLabel="Website"
            onChange={(website) => onChange({ website })}
          />
        </div>
      )}
    </div>
  );
}
