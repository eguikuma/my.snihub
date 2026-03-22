import type { ReactNode, RefObject } from "react";

type RootProps = {
  dropdownRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * テーマドロップダウンの相対位置コンテナを提供する
 */
export const Root = ({ dropdownRef, children }: RootProps) => (
  <div ref={dropdownRef} className="relative">
    {children}
  </div>
);
