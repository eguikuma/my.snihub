"use client";

import { useEffect, useRef } from "react";

type UseDismissOptions = {
  disabled?: boolean;
};

/**
 * 要素の外側クリックまたはEscapeキーで閉じるハンドラを登録し、対象のrefを返す
 */
export const useDismiss = <T extends HTMLElement = HTMLElement>(
  opened: boolean,
  onClose: () => void,
  options?: UseDismissOptions,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!opened) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (options?.disabled) return;

      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (options?.disabled) return;

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
  }, [opened, onClose, options?.disabled]);

  return ref;
};
