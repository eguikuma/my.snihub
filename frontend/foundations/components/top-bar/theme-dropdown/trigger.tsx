import { ThemeAccentColors, type ThemeId } from "../../../definitions";

type TriggerProps = {
  themeId: ThemeId;
  themeLabel: string;
  opened: boolean;
  onToggle: () => void;
};

/**
 * 現在のテーマカラーを丸いスウォッチで表示するトグルボタン
 */
export const Trigger = ({
  themeId,
  themeLabel,
  opened,
  onToggle,
}: TriggerProps) => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
    onClick={onToggle}
    aria-expanded={opened}
    aria-haspopup="listbox"
  >
    <span
      className="size-3 rounded-full"
      style={{ backgroundColor: ThemeAccentColors[themeId] }}
    />
    <span className="hidden tablet:inline">{themeLabel}</span>
  </button>
);
