"use client";

import { useDismiss, useScrollLock } from "@/foundations/hooks";
import { useOverlayStore } from "@/foundations/stores";

/**
 * ログインオーバーレイの開閉・スクロールロック制御を提供する
 */
export const useLoginOverlay = () => {
  const isOpen = useOverlayStore((state) => state.isOpen);
  const close = useOverlayStore((state) => state.close);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, close);
  useScrollLock(isOpen);

  return { isOpen, contentRef };
};
