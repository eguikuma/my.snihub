import type { ReactNode } from "react";

type MainColumnProps = {
  children: ReactNode;
};

/**
 * コードブロックとメタ情報を縦並びに配置する左カラム
 */
export const MainColumn = ({ children }: MainColumnProps) => (
  <div className="flex min-w-0 flex-col gap-4">{children}</div>
);
