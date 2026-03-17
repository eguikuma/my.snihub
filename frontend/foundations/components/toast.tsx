"use client";

import { useEffect } from "react";
import { useToastStore } from "@/foundations/stores";

const TOAST_DURATION = 2000;

/**
 * 画面下部にトースト通知を表示し、一定時間後に自動で消去する
 */
export const Toast = () => {
  const message = useToastStore((state) => state.message);
  const hide = useToastStore((state) => state.hide);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(hide, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-ink px-4 py-2 text-sm text-surface shadow-lg transition-opacity duration-150"
    >
      {message}
    </div>
  );
};
