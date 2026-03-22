"use client";

import { useEffect } from "react";
import { useLoginOverlay } from "@/foundations/stores";

/**
 * マウント時にログインオーバーレイを閉じ不可モードで開く
 */
export const GuardTrigger = () => {
  const open = useLoginOverlay((state) => state.open);

  useEffect(() => {
    open();
  }, [open]);

  return null;
};
