"use client";

import { Themes, type ThemeId } from "../definitions";
import { useDismiss } from "./use-dismiss";
import { useThemeColor } from "./use-theme-color";
import { useToggle } from "./use-toggle";

/**
 * テーマドロップダウンの状態管理・テーマ選択を提供する
 */
export const useThemeDropdown = () => {
  const themeColor = useThemeColor((state) => state);
  const { opened, close, toggle } = useToggle();
  const dropdownRef = useDismiss<HTMLDivElement>(opened, close);

  const currentThemeLabel =
    Themes.find(({ value }) => value === themeColor.id)?.label ?? "";

  const selectTheme = (themeId: ThemeId) => {
    themeColor.change(themeId);
    close();
  };

  return {
    themeId: themeColor.id,
    currentThemeLabel,
    opened,
    toggle,
    dropdownRef,
    selectTheme,
  };
};
