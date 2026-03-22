import type { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

/**
 * サイドバーの外枠コンテナを提供する
 */
export const Root = ({ children }: RootProps) => (
  <aside className="relative flex h-fit flex-col gap-6 rounded-lg border border-edge bg-surface-raised p-4">
    {children}
  </aside>
);
