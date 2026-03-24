"use client";

type SearchInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (event: React.CompositionEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

/**
 * キーワード検索用のテキスト入力とクリアボタンを提供する
 */
export const SearchInput = ({
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  onClear,
}: SearchInputProps) => {
  const hasValue = !!value;

  return (
    <div className="relative max-w-lg">
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
        onChange={onChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder="スニペットを検索"
        maxLength={100}
        className="w-full rounded-lg border border-edge bg-surface py-2 pl-9 pr-8 text-base sm:text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-accent focus:outline-none"
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted transition-colors hover:text-ink"
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
  );
};
