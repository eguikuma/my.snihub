type ActionItemProps = {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

/**
 * ボタン形式のメニュー項目を表示する
 */
export const ActionItem = ({
  disabled,
  onClick,
  children,
}: ActionItemProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full px-4 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
  >
    {children}
  </button>
);
