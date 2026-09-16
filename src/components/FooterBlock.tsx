import { useRef } from "react";
import { readImageFile } from "../image";
import type { DesignId, ExtraId, InvoiceData } from "../types";
import { Editable } from "./Editable";
import { ImageUpload } from "./ImageUpload";

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
  const logoInput = useRef<HTMLInputElement>(null);
  const pickLogo = () => logoInput.current?.click();

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
        <>
          <button
            className={`logotype image-upload${data.logoImage ? " is-custom" : ""}`}
            type="button"
            aria-label="Upload logo"
            onClick={pickLogo}
          >
            {data.logoImage ? (
              <img src={data.logoImage} alt="" />
            ) : (
              <>
                <img className="logo-mark" src="/assets/symbol.svg" alt="" />
                <span className="word">{data.logoName}</span>
              </>
            )}
          </button>
          <input
            ref={logoInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void readImageFile(file).then((logoImage) => onChange({ logoImage }));
            }}
          />
        </>
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
          <ImageUpload
            src={data.qrImage}
            fallback={compact ? "/assets/qr-bold.svg" : "/assets/qr.svg"}
            alt="Upload QR code"
            maxEdge={512}
            onUpload={(qrImage) => onChange({ qrImage })}
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
