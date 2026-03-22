import type { ReactNode } from "react";

type FilterPanelProps = {
  children: ReactNode;
};

/**
 * 検索・フィルター要素を縦並びに配置するパネル
 */
export const FilterPanel = ({ children }: FilterPanelProps) => (
  <div className="flex flex-col gap-3">{children}</div>
);
