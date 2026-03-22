import clsx from "clsx";
import { ExpirationOptions, type Expiration } from "@/foundations/definitions";

type ExpirationSelectorProps = {
  value: Expiration;
  onChange: (value: Expiration) => void;
};

/**
 * 有効期限を選択するセレクタを描画する
 */
export const ExpirationSelector = ({
  value,
  onChange,
}: ExpirationSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ExpirationOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              isSelected
                ? "border-accent bg-accent text-white"
                : "border-edge bg-surface-raised text-ink-secondary hover:border-edge-strong",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
