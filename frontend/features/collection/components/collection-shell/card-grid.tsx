import type { ReactNode } from "react";

type CardGridProps = {
  children: ReactNode;
};

/**
 * スニペットカードをレスポンシブグリッドで配置する
 */
export const CardGrid = ({ children }: CardGridProps) => (
  <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3 wide:grid-cols-4">
    {children}
  </div>
);
