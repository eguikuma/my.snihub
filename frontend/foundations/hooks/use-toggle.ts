"use client";

import { useState } from "react";

/**
 * 真偽値の開閉状態を管理し、open/close/toggleの操作を提供する
 */
export const useToggle = (initialValue = false) => {
  const [opened, setOpened] = useState(initialValue);

  const open = () => setOpened(true);

  const close = () => setOpened(false);

  const toggle = () => setOpened((previous) => !previous);

  return { opened, open, close, toggle } as const;
};
