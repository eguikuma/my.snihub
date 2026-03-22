import clsx from "clsx";
import type { Theme, ThemeId } from "../../../definitions";
import { SWATCH_COLORS } from "./swatch-colors";

type GroupProps = {
  currentThemeId: ThemeId;
  label: string;
  themes: readonly Theme[];
  onSelect: (themeId: ThemeId) => void;
};

/**
 * ライト・ダークのグループ単位でテーマ選択肢を描画する
 */
export const Group = ({
  currentThemeId,
  label,
  themes,
  onSelect,
}: GroupProps) => (
  <>
    <div className="px-3 py-1.5 text-xs font-medium text-ink-muted">
      {label}
    </div>
    {themes.map((theme) => (
      <button
        key={theme.value}
        type="button"
        role="option"
        aria-selected={currentThemeId === theme.value}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-hover"
        onClick={() => onSelect(theme.value)}
      >
        <span
          className={clsx("size-3 rounded-full", SWATCH_COLORS[theme.value])}
        />
        <span className="flex-1 text-left">{theme.label}</span>
        {currentThemeId === theme.value && (
          <span className="text-accent">✓</span>
        )}
      </button>
    ))}
  </>
);
