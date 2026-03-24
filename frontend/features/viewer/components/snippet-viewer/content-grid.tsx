import type { ReactNode } from "react";

type ContentGridProps = {
  children: ReactNode;
};

/**
 * メインカラムとサイドバーの2カラムグリッドを提供する
 */
export const ContentGrid = ({ children }: ContentGridProps) => (
  <div className="grid grid-cols-1 gap-5 tablet:grid-cols-[minmax(0,1fr)_176px] desktop:grid-cols-[minmax(0,1fr)_240px] desktop:gap-6">
    {children}
  </div>
);
