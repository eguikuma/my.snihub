import type { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

/**
 * オプションフィールドをまとめるカードコンテナを提供する
 */
export const Root = ({ children }: RootProps) => (
  <div className="flex flex-col gap-5 rounded-lg border border-edge bg-surface-raised p-4">
    {children}
  </div>
);
