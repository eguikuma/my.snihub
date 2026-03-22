import clsx from "clsx";

type ActionBarProps = {
  disabled: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

/**
 * フォーム下部のキャンセル・作成ボタンを描画する
 */
export const ActionBar = ({
  disabled,
  isSubmitting,
  onCancel,
  onSubmit,
}: ActionBarProps) => (
  <div className="flex items-center justify-end gap-3">
    <button
      type="button"
      onClick={onCancel}
      className="rounded-lg px-4 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-hover"
    >
      キャンセル
    </button>
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      onClick={onSubmit}
      className={clsx(
        "rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors",
        disabled || isSubmitting
          ? "cursor-not-allowed bg-accent/50"
          : "bg-accent hover:bg-accent/90",
      )}
    >
      作成する
    </button>
  </div>
);
