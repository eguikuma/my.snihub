import type { ReactNode } from "react";

type FilterPanelProps = {
  children: ReactNode;
};

/**
 * 検索・フィルター・公開範囲タブを縦並びに配置するパネル
 */
export const FilterPanel = ({ children }: FilterPanelProps) => (
  <div className="flex flex-col gap-3">{children}</div>
);
