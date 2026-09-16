import { Check } from "lucide-react";

export function CheckMark() {
  return (
    <span className="check-mark" aria-hidden>
      <Check size={11} strokeWidth={2.5} />
    </span>
  );
}
