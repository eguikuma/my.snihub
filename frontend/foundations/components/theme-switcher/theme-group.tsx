import clsx from "clsx";
import { ThemeIds, type Theme, type ThemeId } from "@/foundations/definitions";

export const SwatchColors: Record<ThemeId, string> = {
  [ThemeIds.GithubLight]: "bg-[#0969da]",
  [ThemeIds.SolarizedLight]: "bg-[#268bd2]",
  [ThemeIds.CatppuccinLatte]: "bg-[#1e66f5]",
  [ThemeIds.QuietLight]: "bg-[#4078c0]",
  [ThemeIds.GithubDark]: "bg-[#58a6ff]",
  [ThemeIds.Dracula]: "bg-[#bd93f9]",
  [ThemeIds.Nord]: "bg-[#88c0d0]",
  [ThemeIds.Monokai]: "bg-[#66d9ef]",
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
export const ThemeGroup = ({
  id,
  label,
  themes,
  onSelect,
}: ThemeGroupProps) => (
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
