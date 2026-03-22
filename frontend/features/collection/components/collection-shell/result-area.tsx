import type { ReactNode } from "react";

type ResultAreaProps = {
  children: ReactNode;
};

/**
 * カードグリッドとページネーションを縦並びに配置する
 */
export const ResultArea = ({ children }: ResultAreaProps) => (
  <div className="flex flex-col gap-6">{children}</div>
);
