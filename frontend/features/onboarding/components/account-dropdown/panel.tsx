import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
};

/**
 * ドロップダウンメニューのパネルを表示する
 */
export const Panel = ({ children }: PanelProps) => (
  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-edge bg-surface-raised py-1 shadow-lg">
    {children}
  </div>
);
