import type { ReactNode, RefObject } from "react";

type RootProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * アカウントドロップダウンの相対位置コンテナを提供する
 */
export const Root = ({ menuRef, children }: RootProps) => (
  <div className="relative" ref={menuRef}>
    {children}
  </div>
);
