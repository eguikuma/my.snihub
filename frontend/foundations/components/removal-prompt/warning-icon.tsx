import type { ReactNode } from "react";

type WarningIconProps = {
  children: ReactNode;
};

/**
 * 中央に配置された円形の警告アイコンを表示する
 */
export const WarningIcon = ({ children }: WarningIconProps) => (
  <div className="flex justify-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
      {children}
    </div>
  </div>
);
