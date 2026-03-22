"use client";

import { useEffect } from "react";

/**
 * オーバーレイ表示中にbodyのスクロールを禁止する
 */
export const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
};
