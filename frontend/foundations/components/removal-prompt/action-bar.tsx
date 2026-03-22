type ActionBarProps = {
  isPending: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
};

/**
 * 削除実行とキャンセルのボタンを縦並びで表示する
 */
export const ActionBar = ({
  isPending,
  submitLabel,
  onSubmit,
  onCancel,
}: ActionBarProps) => (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      onClick={onSubmit}
      disabled={isPending}
      className="w-full rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {submitLabel}
    </button>
    <button
      type="button"
      onClick={onCancel}
      disabled={isPending}
      className="w-full rounded-lg px-4 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      キャンセル
    </button>
  </div>
);
