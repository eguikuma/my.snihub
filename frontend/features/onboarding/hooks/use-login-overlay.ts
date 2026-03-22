"use client";

import { useState } from "react";
import { BffEndpoints } from "@/foundations/definitions";
import { useDismiss, useScrollLock } from "@/foundations/hooks";
import { useOverlayStore } from "@/foundations/stores";

/**
 * ログインオーバーレイの開閉・スクロールロック制御を提供する
 */
export const useLoginOverlay = () => {
  const isOpen = useOverlayStore((state) => state.isOpen);
  const close = useOverlayStore((state) => state.close);
  const [isPending, setIsPending] = useState(false);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, close, {
    disabled: isPending,
  });
  useScrollLock(isOpen);

  const startLogin = () => {
    setIsPending(true);
    window.location.href = BffEndpoints.OAuthGithub;
  };

  return { isOpen, contentRef, isPending, startLogin };
};
