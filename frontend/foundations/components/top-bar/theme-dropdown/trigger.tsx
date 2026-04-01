type TriggerProps = {
  opened: boolean;
  onToggle: () => void;
};

/**
 * 現在のテーマカラーを丸いスウォッチで表示するトグルボタン
 */
export const Trigger = ({ opened, onToggle }: TriggerProps) => (
  <button
    type="button"
    className="rounded-md p-2 transition-colors hover:bg-surface-hover"
    onClick={onToggle}
    aria-expanded={opened}
    aria-haspopup="listbox"
    aria-label="テーマを切り替える"
  >
    <span className="block size-3 rounded-full bg-accent" />
  </button>
);
