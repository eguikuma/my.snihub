import type { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

/**
 * スニペットフォームの外枠レイアウトを提供する
 */
export const Root = ({ children }: RootProps) => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 desktop:p-6">
    {children}
  </div>
);
