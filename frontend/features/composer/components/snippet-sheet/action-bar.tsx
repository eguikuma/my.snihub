import clsx from "clsx";
import { ButtonSpinner } from "@/foundations/components/button-spinner";

type ActionBarProps = {
  disabled: boolean;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: () => void;
};

/**
 * フォーム下部のキャンセル・作成ボタンを描画する
 */
export const ActionBar = ({
  disabled,
  isSubmitting,
  submitLabel = "作成する",
  onCancel,
  onSubmit,
}: ActionBarProps) => (
  <div className="flex items-center justify-end gap-3">
    <button
      type="button"
      onClick={onCancel}
      disabled={isSubmitting}
      className="rounded-lg px-4 py-2 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      キャンセル
    </button>
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      onClick={onSubmit}
      className={clsx(
        "flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors",
        disabled || isSubmitting
          ? "cursor-not-allowed bg-accent/50"
          : "bg-accent hover:bg-accent/90",
      )}
    >
      {isSubmitting && <ButtonSpinner />}
      {submitLabel}
    </button>
  </div>
);
