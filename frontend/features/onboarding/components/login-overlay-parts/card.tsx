import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

/**
 * サインインオーバーレイのカードコンテナを提供する
 */
export const Card = ({ children }: CardProps) => (
  <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-edge bg-surface p-8">
    {children}
  </div>
);
