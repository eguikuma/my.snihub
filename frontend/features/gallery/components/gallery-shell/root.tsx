import type { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

/**
 * ギャラリー画面の外枠レイアウトを提供する
 */
export const Root = ({ children }: RootProps) => (
  <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
    {children}
  </div>
);
