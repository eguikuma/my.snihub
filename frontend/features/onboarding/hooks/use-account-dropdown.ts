"use client";

import { useDismiss, useToggle } from "@/foundations/hooks";
import { useLogout } from "./use-logout";

/**
 * アカウントドロップダウンの開閉・ログアウト処理を提供する
 */
export const useAccountDropdown = () => {
  const { opened, close, toggle } = useToggle(false);
  const { handleLogout, isLoggingOut } = useLogout();
  const menuRef = useDismiss<HTMLDivElement>(opened, close);

  return { opened, close, toggle, menuRef, handleLogout, isLoggingOut };
};
