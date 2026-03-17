"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useToastStore } from "@/foundations/stores";

const FEEDBACK_DURATION = 2000;

const SvgIconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ClipboardIcon = () => (
  <svg {...SvgIconProps}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg {...SvgIconProps}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type CopyButtonProps = {
  text: string | (() => string);
  label: string;
  copiedLabel?: string;
  className?: string;
  variant?: "primary" | "secondary";
};

/**
 * テキストをクリップボードにコピーし、一定時間フィードバックを表示する
 */
export const CopyButton = ({
  text,
  label,
  copiedLabel = "コピー済み",
  className,
  variant = "secondary",
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useToastStore((state) => state.notify);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors duration-150",
        isCopied
          ? "text-success"
          : variant === "primary"
            ? "text-accent hover:text-accent/80"
            : "text-ink-secondary hover:text-ink",
        className,
      )}
    >
      {isCopied ? <CheckIcon /> : <ClipboardIcon />}
      {isCopied ? copiedLabel : label}
    </button>
  );
};
