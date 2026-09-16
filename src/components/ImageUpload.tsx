import { useRef } from "react";
import { readImageFile } from "../image";

type Props = {
  src?: string;
  fallback: string;
  alt: string;
  className?: string;
  maxEdge?: number;
  onUpload: (src: string) => void;
};

export function ImageUpload({ src, fallback, alt, className = "", maxEdge = 1200, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      className={`image-upload ${className}`.trim()}
      type="button"
      aria-label={alt}
      onClick={() => inputRef.current?.click()}
    >
      <img src={src || fallback} alt="" />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          void readImageFile(file, maxEdge).then(onUpload);
        }}
      />
    </button>
  );
}
