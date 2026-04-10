"use client";

type SearchInputProps = {
  value: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onClear: () => void;
};

/**
 * キーワード検索用のテキスト入力と検索ボタンを提供する
 *
 * Enterキーまたは検索ボタンのクリックで明示的に検索を実行する
 */
export const SearchInput = ({
  value,
  disabled = false,
  onChange,
  onSubmit,
  onCompositionStart,
  onCompositionEnd,
  onClear,
}: SearchInputProps) => {
  const hasValue = !!value;

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex max-w-lg">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="7" cy="7" r="4" />
          <path d="M10 10l3 3" />
        </svg>
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={onChange}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          placeholder="スニペットを検索"
          maxLength={100}
          className="w-full rounded-l-lg border border-r-0 border-edge bg-surface py-2 pl-9 pr-8 text-base sm:text-sm text-ink placeholder:text-ink-muted transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
        />
        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted transition-colors hover:text-ink disabled:pointer-events-none"
            aria-label="検索をクリア"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-r-lg border border-edge bg-surface-raised px-3 text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink disabled:pointer-events-none disabled:opacity-60"
        aria-label="検索"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="7" cy="7" r="4" />
          <path d="M10 10l3 3" />
        </svg>
      </button>
    </form>
  );
};
