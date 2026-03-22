"use client";

import { useEffect, useRef, useState } from "react";
import { useToastStore } from "../stores";

const FEEDBACK_DURATION = 2000;

type UseClipboardOptions = {
  copiedLabel?: string;
};

/**
 * クリップボードへのコピーとフィードバック状態を管理する
 */
export const useClipboard = ({
  copiedLabel = "コピー済み",
}: UseClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useToastStore((state) => state.notify);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async (text: string | (() => string)) => {
    try {
      const value = typeof text === "function" ? text() : text;
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      notify(copiedLabel);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => setIsCopied(false),
        FEEDBACK_DURATION,
      );
    } catch {
      /* クリップボード API が利用できない環境では何もしない */
    }
  };

  return { isCopied, copy };
};
