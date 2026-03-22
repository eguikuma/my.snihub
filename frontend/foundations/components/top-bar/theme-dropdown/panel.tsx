import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
};

/**
 * テーマ選択肢を表示するドロップダウンパネル
 */
export const Panel = ({ children }: PanelProps) => (
  <div
    className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-edge bg-surface-raised py-1 shadow-lg"
    role="listbox"
    aria-label="テーマ選択"
  >
    {children}
  </div>
);
