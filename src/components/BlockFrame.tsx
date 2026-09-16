import type { ReactNode } from "react";

type Props = {
  label: string;
  onRemove?: () => void;
  className?: string;
  children: ReactNode;
};

export function BlockFrame({ className = "", children }: Props) {
  return <div className={`block ${className}`.trim()}>{children}</div>;
}
