"use client";

import { useEffect, useRef } from "react";

/**
 * 要素の外側クリックまたはEscapeキーで閉じるハンドラを登録し、対象のrefを返す
 */
export const useDismiss = <T extends HTMLElement = HTMLElement>(
  opened: boolean,
  onClose: () => void,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!opened) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [opened, onClose]);

  return ref;
};
