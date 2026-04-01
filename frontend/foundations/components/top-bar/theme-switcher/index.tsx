"use client";

import { DarkThemes, LightThemes } from "../../../definitions";
import { useThemeDropdown } from "../../../hooks";
import { ThemeDropdown } from "../theme-dropdown";

/**
 * テーマカラーを切り替えるドロップダウンを提供する
 */
export const ThemeSwitcher = () => {
  const { themeId, opened, toggle, dropdownRef, selectTheme } =
    useThemeDropdown();

  return (
    <ThemeDropdown.Root dropdownRef={dropdownRef}>
      <ThemeDropdown.Trigger opened={opened} onToggle={toggle} />
      {opened && (
        <ThemeDropdown.Panel>
          <ThemeDropdown.Group
            currentThemeId={themeId}
            label="ライト"
            themes={LightThemes}
            onSelect={selectTheme}
          />
          <ThemeDropdown.Separator />
          <ThemeDropdown.Group
            currentThemeId={themeId}
            label="ダーク"
            themes={DarkThemes}
            onSelect={selectTheme}
          />
        </ThemeDropdown.Panel>
      )}
    </ThemeDropdown.Root>
  );
};
