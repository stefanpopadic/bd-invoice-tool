import { useRef } from "react";
import { readImageFile } from "../image";

type Props = {
  src?: string;
  onUpload: (src: string) => void;
};

export function LogoBlock({ src, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pick = () => inputRef.current?.click();

  return (
    <>
      {src ? (
        <button className="logo-large image-upload is-custom" type="button" aria-label="Upload logo" onClick={pick}>
          <img src={src} alt="" />
        </button>
      ) : (
        <button className="logo-large image-upload" type="button" aria-label="Upload logo" onClick={pick}>
          <span className="symbol">
            <img src="/assets/symbol-large.svg" alt="" />
          </span>
          <span className="wordmark">
            <img src="/assets/wordmark.svg" alt="" />
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          void readImageFile(file).then(onUpload);
        }}
      />
    </>
  );
}
