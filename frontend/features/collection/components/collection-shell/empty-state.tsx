import type { ReactNode } from "react";

type EmptyStateProps = {
  children: ReactNode;
};

/**
 * 検索結果が0件の場合にセンター配置で表示する
 */
export const EmptyState = ({ children }: EmptyStateProps) => (
  <div className="flex justify-center py-16">{children}</div>
);
