import type { ReactNode, RefObject } from "react";

type RootProps = {
  contentRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * 削除確認オーバーレイの背景とカードを提供する
 */
export const Root = ({ contentRef, children }: RootProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
    <div
      ref={contentRef}
      className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-surface p-8 shadow-xl"
    >
      {children}
    </div>
  </div>
);
