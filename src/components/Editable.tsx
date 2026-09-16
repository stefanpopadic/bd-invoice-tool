import { useLayoutEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  multiline?: boolean;
  align?: "left" | "right";
  formatOnCommit?: (value: string) => string;
};

function normalize(value: string, multiline: boolean) {
  const next = value.replace(/\u00a0/g, " ").replace(/\r/g, "");
  return multiline ? next.replace(/\n$/, "") : next.replace(/\n/g, "");
}

export function Editable({
  value,
  onChange,
  ariaLabel,
  className = "",
  multiline = false,
  align = "left",
  formatOnCommit,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const focused = useRef(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || focused.current) return;
    if ((node.textContent ?? "") !== value) {
      node.textContent = value;
    }
  }, [value]);

  const commit = (node: HTMLSpanElement) => {
    const raw = normalize(node.innerText, multiline);
    const next = formatOnCommit ? formatOnCommit(raw) : raw;
    if ((node.textContent ?? "") !== next) {
      node.textContent = next;
    }
    onChange(next);
  };

  return (
    <span
      ref={ref}
      className={`editable ${multiline ? "is-multiline" : "is-single"} ${align === "right" ? "editable-right" : ""} ${className}`.trim()}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      aria-label={ariaLabel}
      aria-multiline={multiline || undefined}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={(event) => {
        focused.current = false;
        commit(event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (!multiline && event.key === "Enter") {
          event.preventDefault();
          commit(event.currentTarget);
          event.currentTarget.blur();
        }
      }}
      onInput={(event) => {
        onChange(normalize(event.currentTarget.innerText, multiline));
      }}
      onPaste={(event) => {
        event.preventDefault();
        const text = normalize(event.clipboardData.getData("text/plain"), multiline);
        document.execCommand("insertText", false, text);
      }}
    />
  );
}
