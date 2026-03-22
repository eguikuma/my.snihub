"use client";

import { useEffect } from "react";

/**
 * テキストエリアの高さを入力内容に応じて自動調整する
 */
export const useAutoResize = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
) => {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [textareaRef, value]);
};
