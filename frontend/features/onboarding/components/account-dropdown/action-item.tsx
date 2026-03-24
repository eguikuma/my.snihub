import { ButtonSpinner } from "@/foundations/components/button-spinner";

type ActionItemProps = {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

/**
 * ボタン形式のメニュー項目を表示する
 */
export const ActionItem = ({
  disabled,
  isLoading = false,
  onClick,
  children,
}: ActionItemProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
  >
    {isLoading && <ButtonSpinner />}
    {children}
  </button>
);
