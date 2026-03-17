"use client";

import clsx from "clsx";
import {
  DarkThemes,
  LightThemes,
  ThemeIds,
  Themes,
  type Theme,
  type ThemeId,
} from "../definitions";
import { useDismiss, useThemeColor, useToggle } from "../hooks";

const SwatchColors: Record<ThemeId, string> = {
  [ThemeIds.GithubLight]: "bg-[#0969da]",
  [ThemeIds.SolarizedLight]: "bg-[#268bd2]",
  [ThemeIds.CatppuccinLatte]: "bg-[#1e66f5]",
  [ThemeIds.QuietLight]: "bg-[#4078c0]",
  [ThemeIds.GithubDark]: "bg-[#58a6ff]",
  [ThemeIds.Dracula]: "bg-[#bd93f9]",
  [ThemeIds.Nord]: "bg-[#88c0d0]",
  [ThemeIds.Monokai]: "bg-[#66d9ef]",
};

/**
 * テーマカラーを切り替えるドロップダウンを提供する
 */
export const ThemeSwitcher = () => {
  const themeColor = useThemeColor((state) => state);
  const { opened, close, toggle } = useToggle();
  const dropdownRef = useDismiss<HTMLDivElement>(opened, close);

  const currentThemeLabel = Themes.find(
    ({ value }) => value === themeColor.id,
  )?.label;

  const selectTheme = (id: ThemeId) => {
    themeColor.change(id);
    close();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
        onClick={toggle}
        aria-expanded={opened}
        aria-haspopup="listbox"
      >
        <span
          className={clsx("size-3 rounded-full", SwatchColors[themeColor.id])}
        />
        <span className="hidden tablet:inline">{currentThemeLabel ?? ""}</span>
      </button>

      {/* ドロップダウンメニュー */}
      {opened && (
        <div
          className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-edge bg-surface-raised py-1 shadow-lg"
          role="listbox"
          aria-label="テーマ選択"
        >
          <ThemeGroup
            id={themeColor.id}
            label="ライト"
            themes={LightThemes}
            onSelect={selectTheme}
          />

          <div className="my-1 border-t border-edge" />

          <ThemeGroup
            id={themeColor.id}
            label="ダーク"
            themes={DarkThemes}
            onSelect={selectTheme}
          />
        </div>
      )}
    </div>
  );
};

type ThemeGroupProps = {
  id: ThemeId;
  label: string;
  themes: readonly Theme[];
  onSelect: (theme: ThemeId) => void;
};

/**
 * ライト・ダークのグループ単位でテーマカラーの選択肢を描画する
 */
const ThemeGroup = ({ id, label, themes, onSelect }: ThemeGroupProps) => (
  <>
    <div className="px-3 py-1.5 text-xs font-medium text-ink-muted">
      {label}
    </div>
    {themes.map((theme) => (
      <button
        key={theme.value}
        type="button"
        role="option"
        aria-selected={id === theme.value}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-hover"
        onClick={() => onSelect(theme.value)}
      >
        <span
          className={clsx("size-3 rounded-full", SwatchColors[theme.value])}
        />
        <span className="flex-1 text-left">{theme.label}</span>
        {id === theme.value && <span className="text-accent">✓</span>}
      </button>
    ))}
  </>
);
