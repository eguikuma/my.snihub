import type { ReactNode } from "react";

type FieldGroupProps = {
  name: string;
  label: string;
  children: ReactNode;
};

/**
 * ラベル付きのフィールドグループを表示する
 */
export const FieldGroup = ({ name, label, children }: FieldGroupProps) => (
  <div data-field={name} className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-ink">{label}</span>
    {children}
  </div>
);
